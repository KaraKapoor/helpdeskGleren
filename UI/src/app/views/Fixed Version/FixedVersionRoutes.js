import React, { lazy } from 'react'
import Loadable from 'app/components/Loadable'
import { authRoles } from '../../auth/authRoles'
const FixedVersionView = Loadable(lazy(() => import('./FixedVersionView')))


const FixedVersionRoutes = [
    {
        path: '/fixedversion',
        element: <FixedVersionView />,
        auth: authRoles.admin,
    },
]

export default FixedVersionRoutes
