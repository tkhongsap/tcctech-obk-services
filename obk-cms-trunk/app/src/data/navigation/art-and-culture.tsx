import SvgPaint from '@assets/svg/paint.svg'

const items = [
  {
    name: 'art_culture',
    label: 'Art & Culture',
    meta: {
      icon: SvgPaint,
    },
  },
  {
    name: 'art_landing',
    edit: '/art-and-culture/landing',
    meta: {
      canDelete: false,
      parent: 'art_culture',
      label: 'Landing Page',
    },
  },
  {
    name: 'art_c_type',
    list: '/art-and-culture/art-c',
    create: '/art-and-culture/art-c/create/:id',
    edit: '/art-and-culture/art-c/edit/:id',
    meta: {
      canDelete: false,
      parent: 'art_culture',
      label: 'Art & Culture Category',
    },
  },
  {
    name: 'art_c_category',
    list: '/art-and-culture/art-c/category/:typeId',
    create: '/art-and-culture/art-c/category/:typeId/create/:id',
    edit: '/art-and-culture/art-c/category/:typeId/edit/:id',
    meta: {
      canDelete: false,
      parent: 'art_c_type',
      label: 'Art & Culture Sub Category',
    },
  },
  {
    name: 'art_c_program',
    list: '/art-and-culture/programs',
    create: '/art-and-culture/programs/create/:id',
    edit: '/art-and-culture/programs/edit/:id',
    meta: {
      canDelete: false,
      parent: 'art_culture',
      label: 'Program',
    },
  },
  {
    name: 'art_c_program_add_on',
    list: '/art-and-culture/add-on',
    create: '/art-and-culture/add-on/create/:id',
    edit: '/art-and-culture/add-on/edit/:id',
    meta: {
      canDelete: false,
      parent: 'art_culture',
      label: 'Add-On Content',
    },
  },
  {
    name: 'art_c_faqs',
    list: '/art-and-culture/faqs',
    create: '/art-and-culture/faqs/create',
    edit: '/art-and-culture/faqs/edit/:id',
    order: '/art-and-culture/faqs/order',
    meta: {
      canDelete: true,
      parent: 'art_culture',
      label: 'Faqs',
    },
  },
  {
    name: 'art_c_partners',
    list: '/art-and-culture/partners',
    create: '/art-and-culture/partners/create',
    edit: '/art-and-culture/partners/edit/:id',
    meta: {
      canDelete: true,
      parent: 'art_culture',
      label: 'Partners',
    },
  },
]

export default items
