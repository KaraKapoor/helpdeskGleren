import React, { lazy } from 'react'
import Loadable from 'app/components/Loadable'
import { authRoles } from '../../auth/authRoles'
const HolidayView = Loadable(lazy(() => import('./holidayView')))


const holidayRoutes = [
    {
        path: '/holidays',
        element: <HolidayView />,
        auth: authRoles.admin,
    },
]

export default holidayRoutes;
