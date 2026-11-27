import { ComingSoon } from '@/components/ComingSoon'

export default function ViewTransitionsPage() {
  return (
    <ComingSoon
      title="Cross-Document View Transitions"
      before="Framer Motion"
      after="@view-transition"
      lead="Page transitions with CSS — no Framer Motion."
      description="Page transitions without JavaScript using the View Transition API. Replace Framer Motion's page animations with CSS-driven cross-document transitions."
    />
  )
}

export const metadata = {
  title: 'View Transitions | CSS-Only Showcase',
  description: 'Replace Framer Motion page transitions with CSS @view-transition',
}
