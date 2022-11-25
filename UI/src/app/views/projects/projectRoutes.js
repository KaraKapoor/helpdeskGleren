import React, { lazy } from 'react'
import Loadable from 'app/components/Loadable'
import { authRoles } from '../../auth/authRoles'
const ProjectView = Loadable(lazy(() => import('./ProjectView')))


const projectRoutes = [
    {
        path: '/project',
        element: <ProjectView />,
        auth: authRoles.admin,
    },
]

export default projectRoutes
