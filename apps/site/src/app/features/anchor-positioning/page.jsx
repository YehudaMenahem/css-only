import { FeatureTemplate } from '@/components/FeatureTemplate'

export default function AnchorPositioningPage() {
  return (
    <FeatureTemplate
      title="Anchor Positioning & Popovers"
      before="Floating UI / Radix Tooltip"
      after="anchor-name + popover"
      description="Tooltips and popovers without JavaScript positioning libraries. Replace Floating UI or Radix components with CSS anchor positioning and the popover attribute."
    />
  )
}

export const metadata = {
  title: 'Anchor Positioning | CSS-Only Showcase',
  description: 'Replace Floating UI with CSS anchor positioning and popover',
}
