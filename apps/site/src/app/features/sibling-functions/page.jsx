import { FeatureTemplate } from '@/components/FeatureTemplate'

export default function SiblingFunctionsPage() {
  return (
    <FeatureTemplate
      title="Sibling Index & Count"
      before="style={{'--i': index}} in .map()"
      after="sibling-index() / sibling-count()"
      description="Index-based styling without inline styles. Replace React's inline style pattern with CSS sibling-index() and sibling-count() functions."
    />
  )
}

export const metadata = {
  title: 'Sibling Functions | CSS-Only Showcase',
  description: 'Replace inline --i styles with sibling-index() and sibling-count()',
}
