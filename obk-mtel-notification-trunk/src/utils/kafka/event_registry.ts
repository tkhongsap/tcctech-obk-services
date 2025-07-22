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
    name: 'ob-iam.identity.deleted',
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
    name: 'ob-bms.visitor_pass.created',
    payload: {
      visitor_email: '',
      invitation_link: '',
      tower_name: {},
      account_id: '',
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

  {
    name: 'ob-bms.service_request_status.updated',
    payload: {
      data: {
        id: '',
        image_url: [],
        requester_id: '',
        issue_type: {
          id: '',
          name: '',
          display_name: {},
          created_at: '',
          updated_at: '',
        },
        tower: {
          id: '',
          name: '',
          uid: '',
          project_id: '',
          display_name: {},
          created_at: '',
          updated_at: '',
        },
        floor: {
          id: '',
          name: '',
          uid: '',
          display_name: {},
          tower_id: '',
          created_at: '',
          updated_at: '',
        },
        requester: {
          id: '',
          uid: '',
          account_id: '',
          metadata: {},
          created_at: '',
          updated_at: '',
        },
        title: '',
        description: '',
        status: '',
        references: '',
        created_at: '',
        updated_at: '',
      },
    },
  },
  {
    name: 'ob-bms.air_condition_status.updated',
    payload: {
      data: {
        id: '',
        tower_id: '',
        floor_id: '',
        ac_zone_id: '',
        estimated_cost: '',
        from: '',
        to: '',
        duration_hour: 0,
        area_size: 0,
        status: '',
        rate: '',
        requester_id: '',
        created_at: '',
        updated_at: '',
        references: '',
        floor: {
          id: '',
          uid: '',
          name: '',
          display_name: {},
          tower_id: '',
          created_at: '',
          updated_at: '',
        },
        tower: {
          id: '',
          uid: '',
          name: '',
          display_name: {},
          project_id: '',
          created_at: '',
          updated_at: '',
        },
        ac_zone: {
          id: '',
          name: '',
          area_size: 0,
          floor_id: '',
          created_at: '',
          updated_at: '',
        },
        requester: {
          id: '',
          uid: '',
          account_id: '',
          metadata: {},
          created_at: '',
          updated_at: '',
        },
      },
    },
  },
  {
    name: 'ob-iam.otp_reference.created',
    payload: {
      identifier: '',
      reference: '',
      code: '',
    },
  },
  {
    name: 'ob-bms.air_condition_request.created',
    payload: {
      data: {
        id: '',
        tower_id: '',
        floor_id: '',
        ac_zone_id: '',
        estimated_cost: '',
        from: '',
        to: '',
        duration_hour: 0,
        area_size: 0,
        status: '',
        rate: '',
        requester_id: '',
        created_at: '',
        updated_at: '',
        references: '',
        floor: {
          id: '',
          uid: '',
          name: '',
          display_name: {},
          tower_id: '',
          created_at: '',
          updated_at: '',
        },
        tower: {
          id: '',
          uid: '',
          name: '',
          display_name: {},
          project_id: '',
          created_at: '',
          updated_at: '',
        },
        ac_zone: [
          {
            id: '',
            name: '',
            area_size: 0,
            floor_id: '',
            created_at: '',
            updated_at: '',
          },
        ],
        requester: {
          id: '',
          uid: '',
          account_id: '',
          metadata: {},
          created_at: '',
          updated_at: '',
        },
      },
    },
  },
  {
    name: 'ob-bms.service_request.created',
    payload: {
      data: {
        id: '',
        image_url: [],
        requester_id: '',
        issue_type: {
          id: '',
          name: '',
          display_name: {},
          created_at: '',
          updated_at: '',
        },
        tower: {
          id: '',
          name: '',
          uid: '',
          project_id: '',
          display_name: {},
          created_at: '',
          updated_at: '',
        },
        floor: {
          id: '',
          name: '',
          uid: '',
          display_name: {},
          tower_id: '',
          created_at: '',
          updated_at: '',
        },
        requester: {
          id: '',
          uid: '',
          account_id: '',
          metadata: {},
          created_at: '',
          updated_at: '',
        },
        title: '',
        description: '',
        status: '',
        references: '',
        created_at: '',
        updated_at: '',
      },
    },
  },
  {
    name: 'ob-iam.fcm_token.updated',
    payload: {
      account_id: '',
      push_token: {
        value: '',
        type: '',
      },
    },
  },
  {
    name: 'ob-iam.setting.updated',
    payload: {
      account_id: '',
      current_language: '',
    },
  },
  {
    name: 'ob-iam.device_and_fcm_token.added',
    payload: {
      account_id: '',
      push_token: {
        value: '',
        type: '',
      },
      device: {
        device_id: '',
        device_os: '',
        device_unique_id: '',
      },
    },
  },
  {
    name: 'ob-bms.visitor_resident_pass.created',
    payload: {
      visitor_email: '',
      invitation_link: '',
      tower_name: {},
      account_id: '',
      invite_house_number: '',
      invite_name: '',
      project_id: 0,
    },
  },
  {
    name: 'ob-bms.visitor_resident_vehicle_checkout.created',
    payload: {
      visitor_email: '',
      account_id: '',
      checkout_time: '',
    },
  },
  {
    name: 'ob-bms.art_c_booking.confirmed',
  },
] as const;

export type EventName = (typeof EventRegistry)[number]['name'];
