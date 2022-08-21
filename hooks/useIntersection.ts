import type React from 'react'
import { useState, useLayoutEffect } from 'react'

const useIntersection = (
  element: React.RefObject<HTMLElement>,
  rootMargin = `0px`,
) => {
  const [isVisible, setState] = useState(false)

  useLayoutEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setState(entry.isIntersecting)
      },
      { rootMargin },
    )

    element.current && observer.observe(element.current)

    return () => observer.unobserve(element.current as HTMLElement)
  }, [])

  return isVisible
}

export default useIntersection
