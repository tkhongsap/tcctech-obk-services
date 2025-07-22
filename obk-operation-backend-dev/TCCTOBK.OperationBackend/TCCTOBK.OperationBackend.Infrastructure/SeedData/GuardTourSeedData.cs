using Minio.DataModel;
using TCCTOBK.OperationBackend.Domain;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Infrastructure.SeedData;

public static class GuardTourSeedData
{
	public static List<mtActionType> ActionTypes = new List<mtActionType>
    {
        new mtActionType { Id = new Guid("e8eb7171-de01-4a85-a955-711b211eecc2"), Action = "qr", CreatedBy = Guid.Empty, CreatedByName = "system", CreatedDate = DateTime.Now.AddMonths(-1), UpdatedBy = Guid.Empty, UpdatedByName = "system", UpdatedDate = DateTime.Now.AddMonths(-1)},
        new mtActionType{ Id = new Guid("e8eb7171-de01-4a85-a955-711b211eecc3"), Action = "confirm",  CreatedBy = Guid.Empty, CreatedByName = "system", CreatedDate = DateTime.Now.AddMonths(-1), UpdatedBy = Guid.Empty, UpdatedByName = "system", UpdatedDate = DateTime.Now.AddMonths(-1)},
        new mtActionType{ Id = new Guid("e8eb7171-de01-4a85-a955-711b211eecc4"), Action = "photo", CreatedBy = Guid.Empty, CreatedByName = "system", CreatedDate = DateTime.Now.AddMonths(-1), UpdatedBy = Guid.Empty, UpdatedByName = "system", UpdatedDate = DateTime.Now.AddMonths(-1)},
	    new mtActionType{ Id = new Guid("e8eb7171-de01-4a85-a955-711b211eecc5"), Action = "complex", CreatedBy = Guid.Empty, CreatedByName = "system", CreatedDate = DateTime.Now.AddMonths(-1), UpdatedBy = Guid.Empty, UpdatedByName = "system", UpdatedDate = DateTime.Now.AddMonths(-1)}
    };

