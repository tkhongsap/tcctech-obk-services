export const EventRegistry = [
  {
    name: 'ob-iam.account.created',
    payload: {
      account_id: '',
      identities: [
        {
          identifier: '',
          provider: '',
          default: false,
        },
      ],
      push_token: {
        value: '',
        type: '',
      },
      profile: {
        first_name: '',
        middle_name: '',
        last_name: '',
        gender: '',
        dob: '',
      },
      device: {
        device_id: '',
        device_os: '',
        device_unique_id: '',
      },
    },
  },
  {
    name: 'ob-iam.profile.updated',
    payload: {
      account_id: '',
      first_name: '',
      middle_name: '',
      last_name: '',
      gender: '',
      dob: '',
    },
  },
  {
    name: 'ob-iam.identity.email_added',
    payload: {
      account_id: '',
      identity: {
        identifier: '',
        provider: '',
        default: false,
      },
    },
  },
  {
    name: 'ob-iam.identity.email_default_set',
    payload: {
      account_id: '',
      identity: {
        identifier: '',
        provider: '',
        default: false,
      },
    },
  },
  {
    name: 'ob-iam.identity.phone_added',
    payload: {
      account_id: '',
      identity: {
        identifier: '',
        provider: '',
        default: false,
      },
    },
  },
  {
    name: 'ob-iam.identity.phone_default_set',
    payload: {
      account_id: '',
      identity: {
        identifier: '',
        provider: '',
        default: false,
      },
    },
  },
  {
    name: 'ob-iam.account.password_reset',
    payload: {
      account_id: '',
    },
  },
  {
    name: 'ob-iam.account.password_set',
    payload: {
      account_id: '',
    },
  },
  {
    name: 'ob-iam.account.deleted',
    payload: {
      account_id: '',
    },
  },
  {
    name: 'ob-iam.account.reactivated',
    payload: {
      account_id: '',
    },
  },
  {
    name: 'ob-iam.device.added',
    payload: {
      device: {
        account_id: '',
        device_id: '',
        device_os: '',
        device_unique_id: '',
      },
    },
  },
  {
    name: 'ob-iam.setting.2fa_activated',
    payload: {
      account_id: '',
      setting: {
        two_factor_enable: true,
      },
    },
  },
  {
    name: 'ob-iam.setting.2fa_deactivated',
    payload: {
      account_id: '',
      setting: {
        two_factor_enable: false,
      },
    },
  },
  {
    name: 'ob-bms.member.created',
    payload: {
      member: {
        personID: '',
        tenantIDs: [],
        phones: [],
        emails: [],
        locations: [],
        updateTime: '',
        active: true,
        status: '',
      },
    },
  },
  {
    name: 'ob-iam.external_identity.created',
    payload: {
      external_identity: {
        id: '',
        uid: '',
        type: '',
        identifier: '',
        account_id: '',
        meta: {},
        created_at: '',
        updated_at: '',
      },
    },
  },
  {
    name: 'ob-bms.visitor.visited',
    payload: {
      pass: {
        id: '',
        uid: '',
        from: '',
        to: '',
        visitor_id: '',
        visit_schedule_id: '',
        issuer_id: '',
        status: '',
        created_at: '',
        updated_at: '',
        visitor_schedule: {
          tower_id: '',
          floor_id: '',
          from: '',
          to: '',
          repetition: '',
          visitor: {
            id: '',
            name: '',
            profile_image_url: '',
            email: '',
            company_name: '',
            reference: '',
            inviter_id: '',
          },
        },
        issuer: {
          id: '',
          uid: '',
          metadata: '',
          account_id: '',
          created_at: '',
          updated_at: '',
        },
      },
    },
  },
] as const;

export type EventName = (typeof EventRegistry)[number]['name'];
