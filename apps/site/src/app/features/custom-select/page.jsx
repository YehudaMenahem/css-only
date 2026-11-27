import { ComingSoon } from '@/components/ComingSoon'

export default function CustomSelectPage() {
  return (
    <ComingSoon
      title="Customizable Select"
      before="react-select"
      after="appearance: base-select"
      lead="Style a native select in CSS — no react-select."
      description="Styled select dropdowns without heavy JavaScript components. Replace react-select with customizable native select using appearance: base-select and ::picker pseudo-elements."
    />
  )
}

export const metadata = {
  title: 'Custom Select | CSS-Only Showcase',
  description: 'Replace react-select with appearance: base-select',
}
