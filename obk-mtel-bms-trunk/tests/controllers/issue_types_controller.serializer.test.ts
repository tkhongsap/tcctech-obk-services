import { issueTypsSerializer } from '../../src/controllers/issue_types_controller.serializer';

describe('test issue type serializer', () => {
  it('should return data pass', async () => {
    const issueType = [
      {
        id: 'test-issue-type',
        name: 'test-issue-type-name',
        display_name: {},
        created_at: new Date('2024-01-13T20:15:41.425Z'),
        updated_at: new Date('2024-01-13T20:15:41.425Z'),
        deleted_at: new Date('2024-01-13T20:15:41.425Z'),
        internal_remark: '',
      },
    ];

    const result = issueTypsSerializer(issueType);

    expect(result && result[0].id).toEqual(issueType[0].id);
  });
  it('should return null when member is null', async () => {
    const result = issueTypsSerializer([]);

    expect(result).toEqual([]);
  });
});
