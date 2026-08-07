'use client'

// `as`: render as a different element/component (e.g. next/link's `Link`)
// instead of a native <button> — needed anywhere a Button is the single
// clickable target for a navigation (e.g. `<Button as={Link} href="/x">`).
// Nesting a real <button> inside an <a> is invalid HTML (interactive content
// inside interactive content) and makes the accessible role/click target
// unpredictable across browsers and assistive tech.
export default function Button({
  as: Component = 'button',
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  ...props
}) {
  const base =
    'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800',
    secondary:
      'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 active:bg-gray-100',
    ghost: 'text-gray-600 hover:bg-gray-100 active:bg-gray-200',
    danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  }

  const isNativeButton = Component === 'button'

  return (
    <Component
      className={`${base} ${variants[variant]} ${sizes[size]} ${disabled && !isNativeButton ? 'pointer-events-none' : ''} ${className}`}
      disabled={isNativeButton ? disabled : undefined}
      aria-disabled={!isNativeButton && disabled ? true : undefined}
      {...props}
    >
      {children}
    </Component>
  )
}
