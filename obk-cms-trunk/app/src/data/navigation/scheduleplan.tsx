const items = [
  {
    name: 'scheduleplan',
    label: 'Schedule Plan',
    meta: {},
  },
  {
    name: 'schedulePlan',
    list: '/guardtour/scheduleplan',
    create: '/guardtour/scheduleplan/create',
    edit: '/guardtour/scheduleplan/edit/:id',
    meta: {
      parent: 'scheduleplan',
      label: 'Schedule Plan',
    },
  },
]
export default items
