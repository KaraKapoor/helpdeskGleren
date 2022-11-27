import React, { lazy } from 'react'
import Loadable from 'app/components/Loadable'
import { authRoles } from '../../auth/authRoles'
const UserView = Loadable(lazy(() => import('./userView')))


const userRoutes = [
    {
        path: '/users',
        element: <UserView />,
        auth: authRoles.admin,
    },
]

export default userRoutes
