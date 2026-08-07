'use client'

import { useRef, useState } from 'react'

// py/-my expand each layer's paint box so background-clip:text and the hover
// mask (both clipped to the border box) don't cut the 'y' descender, which
// overflows the tight leading-[0.85] line box. The negative margins cancel
// the padding in layout, so alignment and section height are unchanged.
const PAD = '0.25em'

const textClasses =
  'col-start-1 row-start-1 text-center whitespace-nowrap font-extrabold tracking-tighter leading-[0.85] text-[clamp(4.5rem,23.5vw,25rem)] py-[0.25em] -my-[0.25em]'

// --x/--y are measured from the grid container; the layer's border box starts
// 0.25em above it (padding pulled up by negative margin), so shift the mask
// center down by the same amount to keep it under the cursor.
const revealMask = `radial-gradient(circle 30vw at var(--x,30%) calc(var(--y,50%) + ${PAD}), rgba(0,0,0,1) 25%, rgba(0,0,0,0) 75%)`

/**
 * Giant outlined footer wordmark. On hover, a cool gradient fill is revealed
 * through a radial mask that follows the cursor (Sheryians-style).
 */
export default function FooterWordmark() {
  const containerRef = useRef(null)
  const [hovered, setHovered] = useState(false)

  const handleMouseMove = (e) => {
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    el.style.setProperty('--x', `${e.clientX - rect.left}px`)
    el.style.setProperty('--y', `${e.clientY - rect.top}px`)
  }

  return (
    <div aria-hidden="true" className="select-none py-4 sm:py-8">
      <div
        ref={containerRef}
        className="grid"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <p className={`${textClasses} text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.14)] sm:[-webkit-text-stroke:1.5px_rgba(255,255,255,0.14)]`}>
          MyTechz
        </p>
        <p
          className={`wordmark-fill ${textClasses} text-transparent bg-clip-text bg-linear-to-r from-blue-500 via-cyan-400 to-indigo-500 transition-opacity duration-500 ease-out motion-reduce:transition-none`}
          style={{
            opacity: hovered ? 1 : 0,
            WebkitMaskImage: revealMask,
            maskImage: revealMask,
          }}
        >
          MyTechz
        </p>
      </div>
    </div>
  )
}
