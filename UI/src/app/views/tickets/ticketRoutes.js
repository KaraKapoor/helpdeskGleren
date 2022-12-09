import React, { lazy } from 'react'
import Loadable from 'app/components/Loadable'
import { authRoles } from '../../auth/authRoles'
import CreateTicket from './addTicket'
import MyTickets from './ticketsList'
import AllTickets from './allTicketsList'


const ticketRoutes = [
    {
        path: '/create-ticket',
        element: <CreateTicket></CreateTicket>
    },
    {
        path: '/my-reported-tickets',
        element: <MyTickets></MyTickets>
    },
    {
        path: 'all-tickets',
        element: <AllTickets></AllTickets>
    },
]

export default ticketRoutes
