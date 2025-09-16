import { useEffect, useState } from 'react'

export function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState<boolean>(false)

    useEffect(() => {
        if (typeof window === 'undefined' || typeof window.matchMedia === 'undefined') {
            return
        }

        const mediaQueryList = window.matchMedia(query)
        const updateMatches = () => setMatches(mediaQueryList.matches)

        updateMatches()
        mediaQueryList.addEventListener('change', updateMatches)
        return () => mediaQueryList.removeEventListener('change', updateMatches)
    }, [query])

    return matches
}


