const items = [
  {
    name: 'car-park',
    list: '/car-park/cars-access-activities',
    show: '/car-park/cars-access-activities/show/:id',
    meta: {
      parent: 'Car_park',
      label: 'Car access activities',
    },
  },
  {
    name: 'self-redemption-record',
    list: '/car-park/self-redemtion-record',
    show: '/car-park/self-redemtion-record/show/:id',
    meta: {
      parent: 'Car_park',
      label: 'Self Redemption',
    },
  },
  {
    name: 'campaign',
    list: '/car-park/campaign-management',
    meta: {
      parent: 'Car_park',
      label: 'Campaign management',
    },
  },
  {
    name: 'store_whitelist',
    list: '/car-park/store-whitelists',
    create: '/car-park/store-whitelists/create',
    edit: '/car-park/store-whitelists/edit/:id',
  },
]
export default items
