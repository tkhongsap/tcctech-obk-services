const items = [
  {
    name: 'what-happening',
    label: "What's Happening",
    meta: {},
  },
  {
    name: 'whats_happening',
    list: '/what-happening',
    create: '/what-happening/create',
    edit: '/what-happening/edit/:id',
    meta: {
      parent: 'Marcom',
      label: "What's Happening",
    },
  },
]
export default items
