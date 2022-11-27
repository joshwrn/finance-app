import type { RefObject } from 'react'
import { useEffect, useRef, useState } from 'react'

export const useSticky = (): [
  isStuck: boolean,
  ref: RefObject<HTMLDivElement> | null,
] => {
  const [isStuck, setIsStuck] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const cachedRef = ref.current
    if (cachedRef) {
      const observer = new IntersectionObserver(
        ([e]) => setIsStuck(e.boundingClientRect.top < 0),
        {
          threshold: [1],
        },
      )
      observer.observe(cachedRef)
      return () => observer.unobserve(cachedRef)
    }
  }, [ref.current])

  return [isStuck, ref]
}

export default useSticky
