import { Strings } from "config/strings";
import { authRoles } from "./auth/authRoles";

export const navigations = [
  { name: 'Dashboard', path: '/dashboard/default', icon: 'dashboard', auth: [authRoles.admin, authRoles.teamLead, authRoles.agent, authRoles.user].toString(), },

  { label: 'TICKETS', type: 'label', auth: [authRoles.admin, authRoles.teamLead, authRoles.agent, authRoles.user].toString() },
  { name: 'Reported by me ', icon: 'assignment', path: '/my-reported-tickets', auth: [authRoles.admin, authRoles.teamLead, authRoles.agent, authRoles.user].toString() },
  // { name: 'Escalated Tickets', icon: 'trending_down', path: '/ticket' },
  { name: 'All Tickets', icon: 'trending_up', path: '/all-tickets', auth: [authRoles.admin, authRoles.teamLead, authRoles.agent, authRoles.user].toString() },
  // { name: 'My Team', icon: 'people', path: '/ticket' },

  { label: 'ADMIN', type: 'label', auth: [authRoles.admin].toString() },
  {
    auth: [authRoles.admin].toString(),
    name: 'Core Configurations',
    icon: 'security',
    children: [
      { name: 'Teams', icon: 'people', path: '/teams', auth: [authRoles.admin].toString() },
      { name: 'Users', icon: 'group', path: '/users', auth: [authRoles.admin].toString() },
      { name: 'Escalation Configurations', icon: 'perm_data_setting', path: '/escalations', auth: [authRoles.admin].toString() },
      { name: 'Projects', icon: 'assignment', path: '/project', auth: [authRoles.admin].toString() },
      { name: 'Status', icon: 'do_not_disturb', path: '/status', auth: [authRoles.admin].toString() },
      { name: 'Departments', icon: 'assistant', path: '/departments', auth: [authRoles.admin].toString() },
      { name: 'Holidays', icon: 'assistant', path: '/holidays', auth: [authRoles.admin].toString() },
      { name: 'Fix Version', icon: 'build', path: '/fixedversion', auth: [authRoles.admin].toString() },
      // { name: 'Change Logo',icon:'image',path:'/ticket'},
    ],
  },


  // { label: 'PAGES', type: 'label' },
  // {
  //   name: 'Session/Auth',
  //   icon: 'security',
  //   children: [
  //     { name: 'Sign in', iconText: 'SI', path: '/session/signin' },
  //     { name: 'Sign up', iconText: 'SU', path: '/session/signup' },
  //     { name: 'Forgot Password', iconText: 'FP', path: '/session/forgot-password' },
  //     { name: 'Error', iconText: '404', path: '/session/404' },
  //   ],
  // },
  // { label: 'Components', type: 'label' },
  // {
  //   name: 'Components',
  //   icon: 'favorite',
  //   badge: { value: '30+', color: 'secondary' },
  //   children: [
  //     { name: 'Auto Complete', path: '/material/autocomplete', iconText: 'A' },
  //     { name: 'Buttons', path: '/material/buttons', iconText: 'B' },
  //     { name: 'Checkbox', path: '/material/checkbox', iconText: 'C' },
  //     { name: 'Dialog', path: '/material/dialog', iconText: 'D' },
  //     { name: 'Expansion Panel', path: '/material/expansion-panel', iconText: 'E' },
  //     { name: 'Form', path: '/material/form', iconText: 'F' },
  //     { name: 'Icons', path: '/material/icons', iconText: 'I' },
  //     { name: 'Menu', path: '/material/menu', iconText: 'M' },
  //     { name: 'Progress', path: '/material/progress', iconText: 'P' },
  //     { name: 'Radio', path: '/material/radio', iconText: 'R' },
  //     { name: 'Switch', path: '/material/switch', iconText: 'S' },
  //     { name: 'Slider', path: '/material/slider', iconText: 'S' },
  //     { name: 'Snackbar', path: '/material/snackbar', iconText: 'S' },
  //     { name: 'Table', path: '/material/table', iconText: 'T' },
  //   ],
  // },
  // {
  //   name: 'Charts',
  //   icon: 'trending_up',
  //   children: [{ name: 'Echarts', path: '/charts/echarts', iconText: 'E' }],
  // },
  // {
  //   name: 'Documentation',
  //   icon: 'launch',
  //   type: 'extLink',
  //   path: 'http://demos.ui-lib.com/matx-react-doc/',
  // },
  {
    name: 'Contact Us',
    type: 'extLink',
    icon: 'contacts',
    auth: [authRoles.admin, authRoles.teamLead, authRoles.agent, authRoles.user].toString(),
    path: Strings.GLEREN_WEBSITE + Strings.GLEREN_CONTACT_US_PATH,
  },
  {
    name: 'Report Bug',
    icon: 'bug_report',
    auth: [authRoles.admin, authRoles.teamLead, authRoles.agent, authRoles.user].toString(),
    path: '/bugReport',
  },
];
