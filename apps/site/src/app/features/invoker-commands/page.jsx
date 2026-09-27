import { FeatureTemplate } from '@/components/FeatureTemplate'

export default function InvokerCommandsPage() {
  return (
    <FeatureTemplate
      title="Modal & Dialog"
      before="useState / Radix Dialog"
      after="commandfor + command + closedby"
      description="Modals and dialogs without state management. Replace useState-driven modals or Radix Dialog with invoker commands (commandfor/command) and dialog closedby."
    />
  )
}

export const metadata = {
  title: 'Modal & Dialog | CSS-Only Showcase',
  description: 'Replace useState modals with commandfor and dialog closedby',
}
