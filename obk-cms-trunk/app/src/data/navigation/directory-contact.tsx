const items = [
  {
    name: 'directory_contact',
    label: 'Directory Contact',
    meta: {},
  },
  {
    name: 'directoryContact',
    list: '/directory-contact',
    create: '/directory-contact/create',
    edit: '/directory-contact/edit/:id',
    show: '/directory-contact/show/:id',
    meta: {
      parent: 'directory_contact',
      label: 'Directory Contact',
    },
  },
]
export default items
