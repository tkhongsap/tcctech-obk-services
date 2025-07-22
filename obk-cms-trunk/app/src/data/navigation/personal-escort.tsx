const items = [
  {
    name: 'personal_escort',
    label: 'Personal Escort',
    meta: {},
  },
  {
    name: 'personalEscort',
    list: '/personal-escort',
    create: '/personal-escort/create',
    edit: '/personal-escort/edit/:id',
    show: '/personal-escort/show/:id',
    meta: {
      parent: 'personal_escort',
      label: 'Personal Escort',
    },
  },
]
export default items
