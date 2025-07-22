import SvgLegal from '@assets/svg/legal.svg'
const items = [
  {
    name: 'Legal',
    meta: {
      icon: SvgLegal,
    },
  },
  {
    name: 'legal_content',
    list: '/legal/legal-content',
    create: '/legal/legal-content/create',
    edit: '/legal/legal-content/edit/:id',
    show: '/legal/legal-content/show/:id',
    meta: {
      canDelete: false,
      parent: 'Legal',
      label: 'Legal Content',
    },
  },
]

export default items
