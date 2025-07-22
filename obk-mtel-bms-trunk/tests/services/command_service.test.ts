import { createTestData } from '../fixtures';
import { CommandService } from '../../src/services';
import FSClient from '../../src/libs/fs_client';
import { CommandLiftCallData } from '../../src/services/command_service';
import { resetDB } from '../helpers/db';
FSClient.token = 'mock';

let testData: any;
let commandService: CommandService;

let spy: any;

afterEach(() => {
  spy && spy.mockRestore();
});

beforeEach(async () => {
  await resetDB();
  testData = await createTestData();
  commandService = new CommandService(testData.member);
});

describe('CommandService', () => {
  describe('excute', () => {
    describe('with invalid command', () => {
      it('thorw Command not found', async () => {
        await expect(commandService.execute('xx.xx', {})).rejects.toThrow("Command 'xx.xx' not found.");
      });
    });
    describe('liftCall', () => {
      it('return command', async () => {
        spy = jest.spyOn(FSClient.httpClient, 'post').mockResolvedValueOnce({
          data: {
            data: {
              personID: 'test',
              liftName: 'AAA',
              floorID: 1,
              floorName: 'test',
            },
            message: 'success',
            status: 0,
          },
        });

        const result = await commandService.execute<CommandLiftCallData>('lift.call', {
          location_id: testData.location.id,
          destination_floor_id: testData.floor.id,
        });

        expect(result.status).toEqual('successful');
        expect((result.result as any).lift.name).toEqual('AAA');
      });
    });
  });
});
