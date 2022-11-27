import React, { lazy } from 'react'
import Loadable from 'app/components/Loadable'
import { authRoles } from '../../auth/authRoles'
const StatusView = Loadable(lazy(() => import('./statusView')))


const statusRoutes = [
    {
        path: '/status',
        element: <StatusView />,
        auth: authRoles.admin,
    },
]

export default statusRoutes
