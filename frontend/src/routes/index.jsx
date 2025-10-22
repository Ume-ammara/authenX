import App from '@/App'
import { Home } from '@/components/homelayout/Home'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
    component: RouteComponent,
})

function RouteComponent() {
    return <div><Home /></div>
}
