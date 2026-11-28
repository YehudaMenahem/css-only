'use client'

import dynamic from 'next/dynamic'

const ChromeBlob = dynamic(() => import('./ChromeBlob'), { ssr: false })

/**
 * Decorative chrome blob for the homepage hero, loaded in its own chunk on the client only.
 */
export default function HeroBlob() {
  return <ChromeBlob />
}
