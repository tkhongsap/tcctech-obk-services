import SvgLeaf from '@assets/svg/leaf.svg'
const items = [
  {
    name: 'Sustainability',
    meta: {
      icon: SvgLeaf,
    },
  },
  {
    name: 'prbanner',
    list: '/sustainability/prbanner',
    create: '/sustainability/prbanner/create',
    show: '/sustainability/prbanner/content/:id',
    edit: '/sustainability/prbanner/edit/:id',
    meta: {
      canDelete: false,
      parent: 'Sustainability',
      label: 'PR Banner',
    },
  },
  {
    name: 'all',
    list: '/sustainability/all',
    create: '/sustainability/all/create',
    edit: '/sustainability/all/edit/:id',
    show: '/sustainability/all/show/:id',
    meta: {
      canDelete: false,
      parent: 'Sustainability',
      label: 'Content Management',
    },
  },
  {
    name: 'library',
    list: '/sustainability/library',
    create: '/sustainability/library/create',
    edit: '/sustainability/library/edit/:id',
    meta: {
      canDelete: false,
      parent: 'Sustainability',
      label: 'Digital Library',
    },
  },
]
export default items
