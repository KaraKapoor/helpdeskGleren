import AuthGuard from 'app/auth/AuthGuard';
import chartsRoute from 'app/views/charts/ChartsRoute';
import dashboardRoutes from 'app/views/dashboard/DashboardRoutes';
import materialRoutes from 'app/views/material-kit/MaterialRoutes';
import NotFound from 'app/views/sessions/NotFound';
import sessionRoutes from 'app/views/sessions/SessionRoutes';
import { Navigate } from 'react-router-dom';
import MatxLayout from './components/MatxLayout/MatxLayout';
import bugReportRoutes from './views/bugReport/bugReportRoutes';
import departmentRoutes from './views/Departments/departmentRoutes';
import escalationRoutes from './views/escalations/escalationRoutes';
import myProfileRoutes from './views/myProfile/myProfileRoutes';
import projectRoutes from './views/projects/projectRoutes';
import statusRoutes from './views/status/statusRoutes';
import FixedVersionRoutes from './views/Fixed Version/FixedVersionRoutes'
import teamRoutes from './views/teams/teamRoutes';
import ticketRoutes from './views/tickets/ticketRoutes';
import userRoutes from './views/users/userRoutes';
import holidayRoutes from './views/holidays/holidayRoutes';

const routes = [
  {
    element: (
      <AuthGuard>
        <MatxLayout />
      </AuthGuard>
    ),
    children: [...dashboardRoutes, ...chartsRoute, ...materialRoutes, ...projectRoutes, ...bugReportRoutes, ...myProfileRoutes, ...statusRoutes,...FixedVersionRoutes, ...userRoutes, ...departmentRoutes, ...escalationRoutes, ...teamRoutes, ...ticketRoutes, ...holidayRoutes],
  },
  ...sessionRoutes,
  { path: '/', element: <Navigate to="dashboard/default" /> },
  { path: '*', element: <NotFound /> },
];

export default routes;
