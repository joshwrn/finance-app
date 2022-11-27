import type React from 'react'
import { useState, useLayoutEffect, useRef } from 'react'

const useIntersection = <T extends HTMLDivElement>(
  rootMargin = `0px`,
): [ref: React.RefObject<T>, isVisible: boolean] => {
  const [isVisible, setState] = useState(false)
  const ref = useRef<T>(null)

  useLayoutEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setState(entry.isIntersecting)
      },
      { rootMargin },
    )

    const { current } = ref

    current && observer.observe(current)

    return () => observer.unobserve(current as T)
  }, [])

  return [ref, isVisible]
}

export default useIntersection
