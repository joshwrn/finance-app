import type React from 'react'
import { useState, useEffect } from 'react'

const useIntersection = (
  element: React.RefObject<HTMLElement>,
  rootMargin: string,
) => {
  const [isVisible, setState] = useState(false)

  useEffect(() => {
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
