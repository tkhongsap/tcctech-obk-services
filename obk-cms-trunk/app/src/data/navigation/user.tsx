import SvgUser from '@assets/svg/user.svg'

const items = [
  {
    name: 'Users',
    meta: {
      icon: SvgUser,
    },
  },
  {
    name: 'all_users',
    list: '/users/all',
    create: '/users/all/create',
    edit: '/users/all/edit/:id',
    show: '/users/all/show/:id',
    meta: {
      parent: 'Users',
      label: 'All Users',
    },
  },
  {
    name: 'companies',
    list: '/users/company',
    create: '/users/company/create',
    edit: '/users/company/edit/:id',
    show: '/users/company/show/:id',
    meta: {
      parent: 'Users',
      label: 'Companies',
    },
  },
]

export default items
