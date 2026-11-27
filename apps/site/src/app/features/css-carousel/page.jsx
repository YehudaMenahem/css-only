import { ComingSoon } from '@/components/ComingSoon'

export default function CSSCarouselPage() {
  return (
    <ComingSoon
      title="CSS Carousel"
      before="Embla / Swiper"
      after="::scroll-button + ::scroll-marker"
      lead="Build a carousel in CSS — no Embla or Swiper."
      description="Carousels without JavaScript slider libraries. Replace Embla or Swiper with CSS scroll snap, ::scroll-button pseudo-elements, and scroll-state queries."
    />
  )
}

export const metadata = {
  title: 'CSS Carousel | CSS-Only Showcase',
  description: 'Replace Embla/Swiper with CSS scroll-button and scroll-marker',
}
