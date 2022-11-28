import React, { lazy } from 'react'
import Loadable from 'app/components/Loadable'
import { authRoles } from '../../auth/authRoles'
const DepartmentView = Loadable(lazy(() => import('./departmentView')))


const departmentRoutes = [
    {
        path: '/departments',
        element: <DepartmentView />,
        auth: authRoles.admin,
    },
]

export default departmentRoutes
