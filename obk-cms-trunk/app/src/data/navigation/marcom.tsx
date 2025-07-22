import SvgContent from '@assets/svg/content.svg'
const items = [
  {
    name: 'Marcom',
    meta: {
      icon: SvgContent,
    },
  },
  {
    name: 'hero',
    list: '/marcom/hero',
    create: '/marcom/hero/create',
    show: '/marcom/hero/content/:id',
    edit: '/marcom/hero/edit/:id',
    meta: {
      canDelete: false,
      parent: 'Marcom',
      label: 'Hero Banner',
    },
  },
  {
    name: 'event',
    list: '/marcom/event',
    create: '/marcom/event/create',
    show: '/marcom/event/content/:id',
    edit: '/marcom/event/edit/:id',
    meta: {
      canDelete: false,
      parent: 'Marcom',
      label: 'Special Event',
    },
  },
  {
    name: 'explore',
    list: '/marcom/explore',
    create: '/marcom/explore/create',
    show: '/marcom/explore/content/:id',
    edit: '/marcom/explore/edit/:id',
    meta: {
      canDelete: false,
      parent: 'Marcom',
      label: 'Explore One Bangkok',
    },
  },
  {
    name: 'happening',
    list: '/marcom/happening',
    create: '/marcom/happening/create',
    createsub: '/marcom/happening/createsub/:id',
    edit: '/marcom/happening/edit/:id',
    show: '/marcom/happening/content/:id',
    order: '/marcom/happening/order',
    meta: {
      canDelete: false,
      parent: 'Marcom',
      label: `What's Happening`,
    },
  },
]
export default items
