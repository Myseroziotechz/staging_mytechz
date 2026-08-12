'use client'

import { useMemo, useRef, useState, useLayoutEffect, useCallback } from 'react'
import { renderResumeTemplate } from '@/lib/resume/render-template'
import { SAMPLE_RESUME_DATA } from '@/lib/resume/sample-data'

// Wide enough that no template's own `max-width` (700–800px today, may vary
// per future template) is ever constrained by this reference frame — the
// template's own CSS always wins, so we measure its true natural size.
const REFERENCE_FRAME_WIDTH = 1200

/**
 * Renders a resume template at its natural size, then scales it to fit
 * (and centers it within) whatever box it's given — same idea as
 * `object-fit: contain`, but for live HTML/CSS instead of an <img>.
 *
 * Reused for both the small template-gallery card thumbnails and the larger
 * template detail/preview page — the container's size is the only thing
 * that differs between those two call sites.
 *
 * Every template's markup is `<style>.resume{...}</style><div class="resume">`
 * with the SAME class name and no scoping. That's harmless when only one
 * template is on screen (the editor), but the template gallery renders every
 * template at once — without isolation, whichever template's <style> tag is
 * last in the DOM wins the cascade for `.resume` on *every* card, so they'd
 * all render identically styled. A shadow root gives each instance real
 * style encapsulation (styles can't leak out or in) without needing to
 * rewrite/prefix each template's CSS selectors by hand.
 */
export default function ResumeTemplatePreview({ htmlTemplate, data, className = '' }) {
  const outerRef = useRef(null)
  const hostRef = useRef(null)
  const shadowRootRef = useRef(null)
  const [transform, setTransform] = useState(null)

  const html = useMemo(
    () => renderResumeTemplate(htmlTemplate, data || SAMPLE_RESUME_DATA),
    [htmlTemplate, data]
  )

  const recompute = useCallback(() => {
    const outer = outerRef.current
    const host = hostRef.current
    const shadowRoot = shadowRootRef.current
    if (!outer || !host || !shadowRoot) return

    // The injected markup is `<style>...</style><div class="resume">...</div>`
    // — a <style> tag contributes no visual box, so measure the first
    // non-<style> child, whatever the template names it.
    const resumeEl = Array.from(shadowRoot.children).find((el) => el.tagName !== 'STYLE')
    if (!resumeEl) return

    // getBoundingClientRect() reports the *rendered* (post-transform) box.
    // ResizeObserver fires an initial callback the moment it starts
    // observing, in addition to our explicit call below — so this runs at
    // least twice, and the second run would otherwise measure content that
    // already has the first run's scale applied, computing a "correction"
    // that undoes it (converging on scale ≈ 1 instead of the real fit).
    // Neutralising the transform before every measurement keeps this
    // idempotent regardless of how many times or when it's called; React's
    // next render reconciles `host.style.transform` back to the real value.
    const prevTransform = host.style.transform
    host.style.transform = 'none'
    const resumeRect = resumeEl.getBoundingClientRect()
    const hostRect = host.getBoundingClientRect()
    const outerRect = outer.getBoundingClientRect()
    host.style.transform = prevTransform

    if (!resumeRect.width || !resumeRect.height) return

    const scale = Math.min(outerRect.width / resumeRect.width, outerRect.height / resumeRect.height)
    if (!(scale > 0) || !Number.isFinite(scale)) return

    // Centre the *resume element* (not the wide reference frame it sits in)
    // within the outer box: scale from the frame's origin, then translate so
    // the resume's own centre lands on the outer box's centre.
    const resumeCenterX = resumeRect.left - hostRect.left + resumeRect.width / 2
    const resumeCenterY = resumeRect.top - hostRect.top + resumeRect.height / 2
    const tx = outerRect.width / 2 - resumeCenterX * scale
    const ty = outerRect.height / 2 - resumeCenterY * scale

    setTransform(`translate(${tx}px, ${ty}px) scale(${scale})`)
  }, [])

  useLayoutEffect(() => {
    const host = hostRef.current
    if (!host) return

    if (!shadowRootRef.current) {
      shadowRootRef.current = host.attachShadow({ mode: 'open' })
    }
    shadowRootRef.current.innerHTML = html

    recompute()
    const ro = new ResizeObserver(recompute)
    if (outerRef.current) ro.observe(outerRef.current)
    ro.observe(host)
    return () => ro.disconnect()
  }, [recompute, html])

  return (
    <div ref={outerRef} className={`relative w-full h-full overflow-hidden bg-white ${className}`}>
      <div
        ref={hostRef}
        style={{
          width: REFERENCE_FRAME_WIDTH,
          // No transform until we have a real measurement — `getBoundingClientRect()`
          // reports the *rendered* (post-transform) box, so starting at
          // `scale(0)` would make the content we're trying to measure
          // report zero size, a chicken-and-egg deadlock. `opacity` alone
          // hides the unscaled flash without affecting layout measurement.
          transform: transform || 'none',
          transformOrigin: '0 0',
          opacity: transform ? 1 : 0,
        }}
      />
    </div>
  )
}
