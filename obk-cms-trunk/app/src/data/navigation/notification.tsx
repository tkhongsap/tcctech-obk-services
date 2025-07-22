import SvgBell from '@assets/svg/bell.svg'
const items = [
  {
    name: 'Notifications',
    meta: {
      icon: SvgBell,
    },
  },
  {
    name: 'inapp_notification',
    list: '/notifications/inapp/',
    create: '/notifications/inapp/create',
    edit: '/notifications/inapp/edit/:id',
    show: '/notifications/inapp/show/:id',
    meta: {
      parent: 'Notifications',
      canDelete: true,
      label: 'In-apps notifications',
    },
  },
  {
    name: 'draft_notification',
    list: '/notifications/draft',
    edit: '/notifications/inapp/edit/:id',
    meta: {
      parent: 'Notifications',
      canDelete: true,
      label: 'Draft(s)',
    },
  },
  {
    name: 'template_notification',
    list: '/notifications/template',
    create: '/notifications/template/create',
    edit: '/notifications/template/edit/:id',
    show: '/notifications/template/show/:id',
    meta: {
      parent: 'Notifications',
      canDelete: true,
      label: 'Templates',
    },
  },
  {
    name: 'categories',
    list: 'notifications/categories',
    create: '/notifications/categories/create',
    edit: '/notifications/categories/edit/:id',
    show: '/notifications/categories/show/:id',
    meta: {
      canDelete: true,
      parent: 'Notifications',
    },
  },
]
export default items
