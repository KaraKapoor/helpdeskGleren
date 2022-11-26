import React, { lazy } from 'react'
import Loadable from 'app/components/Loadable'
import { authRoles } from '../../auth/authRoles'
const BugReportView = Loadable(lazy(() => import('./bugReportView')))


const bugReportRoutes = [
    {
        path: '/bugReport',
        element: <BugReportView />
    },
]

export default bugReportRoutes