	public static List<trAction> Actions = new List<trAction>
    {
        new trAction{ Id = new Guid("2aa84ed4-a495-47c8-913f-fa5928c1b4b8"), Name = "Scan QR Code", Description = "L-10, Fire Exit Door 3 (Passenger Elevator)", ActionType = new Guid("e8eb7171-de01-4a85-a955-711b211eecc2"), MetaData = "{\"QrId\":\"Test1\"}", CreatedBy = Guid.Empty, CreatedByName = "system", CreatedDate = DateTime.Now.AddMonths(-1), UpdatedBy = Guid.Empty, UpdatedByName = "system", UpdatedDate = DateTime.Now.AddMonths(-1)},
        new trAction{ Id = new Guid("3ff4f468-53ef-48a3-8781-61a8a053fa99"), Name = "Scan QR Code", Description = "L-10, Fire Exit Door 2 (Passenger Elevator)", ActionType = new Guid("e8eb7171-de01-4a85-a955-711b211eecc2"), MetaData = "{\"QrId\":\"Test2\"}", CreatedBy = Guid.Empty, CreatedByName = "system", CreatedDate = DateTime.Now.AddMonths(-1), UpdatedBy = Guid.Empty, UpdatedByName = "system", UpdatedDate = DateTime.Now.AddMonths(-1)},
        new trAction{ Id = new Guid("564d0272-92c8-4108-82b2-0f98882058d4"), Name = "Inspect Fire doors", Description = "Inspect fire exits and make sure all the doors are closed", ActionType = new Guid("e8eb7171-de01-4a85-a955-711b211eecc3"), MetaData = null, CreatedBy = Guid.Empty, CreatedByName = "system", CreatedDate = DateTime.Now.AddMonths(-1), UpdatedBy = Guid.Empty, UpdatedByName = "system", UpdatedDate = DateTime.Now.AddMonths(-1)},
        new trAction{ Id = new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"), Name = "Inspect Fire doors", Description = "Inspect fire exits and make sure all the doors are closed", ActionType = new Guid("e8eb7171-de01-4a85-a955-711b211eecc3"), MetaData = null, CreatedBy = Guid.Empty, CreatedByName = "system", CreatedDate = DateTime.Now.AddMonths(-1), UpdatedBy = Guid.Empty, UpdatedByName = "system", UpdatedDate = DateTime.Now.AddMonths(-1)},
        new trAction{ Id = new Guid("c1cb273c-570a-42f5-b563-66bac08911cc"), Name = "Distress Alert", Description = "Check Distress Alert", ActionType = new Guid("e8eb7171-de01-4a85-a955-711b211eecc3"), MetaData = null, CreatedBy = Guid.Empty, CreatedByName = "system", CreatedDate = DateTime.Now.AddMonths(-1), UpdatedBy = Guid.Empty, UpdatedByName = "system", UpdatedDate = DateTime.Now.AddMonths(-1)},
        new trAction{ Id = new Guid("e8eb7171-de01-4a85-a955-711b211eecc1"), Name = "Scan QR Code", Description = "L-10, Fire Exit Door 1 (Passenger Elevator)", ActionType = new Guid("e8eb7171-de01-4a85-a955-711b211eecc2"), MetaData = "{\"QrId\":\"Test3\"}", CreatedBy = Guid.Empty, CreatedByName = "system", CreatedDate = DateTime.Now.AddMonths(-1), UpdatedBy = Guid.Empty, UpdatedByName = "system", UpdatedDate = DateTime.Now.AddMonths(-1)},
        new trAction{ Id = new Guid("c1cb273c-570a-42f5-b563-66bac08911cd"), Name = "Distress Alert", Description = "Check Distress Alert", ActionType = new Guid("e8eb7171-de01-4a85-a955-711b211eecc5"), MetaData = null, CreatedBy = Guid.Empty, CreatedByName = "system", CreatedDate = DateTime.Now.AddMonths(-1), UpdatedBy = Guid.Empty, UpdatedByName = "system", UpdatedDate = DateTime.Now.AddMonths(-1)},
	};

	public static List<trAction> GenerateAction() {
		List<trAction> listActions = new List<trAction>();
		var lid = new Dictionary<string, List<string>>() {
				{"e8eb7171-de01-4a85-a955-711b210eecc0", ["L-10, Fire Exit Door 1 (Passenger Elevator)", "{\"QrId\":\"L1002620\"}"]},
				{"e8eb7171-de01-4a85-a955-711b210eecc1", ["L-10, Fire Exit Door 2", "{\"QrId\":\"L1002621\"}"]},
				{"e8eb7171-de01-4a85-a955-711b211eecc0", ["L-10, Front of Service Elevator2", "{\"QrId\":\"L1002659\"}"]},							
				{"e8eb7171-de01-4a85-a955-711b211eecc2", ["L-9, Fire Exit Door 1 (Passenger Elevator)", "{\"QrId\":\"L1002623\"}"]},
				{"e8eb7171-de01-4a85-a955-711b211eecc3", ["L-9, Fire Exit Door 2", "{\"QrId\":\"L1002624\"}"]},
				{"e8eb7171-de01-4a85-a955-711b211eecc4", ["L-9, Front of Service Elevator", "{\"QrId\":\"L1002625\"}"]},
				{"e8eb7171-de01-4a85-a955-711b211eecc5", ["L-8, Fire Exit Door 1 (Passenger Elevator)", "{\"QrId\":\"L1002626\"}"]},
				{"e8eb7171-de01-4a85-a955-711b211eecc6", ["L-8, Fire Exit Door 2", "{\"QrId\":\"L1002627\"}"]},
				{"e8eb7171-de01-4a85-a955-711b211eecc7", ["L-8, Front of Service Elevator", "{\"QrId\":\"L1002628\"}"]},
				{"e8eb7171-de01-4a85-a955-711b211eecc8", ["L-7, Fire Exit Door 1 (Passenger Elevator)", "{\"QrId\":\"L1002629\"}"]},
				{"e8eb7171-de01-4a85-a955-711b211eecc9", ["L-7, Fire Exit Door 2", "{\"QrId\":\"L1002630\"}"]},
				{"e8eb7171-de01-4a85-a955-711b212eecc1", ["L-7, Front of Service Elevator", "{\"QrId\":\"L1002631\"}"]},
				{"e8eb7171-de01-4a85-a955-711b212eecc2", ["L-6, Fire Exit Door 1 (Passenger Elevator)", "{\"QrId\":\"L1002632\"}"]},
				{"e8eb7171-de01-4a85-a955-711b212eecc3", ["L-6, Fire Exit Door 2", "{\"QrId\":\"L1002633\"}"]},
				{"e8eb7171-de01-4a85-a955-711b212eecc4", ["L-6, Front of Service Elevator", "{\"QrId\":\"L1002634\"}"]},
				{"e8eb7171-de01-4a85-a955-711b212eecc5", ["L-5, Fire Exit Door 1 (Passenger Elevator)", "{\"QrId\":\"L1002635\"}"]},
				{"e8eb7171-de01-4a85-a955-711b212eecc6", ["L-5, Machine Room Door 1", "{\"QrId\":\"L1002636\"}"]},
				{"e8eb7171-de01-4a85-a955-711b212eecc7", ["L-5, Fire Exit Door 2", "{\"QrId\":\"L1002637\"}"]},
				{"e8eb7171-de01-4a85-a955-711b212eecc8", ["L-5, Machine Room Door 2", "{\"QrId\":\"L1002638\"}"]},
				{"e8eb7171-de01-4a85-a955-711b212eecc9", ["L-5, Front of Service Elevator", "{\"QrId\":\"L1002639\"}"]},
				{"e8eb7171-de01-4a85-a955-711b213eecc1", ["L-4, Front Door of Passenger Elevator (STT area)", "{\"QrId\":\"L1002640\"}"]},
				{"e8eb7171-de01-4a85-a955-711b213eecc2", ["L-3, Front Door of Passenger Elevator (STT area)", "{\"QrId\":\"L1002641\"}"]},
				{"e8eb7171-de01-4a85-a955-711b213eecc3", ["L-2, Office Entrance", "{\"QrId\":\"L1002642\"}"]},
				{"e8eb7171-de01-4a85-a955-711b213eecc4", ["L-2, Laundry Room", "{\"QrId\":\"L1002643\"}"]},
				{"e8eb7171-de01-4a85-a955-711b213eecc5", ["L-2, Behind the Stock Door", "{\"QrId\":\"L1002644\"}"]},
				{"e8eb7171-de01-4a85-a955-711b213eecc6", ["L-2, Fire Exit Door", "{\"QrId\":\"L1002645\"}"]},
				{"e8eb7171-de01-4a85-a955-711b213eecc7", ["L-1, Laundry Room", "{\"QrId\":\"L1002646\"}"]},
				{"e8eb7171-de01-4a85-a955-711b213eecc8", ["L-1 Fire Exit Door 2 / Hoist Door", "{\"QrId\":\"L1002647\"}"]},
				{"e8eb7171-de01-4a85-a955-711b213eecc9", ["L-1 in Front of Service Elevator", "{\"QrId\":\"L1002648\"}"]},
				{"e8eb7171-de01-4a85-a955-711b214eecc1", ["L-M Air duct (Blind Corner)", "{\"QrId\":\"L1002649\"}"]},
				{"e8eb7171-de01-4a85-a955-711b214eecc2", ["L-M Fire Exit Door 2", "{\"QrId\":\"L1002650\"}"]},
				{"e8eb7171-de01-4a85-a955-711b214eecc3", ["L-G, Unloading Door / Access Door", "{\"QrId\":\"L1002651\"}"]},
				{"e8eb7171-de01-4a85-a955-711b214eecc4", ["L-B1, Fire Hose Next to the Machine Room Door", "{\"QrId\":\"L1002652\"}"]},
				{"e8eb7171-de01-4a85-a955-711b214eecc5", ["L-B1, Fire Exit Door 2 (RMU Room)", "{\"QrId\":\"L1002653\"}"]},
				{"e8eb7171-de01-4a85-a955-711b214eecc6", ["L-B1, Unloading Door (Machine Room)", "{\"QrId\":\"L1002654\"}"]},
				{"e8eb7171-de01-4a85-a955-711b214eecc7", ["B3 Floor, Fire Exit Door 1 (Passenger Elevator) Septic tank", "{\"QrId\":\"L1002655\"}"]},
				{"e8eb7171-de01-4a85-a955-711b214eecc8", ["L-B3, Septic tank", "{\"QrId\":\"L1002656\"}"]},
				{"e8eb7171-de01-4a85-a955-711b214eecc9", ["L-B3, Fire Exit Door 2 (Septic tank)", "{\"QrId\":\"L1002657\"}"]},
				{"e8eb7171-de01-4a85-a955-711b215eecc1", ["L-B4, Fire Exit Door 1 (Passenger Elevator) Machine Room", "{\"QrId\":\"L1002658\"}"]},
				{"e8eb7171-de01-4a85-a955-711b215eecc2", ["L-B4, Fire Exit Door 2 (Machine Room)", "{\"QrId\":\"L1002660\"}"]},
				{"e8eb7171-de01-4a85-a955-711b215eecc3", ["Outdoor, Entry/Exit Side - Fire Escape Door", "{\"QrId\":\"L1002661\"}"]},
				{"e8eb7171-de01-4a85-a955-711b215eecc4", ["Outdoor, Assembly Point / Smoking Are", "{\"QrId\":\"L1002662\"}"]},
				{"e8eb7171-de01-4a85-a955-711b215eecc5", ["Outdoor, Temporary Carpark", "{\"QrId\":\"L1002663\"}"]},
				{"e8eb7171-de01-4a85-a955-711b215eecc6", ["Outdoor, The pathway Between the CUP and the Forum", "{\"QrId\":\"L1002664\"}"]},
				{"e8eb7171-de01-4a85-a955-711b215eecc7", ["L-B1 Pathway to Veolia Room", "{\"QrId\":\"L1002665\"}"]},
				{"e8eb7171-de01-4a85-a955-711b215eecc8", ["Fire Escape Staircase ST01", "{\"QrId\":\"L1001480\"}"]},
				{"e8eb7171-de01-4a85-a955-711b215eecc9", ["Fire Escape Staircase R2", "{\"QrId\":\"L1001484\"}"]},
				{"e8eb7171-de01-4a85-a955-711b216eecc1", ["Escalator F&B Zone", "{\"QrId\":\"L1001487\"}"]},
				{"e8eb7171-de01-4a85-a955-711b216eecc2", ["Shore Pole Plant Room 5 R1", "{\"QrId\":\"L1001488\"}"]},
				{"e8eb7171-de01-4a85-a955-711b216eecc3", ["EXAT WAY", "{\"QrId\":\"L1001490\"}"]},
				{"e8eb7171-de01-4a85-a955-711b216eecc4", ["Drop off (G Floor) 1", "{\"QrId\":\"L1001491\"}"]},
				{"e8eb7171-de01-4a85-a955-711b216eecc5", ["Drop off (G Floor) 2", "{\"QrId\":\"L1001492\"}"]},
				{"e8eb7171-de01-4a85-a955-711b216eecc6", ["Cross Road Civic Plaza", "{\"QrId\":\"L1001494\"}"]},
				{"e8eb7171-de01-4a85-a955-711b216eecc7", ["ONE BANGKOK PARK", "{\"QrId\":\"L1001495\"}"]}
				};
		foreach (var item in lid) {
            listActions.Add(new trAction
            {
                Id = new Guid(item.Key),
                Name = "Scan QR Code",
                Description = item.Value.First(),
                ActionType = new Guid("e8eb7171-de01-4a85-a955-711b211eecc2"),
                MetaData = item.Value.Last(),
				IsRequired = 1,
                CreatedBy = new Guid("00000000-0000-0000-0000-000000000000"),
                CreatedByName = "System",
                CreatedDate = DateTime.Now,
                UpdatedBy = new Guid("00000000-0000-0000-0000-000000000000"),
                UpdatedByName = "System",
                UpdatedDate = DateTime.Now,
            });
        }
        return listActions;
    }

	public static List<trSubtask> Subtasks = new List<trSubtask>
    {
		new trSubtask { Id = new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496"), Name = "Distress Alert", StatusId = 0, CreatedBy = Guid.Empty, CreatedByName = "system", CreatedDate = DateTime.Now.AddMonths(-1), UpdatedBy = Guid.Empty, UpdatedByName = "system", UpdatedDate = DateTime.Now.AddMonths(-1)},
		new trSubtask { Id = new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911"), Name = "L-10, Fire Exit Door 3 (Passenger Elevator)", StatusId = 0, CreatedBy = Guid.Empty, CreatedByName = "system", CreatedDate = DateTime.Now.AddMonths(-1), UpdatedBy = Guid.Empty, UpdatedByName = "system", UpdatedDate = DateTime.Now.AddMonths(-1)},
		new trSubtask { Id = new Guid("1a157bf0-4748-4589-91cc-1450e0c06596"), Name = "L-10, Fire Exit Door 2 (Passenger Elevator)", StatusId = 0, CreatedBy = Guid.Empty, CreatedByName = "system", CreatedDate = DateTime.Now.AddMonths(-1), UpdatedBy = Guid.Empty, UpdatedByName = "system", UpdatedDate = DateTime.Now.AddMonths(-1)},
		new trSubtask { Id = new Guid("3fa85f64-5717-4562-b3fc-2c963f66afa6"), Name = "L-10, Fire Exit Door 4 (Passenger Elevator)", StatusId = 0, CreatedBy = Guid.Empty, CreatedByName = "system", CreatedDate = DateTime.Now.AddMonths(-1), UpdatedBy = Guid.Empty, UpdatedByName = "system", UpdatedDate = DateTime.Now.AddMonths(-1)},
		new trSubtask { Id = new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5"), Name = "L-10, Fire Exit Door 1 (Passenger Elevator)", StatusId = 0, CreatedBy = Guid.Empty, CreatedByName = "system", CreatedDate = DateTime.Now.AddMonths(-1), UpdatedBy = Guid.Empty, UpdatedByName = "system", UpdatedDate = DateTime.Now.AddMonths(-1)},
	};

	public static List<trTask> Tasks = new List<trTask>
    {
		new trTask { Id = new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b"), LocationId = new Guid("2c055101-2271-44e0-95fe-bcf2c59a459a"), Name = "Illegal Parking", StatusId = 0, CreatedBy = Guid.Empty, CreatedByName = "system", CreatedDate = DateTime.Now.AddMonths(-1), UpdatedBy = Guid.Empty, UpdatedByName = "system", UpdatedDate = DateTime.Now.AddMonths(-1)},
		new trTask { Id = new Guid("4422cc3c-0ea5-4d73-a31e-a42485a81003"), LocationId = new Guid("2c055101-2271-44e0-95fe-bcf2c59a459a"), Name = "Distress Alert", StatusId = 0, CreatedBy = Guid.Empty, CreatedByName = "system", CreatedDate = DateTime.Now.AddMonths(-1), UpdatedBy = Guid.Empty, UpdatedByName = "system", UpdatedDate = DateTime.Now.AddMonths(-1)},
	};

	public static List<trTaskSubtask> TaskSubtasks = new List<trTaskSubtask>
    {
		new trTaskSubtask { Task = new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b"), Subtask = new Guid("1a157bf0-4748-4589-91cc-1450e0c06596"), CreatedBy = Guid.Empty, CreatedByName = "system", CreatedDate = DateTime.Now.AddMonths(-1), UpdatedBy = Guid.Empty, UpdatedByName = "system", UpdatedDate = DateTime.Now.AddMonths(-1)},
		new trTaskSubtask { Task = new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b"), Subtask = new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5"), CreatedBy = Guid.Empty, CreatedByName = "system", CreatedDate = DateTime.Now.AddMonths(-1), UpdatedBy = Guid.Empty, UpdatedByName = "system", UpdatedDate = DateTime.Now.AddMonths(-1)},
		new trTaskSubtask { Task = new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b"), Subtask = new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911"), CreatedBy = Guid.Empty, CreatedByName = "system", CreatedDate = DateTime.Now.AddMonths(-1), UpdatedBy = Guid.Empty, UpdatedByName = "system", UpdatedDate = DateTime.Now.AddMonths(-1)},
		new trTaskSubtask { Task = new Guid("4422cc3c-0ea5-4d73-a31e-a42485a81003"), Subtask = new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496"), CreatedBy = Guid.Empty, CreatedByName = "system", CreatedDate = DateTime.Now.AddMonths(-1), UpdatedBy = Guid.Empty, UpdatedByName = "system", UpdatedDate = DateTime.Now.AddMonths(-1)},
	};

	public static List<trSubtaskAction> SubtaskActions = new List<trSubtaskAction>
    {
		new trSubtaskAction { Subtask = new Guid("1a157bf0-4748-4589-91cc-1450e0c06596"), Action = new Guid("3ff4f468-53ef-48a3-8781-61a8a053fa99"), StatusId = 0, CreatedBy = Guid.Empty, CreatedByName = "system", CreatedDate = DateTime.Now.AddMonths(-1), UpdatedBy = Guid.Empty, UpdatedByName = "system", UpdatedDate = DateTime.Now.AddMonths(-1)},
		new trSubtaskAction { Subtask = new Guid("1a157bf0-4748-4589-91cc-1450e0c06596"), Action = new Guid("564d0272-92c8-4108-82b2-0f98882058d4"), StatusId = 0, CreatedBy = Guid.Empty, CreatedByName = "system", CreatedDate = DateTime.Now.AddMonths(-1), UpdatedBy = Guid.Empty, UpdatedByName = "system", UpdatedDate = DateTime.Now.AddMonths(-1)},
		new trSubtaskAction { Subtask = new Guid("1a157bf0-4748-4589-91cc-1450e0c06596"), Action = new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"), StatusId = 0, CreatedBy = Guid.Empty, CreatedByName = "system", CreatedDate = DateTime.Now.AddMonths(-1), UpdatedBy = Guid.Empty, UpdatedByName = "system", UpdatedDate = DateTime.Now.AddMonths(-1)},
    	new trSubtaskAction { Subtask = new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5"), Action = new Guid("564d0272-92c8-4108-82b2-0f98882058d4"), StatusId = 0, CreatedBy = Guid.Empty, CreatedByName = "system", CreatedDate = DateTime.Now.AddMonths(-1), UpdatedBy = Guid.Empty, UpdatedByName = "system", UpdatedDate = DateTime.Now.AddMonths(-1)},
    	new trSubtaskAction { Subtask = new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5"), Action = new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"), StatusId = 0, CreatedBy = Guid.Empty, CreatedByName = "system", CreatedDate = DateTime.Now.AddMonths(-1), UpdatedBy = Guid.Empty, UpdatedByName = "system", UpdatedDate = DateTime.Now.AddMonths(-1)},
    	new trSubtaskAction { Subtask = new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5"), Action = new Guid("e8eb7171-de01-4a85-a955-711b211eecc1"), StatusId = 0, CreatedBy = Guid.Empty, CreatedByName = "system", CreatedDate = DateTime.Now.AddMonths(-1), UpdatedBy = Guid.Empty, UpdatedByName = "system", UpdatedDate = DateTime.Now.AddMonths(-1)},
    	new trSubtaskAction { Subtask = new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911"), Action = new Guid("2aa84ed4-a495-47c8-913f-fa5928c1b4b8"), StatusId = 0, CreatedBy = Guid.Empty, CreatedByName = "system", CreatedDate = DateTime.Now.AddMonths(-1), UpdatedBy = Guid.Empty, UpdatedByName = "system", UpdatedDate = DateTime.Now.AddMonths(-1)},
    	new trSubtaskAction { Subtask = new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911"), Action = new Guid("564d0272-92c8-4108-82b2-0f98882058d4"), StatusId = 0, CreatedBy = Guid.Empty, CreatedByName = "system", CreatedDate = DateTime.Now.AddMonths(-1), UpdatedBy = Guid.Empty, UpdatedByName = "system", UpdatedDate = DateTime.Now.AddMonths(-1)},
    	new trSubtaskAction { Subtask = new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911"), Action = new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"), StatusId = 0, CreatedBy = Guid.Empty, CreatedByName = "system", CreatedDate = DateTime.Now.AddMonths(-1), UpdatedBy = Guid.Empty, UpdatedByName = "system", UpdatedDate = DateTime.Now.AddMonths(-1)},
		new trSubtaskAction { Subtask = new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496"), Action = new Guid("c1cb273c-570a-42f5-b563-66bac08911cc"), StatusId = 0, CreatedBy = Guid.Empty, CreatedByName = "system", CreatedDate = DateTime.Now.AddMonths(-1), UpdatedBy = Guid.Empty, UpdatedByName = "system", UpdatedDate = DateTime.Now.AddMonths(-1)},
		new trSubtaskAction { Subtask = new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496"), Action = new Guid("c1cb273c-570a-42f5-b563-66bac08911cd"), StatusId = 0, CreatedBy = Guid.Empty, CreatedByName = "system", CreatedDate = DateTime.Now.AddMonths(-1), UpdatedBy = Guid.Empty, UpdatedByName = "system", UpdatedDate = DateTime.Now.AddMonths(-1)},
	};

	public static List<Location> Locations = new List<Location>
  {
		new Location
		{
					LID = new Guid("2c055101-2271-44e0-95fe-bcf2c59a459a"),
					FloorName = "1B",
					SiteName = "OBK",
					ZoneName = "R1",
					BuildingName = "O2",
					BuildingZoneName = "O2T1",
					CreatedBy = new Guid("00000000-0000-0000-0000-000000000000"),
					CreatedByName = "System",
					CreatedDate = DateTime.Now,
					UpdatedBy = new Guid("00000000-0000-0000-0000-000000000000"),
					UpdatedByName = "System",
					UpdatedDate = DateTime.Now,
					Type = "floor"
			}
	};

	public static List<mtShift> Shifts = new List<mtShift>
    {
		new mtShift { Id = 1, Name = "socDay", StartTime = TimeSpan.Parse("07:00:00"), EndTime = TimeSpan.Parse("19:00:00"), AllowCheckInStart = TimeSpan.Parse("06:00:00"), AllowCheckInEnd = TimeSpan.Parse("07:15:00"), CheckoutTimeEnd = TimeSpan.Parse("21:00:00"), isOverNight = 0 },
		new mtShift { Id = 2, Name = "socNight", StartTime = TimeSpan.Parse("19:00:00"), EndTime = TimeSpan.Parse("07:00:00"), AllowCheckInStart = TimeSpan.Parse("18:00:00"), AllowCheckInEnd = TimeSpan.Parse("19:15:00"), CheckoutTimeEnd = TimeSpan.Parse("09:00:00"), isOverNight = 1 }
	};
	public static List<mtShiftManPowerRequest> ShiftManPowerRequest = new List<mtShiftManPowerRequest>
    {
		new mtShiftManPowerRequest { Id = 1, Shift = "socNight", BaseLocation = "ONE Power", Company = "G4S", Role = "Security Supervisor", Demand = 1, StartDateTime = DateTime.Now.AddMonths(-1), CreatedBy = Guid.Empty, CreatedByName = "system", CreatedDate = DateTime.Now.AddMonths(-1), UpdatedBy = Guid.Empty, UpdatedByName = "system", UpdatedDate = DateTime.Now.AddMonths(-1)},
		new mtShiftManPowerRequest { Id = 2, Shift = "socDay", BaseLocation = "ONE Power", Company = "G4S", Role = "Security Supervisor", Demand = 1, StartDateTime = DateTime.Now.AddMonths(-1), CreatedBy = Guid.Empty, CreatedByName = "system", CreatedDate = DateTime.Now.AddMonths(-1), UpdatedBy = Guid.Empty, UpdatedByName = "system", UpdatedDate = DateTime.Now.AddMonths(-1)},
		new mtShiftManPowerRequest { Id = 3, Shift = "socNight", BaseLocation = "ONE Power", Company = "G4S", Role = "Security Officer", Demand = 3, StartDateTime = DateTime.Now.AddMonths(-1), CreatedBy = Guid.Empty, CreatedByName = "system", CreatedDate = DateTime.Now.AddMonths(-1), UpdatedBy = Guid.Empty, UpdatedByName = "system", UpdatedDate = DateTime.Now.AddMonths(-1)},
		new mtShiftManPowerRequest { Id = 4, Shift = "socDay", BaseLocation = "ONE Power", Company = "G4S", Role = "Security Officer", Demand = 5, StartDateTime = DateTime.Now.AddMonths(-1), CreatedBy = Guid.Empty, CreatedByName = "system", CreatedDate = DateTime.Now.AddMonths(-1), UpdatedBy = Guid.Empty, UpdatedByName = "system", UpdatedDate = DateTime.Now.AddMonths(-1)},
	};
}
