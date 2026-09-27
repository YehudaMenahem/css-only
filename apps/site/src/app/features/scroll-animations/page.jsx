import { FeatureTemplate } from '@/components/FeatureTemplate'

export default function ScrollAnimationsPage() {
  return (
    <FeatureTemplate
      title="Scroll-Driven Animations"
      before="GSAP ScrollTrigger / Motion useScroll"
      after="animation-timeline"
      description="Scroll-linked animations without JavaScript. Replace GSAP ScrollTrigger or Motion's useScroll hook with CSS animation-timeline and scroll()."
    />
  )
}

export const metadata = {
  title: 'Scroll Animations | CSS-Only Showcase',
  description: 'Replace GSAP ScrollTrigger with CSS animation-timeline',
}
