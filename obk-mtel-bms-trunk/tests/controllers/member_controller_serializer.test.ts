import { membersShowSerializer } from '../../src/controllers/members_controller.serializer';
import { PassStatus, TenantMemberRole, AccessorType } from '../../db/client/index';

describe('test member serializer', () => {
  it('should return data pass', async () => {
    const member = {
      id: 'test',
      uid: 'test',
      metadata: {},
      metadata_resident: {},
      account_id: 'test',
      default_floor: 'test',
      created_at: new Date('2024-01-13T20:15:41.425Z'),
      updated_at: new Date('2024-01-13T20:15:41.425Z'),
      passes: [
        {
          id: 'test',
          uid: 'test',
          metadata_resident: {},
          from: new Date('2024-01-13T20:15:41.425Z'),
          to: new Date('2024-01-13T20:15:41.425Z'),
          visitor_id: 'test',
          visit_schedule_id: 'test',
          issuer_id: 'test',
          status: PassStatus.confirmed,
          created_at: new Date('2024-01-13T20:15:41.425Z'),
          updated_at: new Date('2024-01-13T20:15:41.425Z'),
          consent: true,
          visitor: {
            id: 'test',
            name: 'test',
            profile_image_url: 'test',
            email: 'test',
            company_name: 'test',
            reference: 'a',
            inviter_id: 'test',
            created_at: new Date('2024-01-13T20:15:41.425Z'),
            updated_at: new Date('2024-01-13T20:15:41.425Z'),
          },
          visitor_schedule: {
            id: 'test',
            visitor_id: 'test',
            tower_id: 'test',
            floor_id: 'test',
            from: new Date('2024-01-13T20:15:41.425Z'),
            to: new Date('2024-01-13T20:15:41.425Z'),
            repetition: null,
            created_at: new Date('2024-01-13T20:15:41.425Z'),
            updated_at: new Date('2024-01-13T20:15:41.425Z'),
            deleted_at: null,
          },
        },
      ],
      tenant_members: [
        {
          id: 'test',
          tenant_id: 'test',
          member_id: 'test',
          role: TenantMemberRole.manager,
          setting: {},
          created_at: new Date('2024-01-13T20:15:41.425Z'),
          updated_at: new Date('2024-01-13T20:15:41.425Z'),
          tenant: {
            id: 'test',
            uid: 'test',
            name: 'name',
            display_name: { en: 'test' },
            email: 'test',
            phone_number: 'test',
            address: 'test',
            metadata: { en: 'test' },
            created_at: new Date('2024-01-13T20:15:41.425Z'),
            updated_at: new Date('2024-01-13T20:15:41.425Z'),
            authorized_location: [
              {
                id: 'test',
                tenant_id: 'test',
                member_id: 'test',
                pass_id: 'test',
                accessor_type: AccessorType.member,
                default: true,
                location_id: 'test',
                created_at: new Date('2024-01-13T20:15:41.425Z'),
                updated_at: new Date('2024-01-13T20:15:41.425Z'),
                location: {
                  id: 'test',
                  uid: 'test',
                  name: 'test',
                  coordinate: 'test',
                  tower_id: 'test',
                  zone_id: 'test',
                  floor_id: 'test',
                  created_at: new Date('2024-01-13T20:15:41.425Z'),
                  updated_at: new Date('2024-01-13T20:15:41.425Z'),
                },
              },
            ],
          },
        },
      ],
      authorized_locations: [
        {
          id: 'test',
          tenant_id: 'test',
          member_id: 'test',
          pass_id: 'test',
          accessor_type: 'member',
          default: true,
          location_id: 'test',
          created_at: new Date('2024-01-13T20:15:41.425Z'),
          updated_at: new Date('2024-01-13T20:15:41.425Z'),
          location: {
            id: 'test',
            uid: 'test',
            name: 'test',
            coordinate: 'test',
            tower_id: 'test',
            zone_id: 'test',
            floor_id: 'test',
            created_at: new Date('2024-01-13T20:15:41.425Z'),
            updated_at: new Date('2024-01-13T20:15:41.425Z'),
          },
        },
      ],
    };

    const towers = [
      {
        id: 'test',
        uid: 'test',
        name: 'test',
        display_name: { en: 'test' },
        project_id: 'test',
        created_at: new Date('2024-01-13T20:15:41.425Z'),
        updated_at: new Date('2024-01-13T20:15:41.425Z'),
        area_id: 'test',
        floors: [
          {
            id: 'test',
            uid: 'test',
            name: 'test',
            display_name: { en: 'test' },
            tower_id: 'test',
            created_at: new Date('2024-01-13T20:15:41.425Z'),
            updated_at: new Date('2024-01-13T20:15:41.425Z'),
            mapping: {},
            image: null,
          },
        ],
        locations: [
          {
            id: 'test',
            uid: 'test',
            name: 'test',
            coordinate: 'test',
            tower_id: 'test',
            zone_id: 'test',
            floor_id: 'test',
            created_at: new Date('2024-01-13T20:15:41.425Z'),
            updated_at: new Date('2024-01-13T20:15:41.425Z'),
          },
        ],
        mapping: {},
      },
    ];
    const data = {
      id: 'test',
      uid: 'test',
      account_id: 'test',
      metadata: {},
      created_at: '2024-01-13T20:15:41.425Z',
      updated_at: '2024-01-13T20:15:41.425Z',
      passes: [
        {
          id: 'test',
          uid: 'test',
          from: '2024-01-13T20:15:41.425Z',
          to: '2024-01-13T20:15:41.425Z',
          visitor_id: 'test',
          visit_schedule_id: 'test',
          issuer_id: 'test',
          status: 'confirmed',
          created_at: '2024-01-13T20:15:41.425Z',
          updated_at: '2024-01-13T20:15:41.425Z',
          consent: true,
          visitor: {
            id: 'test',
            name: 'test',
            profile_image_url: 'test',
            email: 'test',
            company_name: 'test',
            reference: 'a',
            inviter_id: 'test',
            created_at: '2024-01-13T20:15:41.425Z',
            updated_at: '2024-01-13T20:15:41.425Z',
          },
          visitor_schedule: {
            id: 'test',
            visitor_id: 'test',
            tower_id: 'test',
            floor_id: 'test',
            from: '2024-01-13T20:15:41.425Z',
            to: '2024-01-13T20:15:41.425Z',
            repetition: null,
            created_at: '2024-01-13T20:15:41.425Z',
            updated_at: '2024-01-13T20:15:41.425Z',
          },
        },
      ],
      towers: [
        {
          id: 'test',
          uid: 'test',
          name: 'test',
          display_name: {
            en: 'test',
          },
          project_id: 'test',
          created_at: '2024-01-13T20:15:41.425Z',
          updated_at: '2024-01-13T20:15:41.425Z',
          floors: [
            {
              id: 'test',
              uid: 'test',
              name: 'test',
              tower_id: 'test',
              display_name: {
                en: 'test',
              },
              created_at: '2024-01-13T20:15:41.425Z',
              updated_at: '2024-01-13T20:15:41.425Z',
            },
          ],
          locations: [
            {
              id: 'test',
              uid: 'test',
              name: 'test',
              tower_id: 'test',
              display_name: {
                en: 'test',
              },
              created_at: '2024-01-13T20:15:41.425Z',
              updated_at: '2024-01-13T20:15:41.425Z',
            },
          ],
          mapping: {},
        },
      ],
    };
    const result = membersShowSerializer(member, towers, [], false);

    expect(result?.id).toEqual(data.id);
  });
  it('should return null when member is null', async () => {
    const result = membersShowSerializer(null, [], [], false);

    expect(result).toBeNull();
  });
});
