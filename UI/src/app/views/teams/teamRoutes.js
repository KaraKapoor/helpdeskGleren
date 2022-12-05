import React, { lazy } from 'react'
import Loadable from 'app/components/Loadable'
import { authRoles } from '../../auth/authRoles'
const TeamView = Loadable(lazy(() => import('./teamView')))


const teamRoutes = [
    {
        path: '/teams',
        element: <TeamView />,
        auth: authRoles.admin,
    },
]

export default teamRoutes
