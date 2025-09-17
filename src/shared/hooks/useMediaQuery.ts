import { useEffect, useState } from 'react'

export function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState<boolean>(false)
    const [hasMounted, setHasMounted] = useState<boolean>(false)

    useEffect(() => {
        setHasMounted(true)
        if (typeof window === 'undefined' || typeof window.matchMedia === 'undefined') {
            return
        }

        const mediaQueryList = window.matchMedia(query)
        const updateMatches = () => setMatches(mediaQueryList.matches)

        updateMatches()
        mediaQueryList.addEventListener('change', updateMatches)
        return () => mediaQueryList.removeEventListener('change', updateMatches)
    }, [query])

    // Return false during SSR and initial render to prevent hydration mismatch
    if (!hasMounted) {
        return false
    }

    return matches
}


