import { Strings } from "config/strings";

export const navigations = [
  { name: 'Dashboard', path: '/dashboard/default', icon: 'dashboard' },

  { label: 'TICKETS', type: 'label' },
  { name: 'My Tickets',icon:'assignment',path:'/ticket'},
  { name: 'Escalated Tickets',icon:'trending_down',path:'/ticket'},
  { name: 'All Tickets',icon:'trending_up',path:'/ticket'},
  { name: 'My Team',icon:'people',path:'/ticket'},

  { label: 'ADMIN', type: 'label' },
  {
    name: 'Core Configurations',
    icon: 'security',
    children: [
      { name: 'Teams',icon:'people',path:'/ticket'},
      { name: 'Users',icon:'group',path:'/users'},
      { name: 'Escalation Configurations',icon:'perm_data_setting',path:'/ticket'},
      { name: 'Projects',icon:'assignment',path:'/project'},
      { name: 'Status',icon:'do_not_disturb',path:'/status'},
      { name: 'Departments',icon:'assistant',path:'/departments'},
      { name: 'Change Logo',icon:'image',path:'/ticket'},
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
    path: Strings.GLEREN_WEBSITE + Strings.GLEREN_CONTACT_US_PATH,
  },
  {
    name: 'Report Bug',
    icon: 'bug_report',
    path: '/bugReport',
  },
];
