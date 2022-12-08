import React, { lazy } from 'react'
import Loadable from 'app/components/Loadable'
import { authRoles } from '../../auth/authRoles'
import CreateTicket from './addTicket'
import MyTickets from './ticketsList'


const ticketRoutes = [
    {
        path: '/create-ticket',
        element: <CreateTicket></CreateTicket>
    },
    {
        path: '/my-tickets',
        element: <MyTickets></MyTickets>
    },
]

export default ticketRoutes
