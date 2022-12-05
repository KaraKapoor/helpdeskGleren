import React, { lazy } from 'react'
import Loadable from 'app/components/Loadable'
import { authRoles } from '../../auth/authRoles'
const EscalationsView = Loadable(lazy(() => import('./escalationView')))


const escalationRoutes = [
    {
        path: '/escalations',
        element: <EscalationsView />,
        auth: authRoles.admin,
    },
]

export default escalationRoutes
