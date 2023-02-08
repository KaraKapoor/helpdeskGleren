import React, { lazy } from 'react'
import Loadable from 'app/components/Loadable'
import { authRoles } from '../../auth/authRoles'
const TenantSettingsView = Loadable(lazy(() => import('./tenantSettingsView')))


const tenantSettingsRoutes = [
    {
        path: '/tenantSettings',
        element: <TenantSettingsView />,
        auth: authRoles.admin
    },
]

export default tenantSettingsRoutes
