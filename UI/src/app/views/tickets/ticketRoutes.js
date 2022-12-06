import React, { lazy } from 'react'
import Loadable from 'app/components/Loadable'
import { authRoles } from '../../auth/authRoles'
import CreateTicket from './addTicket'


const ticketRoutes = [
    {
        path: '/create-ticket',
        element: <CreateTicket></CreateTicket>
    },
]

export default ticketRoutes
