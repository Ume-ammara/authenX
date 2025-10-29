import * as React from 'react'
import { useEffect } from 'react'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { useAppDispatch, useAppSelector } from '@/hooks/hooks'
import { fetchUser } from '@/redux/features/authThunks'


export const Route = createRootRoute({
    component: RootComponent,
})

function RootComponent() {
    const dispatch = useAppDispatch()
    const { user } = useAppSelector((state) => state.auth)
    useEffect(() => {
        if (!user) dispatch(fetchUser)
    }, [dispatch, user])
    return (

        <React.Fragment>
            <Outlet />
            <TanStackRouterDevtools />
        </React.Fragment>

    )
}
