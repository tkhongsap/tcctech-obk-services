import SvgBuilding from '@assets/svg/building.svg'
const items = [
  {
    name: 'building_access',
    meta: {
      icon: SvgBuilding,
      label: 'Building Access',
    },
  },
  {
    name: 'tenant',
    list: '/buildingaccess/tenant',
    show: '/buildingaccess/tenant/show/:id',
    meta: {
      parent: 'building_access',
      label: 'Tenants Access',
    },
  },
  {
    name: 'visitors',
    list: '/buildingaccess/visitors',
    show: '/buildingaccess/visitors/show/:id',
    meta: {
      parent: 'buildingaccess',
      label: 'visitors Access',
    },
  },
]

export default items
