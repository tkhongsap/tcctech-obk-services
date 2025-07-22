const items = [
  {
    name: 'action-management',
    label: 'Action Management',
    meta: {},
  },
  {
    name: 'actionManagement',
    list: '/guardtour/action-management',
    create: '/guardtour/action-management/create',
    edit: '/guardtour/action-management/edit/:id',
    meta: {
      parent: 'action-management',
      label: 'Action Management',
    },
  },
]
export default items
