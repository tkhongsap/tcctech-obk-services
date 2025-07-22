import SvgRole from '@assets/svg/role.svg'
const items = [
  {
    name: 'Members & Roles',
    meta: {
      icon: SvgRole,
    },
  },
  {
    name: 'member',
    list: '/roles/member',
    create: '/roles/member/create',
    edit: '/roles/member/edit/:id',
    show: '/users/member/show/:id',
    meta: {
      parent: 'Members & Roles',
      label: 'Member management',
    },
  },
  {
    name: 'role',
    list: '/roles/role',
    create: '/roles/role/create',
    edit: '/roles/role/edit/:id',
    show: '/roles/role/show/:id',
    meta: {
      parent: 'Members & Roles',
      label: 'Role management',
    },
  },
]
export default items
