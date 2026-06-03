import SignupForm from '@/components/auth/SignupForm'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/signup')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div><SignupForm /></div>
}
