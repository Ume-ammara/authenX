import SignupForm from '@/components/auth/signupForm'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/signup')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div><SignupForm /></div>
}
