import SvgSupport from '@assets/svg/support.svg'
const items = [
  {
    name: 'Support',
    meta: {
      icon: SvgSupport,
    },
  },
  {
    name: 'faqs',
    list: '/support/faqs',
    create: '/support/faqs/create',
    edit: '/support/faqs/edit/:id',
    show: '/support/faqs/show/:id',
    meta: {
      canDelete: false,
      parent: 'Support',
      label: 'FAQs',
    },
  },
  {
    name: 'contactCenter',
    list: '/support/contact-center',
    meta: {
      canDelete: false,
      parent: 'Support',
      label: 'Contact Center',
      subject: 'Contact Center Information',
    },
  },
  {
    name: 'appVersion',
    list: '/support/app-version',
    create: '/support/app-version/create',
    edit: '/support/app-version/edit/:id',
    show: '/support/app-version/show/:id',
    meta: {
      canDelete: false,
      parent: 'Support',
      label: 'App Version',
    },
  },
  {
    name: 'appMaintenance',
    list: '/support/app-maintenance',
    create: '/support/app-maintenance/create',
    edit: '/support/app-maintenance/edit/:id',
    show: '/support/app-maintenance/show/:id',
    meta: {
      canDelete: false,
      parent: 'Support',
      label: 'App Maintenance',
    },
  },
]
export default items
