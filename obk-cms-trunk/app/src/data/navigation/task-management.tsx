const items = [
  {
    name: 'task-management',
    label: 'Task Management',
    meta: {},
  },
  {
    name: 'taskManagement',
    list: '/guardtour/task-management',
    create: '/guardtour/task-management/create',
    show: '/guardtour/task-management/view/:id',
    edit: '/guardtour/task-management/edit/:id',
    meta: {
      parent: 'task-management',
      label: 'Task Management',
    },
  },
]
export default items
