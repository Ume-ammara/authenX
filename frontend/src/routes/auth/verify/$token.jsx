import VerifyEmail from '@/components/auth/VerifyEmail'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/verify/$token')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div><VerifyEmail /></div>
}
