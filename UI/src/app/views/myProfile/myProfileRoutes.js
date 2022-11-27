import React, { lazy } from 'react'
import Loadable from 'app/components/Loadable'
const MyProfileView = Loadable(lazy(() => import('./myProfileView')))


const myProfileRoutes = [
    {
        path: '/user-profile',
        element: <MyProfileView />
    },
]

export default myProfileRoutes
