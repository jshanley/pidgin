import { useState, useEffect } from 'react'

export function useScrollSpy(containerRef, sectionSelector = 'section[id]', enabled = true) {
  const [activeId, setActiveId] = useState(null)

  useEffect(() => {
    if (!enabled) return
    const container = containerRef?.current
    if (!container) return

    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      const sections = container.querySelectorAll(sectionSelector)
      if (sections.length === 0) return

      const observer = new IntersectionObserver(
        entries => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              setActiveId(entry.target.id)
              break
            }
          }
        },
        {
          root: container,
          rootMargin: '-10% 0px -80% 0px',
          threshold: 0
        }
      )

      sections.forEach(section => observer.observe(section))

      // Store for cleanup
      container._scrollSpyObserver = observer
    }, 50)

    return () => {
      clearTimeout(timeoutId)
      container._scrollSpyObserver?.disconnect()
    }
  }, [containerRef, sectionSelector, enabled])

  return activeId
}

export function useUrlHash() {
  const [hash, setHash] = useState(() => window.location.hash.slice(1))

  useEffect(() => {
    const handleHashChange = () => setHash(window.location.hash.slice(1))
    window.addEventListener('hashchange', handleHashChange)
    window.addEventListener('popstate', handleHashChange)
    return () => {
      window.removeEventListener('hashchange', handleHashChange)
      window.removeEventListener('popstate', handleHashChange)
    }
  }, [])

  const navigate = (id, addToHistory = true) => {
    if (addToHistory) {
      window.history.pushState(null, '', `#${id}`)
    } else {
      window.history.replaceState(null, '', `#${id}`)
    }
    setHash(id)
  }

  return { hash, navigate }
}

// Custom scroll within a container with controllable duration
export function scrollToElement(el, container, duration = 300) {
  if (!el || !container) return

  const start = container.scrollTop
  const offset = 32 // 2rem breathing room
  const targetTop = el.offsetTop - offset
  const distance = targetTop - start
  const startTime = performance.now()

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3)
  }

  function step(currentTime) {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    const eased = easeOutCubic(progress)

    container.scrollTop = start + distance * eased

    if (progress < 1) {
      requestAnimationFrame(step)
    }
  }

  requestAnimationFrame(step)
}
