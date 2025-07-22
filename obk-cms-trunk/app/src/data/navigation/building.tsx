import SvgUser from '@assets/svg/user.svg'
const items = [
  {
    name: 'building_service',
    meta: {
      icon: SvgUser,
      label: 'Building Service',
    },
  },
  {
    name: 'feedback_request',
    list: '/building/feedbackrequest',
    create: '/building/feedbackrequest/create',
    edit: '/building/feedbackrequest/edit/:id',
    show: '/building/feedbackrequest/show/:id',
    meta: {
      parent: 'building_service',
      label: 'Feedback Request',
    },
  },
  {
    name: 'service_request',
    list: '/building/servicerequest',
    create: '/building/servicerequest/create',
    edit: '/building/servicerequest/edit/:id',
    show: '/building/servicerequest/show/:id',
    meta: {
      parent: 'building_service',
      label: 'Service Request',
    },
  },
  {
    name: 'inspection_request',
    list: '/building/inspectionrequest',
    create: '/building/inspectionrequest/create',
    edit: '/building/inspectionrequest/edit/:id',
    show: '/building/inspectionrequest/show/:id',
    meta: {
      parent: 'building_service',
      label: 'Inspection Request',
    },
  },
  {
    name: 'issuetype',
    list: '/building/issuetype',
    create: '/building/issuetype/create',
    edit: '/building/issuetype/edit/:id',
    show: '/building/issuetype/show/:id',
    meta: {
      parent: 'building_service',
      label: 'Issue type',
    },
  },
  {
    name: 'ac_request',
    list: '/building/acrequest',
    create: '/building/acrequest/create',
    edit: '/building/acrequest/edit/:id',
    show: '/building/acrequest/show/:id',
    meta: {
      parent: 'building_service',
      label: 'AC Request',
    },
  },
  {
    name: 'work_request',
    list: '/building/workrequest',
    create: '/building/workrequest/create',
    edit: '/building/workrequest/edit/:id',
    show: '/building/workrequest/show/:id',
    meta: {
      parent: 'building_service',
      label: 'Work Request',
    },
  },
  {
    name: 'work_order',
    list: '/building/workorder',
    create: '/building/workorder/create',
    edit: '/building/workorder/edit/:id',
    show: '/building/workorder/show/:id',
    meta: {
      parent: 'building_service',
      label: 'Work Order',
    },
  },
]
export default items
