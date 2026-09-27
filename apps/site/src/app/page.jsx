import { Modal } from 'css-only-kit'
import 'css-only-kit/Modal.css'
import './page.css'

/**
 * Home page component
 */
export default function HomePage() {
  const features = [
    {
      id: 'view-transitions',
      title: 'View Transitions',
      before: 'Framer Motion',
      after: '@view-transition',
      href: '/features/view-transitions',
    },
    {
      id: 'scroll-animations',
      title: 'Scroll Animations',
      before: 'GSAP ScrollTrigger',
      after: 'animation-timeline',
      href: '/features/scroll-animations',
    },
    {
      id: 'anchor-positioning',
      title: 'Anchor Positioning',
      before: 'Floating UI / Radix',
      after: 'anchor-name + popover',
      href: '/features/anchor-positioning',
    },
    {
      id: 'invoker-commands',
      title: 'Modal & Dialog',
      before: 'useState / Radix',
      after: 'commandfor + closedby',
      href: '/features/invoker-commands',
    },
    {
      id: 'custom-select',
      title: 'Custom Select',
      before: 'react-select',
      after: 'appearance: base-select',
      href: '/features/custom-select',
    },
    {
      id: 'css-carousel',
      title: 'CSS Carousel',
      before: 'Embla / Swiper',
      after: '::scroll-button pseudo',
      href: '/features/css-carousel',
    },
    {
      id: 'sibling-functions',
      title: 'Sibling Functions',
      before: 'style={{\'--i\': index}}',
      after: 'sibling-index()',
      href: '/features/sibling-functions',
    },
  ]

  return (
    <>
      <section className="hero section">
        <div className="container">
          <div className="hero-content content-narrow">
            <h1 className="hero-title">
              You don&apos;t need a new project.
              <br />
              Just swap the component.
            </h1>
            <p className="hero-subtitle">
              Modern CSS can replace JavaScript for interactions you thought required React state,
              effects, and event handlers. This is a showcase of measured trade-offs for senior
              frontend developers at React-first teams.
            </p>
            <div className="hero-actions">
              <Modal id="demo-modal" trigger="Try a CSS-Only Modal" triggerClassName="btn btn-primary">
                <h2>This modal uses zero JavaScript</h2>
                <p style={{ marginTop: 'var(--space-sm)', color: 'var(--color-text-dim)' }}>
                  It&apos;s powered by <code>commandfor</code> + <code>command</code> attributes and{' '}
                  <code>&lt;dialog closedby&gt;</code>. No useState, no event handlers, no
                  &quot;use client&quot;.
                </p>
                <p style={{ marginTop: 'var(--space-sm)', color: 'var(--color-text-dim)' }}>
                  This component is a React Server Component. Close with the × button or click
                  outside.
                </p>
              </Modal>
            </div>
          </div>
        </div>
      </section>

      <section className="features section">
        <div className="container">
          <h2 className="section-title">Seven CSS-Only Replacements</h2>
          <div className="features-grid">
            {features.map((feature) => (
              <a key={feature.id} href={feature.href} className="feature-card">
                <h3 className="feature-title">{feature.title}</h3>
                <div className="feature-comparison">
                  <div className="comparison-item">
                    <span className="comparison-label">Before</span>
                    <code className="comparison-value">{feature.before}</code>
                  </div>
                  <div className="comparison-arrow">→</div>
                  <div className="comparison-item">
                    <span className="comparison-label">After</span>
                    <code className="comparison-value">{feature.after}</code>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="pitch section">
        <div className="container content-narrow">
          <h2 className="pitch-title">For React teams shipping to real users</h2>
          <div className="pitch-content stack-md">
            <p>
              You don&apos;t need to rewrite your app. When the performance trade-off is worth it, swap
              individual components: one <code>&lt;Modal&gt;</code>, one carousel, one tooltip.
            </p>
            <p>
              Each feature page shows measured bundle size, main-thread time, and Interaction to
              Next Paint (INP) costs, plus an honest verdict on browser support and complexity.
            </p>
            <p>
              The component kit is designed for gradual adoption: React Server Components, CSS in
              cascade layers for easy theming, and clear fallback guidance.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
