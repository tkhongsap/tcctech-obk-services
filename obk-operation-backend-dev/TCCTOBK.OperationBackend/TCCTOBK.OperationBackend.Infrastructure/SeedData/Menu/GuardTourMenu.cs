using System;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Infrastructure.SeedData.Menu;

public static class GuardTourMenu
{
	public static mtMenu Group = new()
	{
		Id = new Guid("55a37615-fab7-49d9-a191-40eaf5f308a2"),
		Label = "",
		Type = MenuType.GROUP,
		DisplayOrder = 1100
	};

	public static mtMenu GuardTourGroup = new()
	{
		Id = new Guid("9674aef9-f1af-46f5-8457-f920cfdb1600"),
		IconName = "SvgContent",
		ParentId = Group.Id,
		Label = "Guard Tour Config",
		DisplayOrder = 1101,
		Visible = true,
		PTID = PrivilegeSeedData.GT000.PTID
	};

	public static mtMenu ActionManagement = new()
	{
		Id = new Guid("29eb488e-e405-416a-a492-b2b433cc2778"),
		Label = "Action Management",
		To = "/guardtour/action-management",
		ParentId = GuardTourGroup.Id,
		Visible = true,
		Type = MenuType.LIST,
		DisplayOrder = 1102,
		PTID = PrivilegeSeedData.GT001.PTID
	};

	public static mtMenu ActionManagementCreate = new()
	{
		Id = new Guid("67221236-b4fb-407d-9fa5-79609e835858"),
		Label = "Action Management",
		To = "/guardtour/action-management/create",
		ParentId = ActionManagement.Id,
		Visible = false,
		Type = MenuType.CREATE,
		DisplayOrder = 1103,
		PTID = PrivilegeSeedData.GT001.PTID
	};

	public static mtMenu ActionManagementEdit = new()
	{
		Id = new Guid("77bb48c9-5609-436b-a574-cb71ba288e2a"),
		Label = "Action Management",
		To = "/guardtour/action-management/edit/:id",
		ParentId = ActionManagement.Id,
		Visible = false,
		Type = MenuType.EDIT,
		DisplayOrder = 1104,
		PTID = PrivilegeSeedData.GT001.PTID
	};

	public static mtMenu TaskManagement = new()
	{
		Id = new Guid("0b033360-e296-41e9-a572-b57abd9fa98b"),
		Label = "Task Management",
		To = "/guardtour/task-management",
		ParentId = GuardTourGroup.Id,
		Visible = true,
		Type = MenuType.LIST,
		DisplayOrder = 1105,
		PTID = PrivilegeSeedData.GT002.PTID
	};

	public static mtMenu TaskManagementCreate = new()
	{
		Id = new Guid("6089cedc-519e-40c8-a5d0-cf868307e0e7"),
		Label = "Task Management",
		To = "/guardtour/task-management/create",
		ParentId = TaskManagement.Id,
		Visible = false,
		Type = MenuType.CREATE,
		DisplayOrder = 1106,
		PTID = PrivilegeSeedData.GT002.PTID
	};

	public static mtMenu TaskManagementEdit = new()
	{
		Id = new Guid("c70c8ed6-9ba2-4fca-a1dc-88dea997f280"),
		Label = "Task Management",
		To = "/guardtour/task-management/edit/:id",
		ParentId = TaskManagement.Id,
		Visible = false,
		Type = MenuType.EDIT,
		DisplayOrder = 1107,
		PTID = PrivilegeSeedData.GT002.PTID
	};

	public static mtMenu SchedulePlan = new()
	{
		Id = new Guid("92fc160b-46ce-4c83-82c0-e047cd886eda"),
		Label = "Schedule Plan",
		To = "/guardtour/scheduleplan",
		ParentId = GuardTourGroup.Id,
		Visible = true,
		Type = MenuType.LIST,
		DisplayOrder = 1108,
		PTID = PrivilegeSeedData.GT003.PTID
	};

	public static mtMenu SchedulePlanCreate = new()
	{
		Id = new Guid("f0b65d94-67f7-4429-89dd-def0afa20e5e"),
		Label = "Schedule Plan",
		To = "/guardtour/scheduleplan/create",
		ParentId = SchedulePlan.Id,
		Visible = false,
		Type = MenuType.CREATE,
		DisplayOrder = 1109,
		PTID = PrivilegeSeedData.GT003.PTID
	};

	public static mtMenu SchedulePlanEdit = new()
	{
		Id = new Guid("115a8009-9e01-411e-8894-0f8e511924a0"),
		Label = "Schedule Plan",
		To = "/guardtour/scheduleplan/edit/:id",
		ParentId = SchedulePlan.Id,
		Visible = false,
		Type = MenuType.EDIT,
		DisplayOrder = 1110,
		PTID = PrivilegeSeedData.GT003.PTID
	};

	public static mtMenu ActivityProcedures = new()
	{
		Id = new Guid("1881843c-404b-4fc6-a55b-8923fa409a02"),
		Label = "Activity Procedures",
		To = "/guardtour/activityprocedures",
		ParentId = GuardTourGroup.Id,
		Visible = true,
		Type = MenuType.LIST,
		DisplayOrder = 1111,
		PTID = PrivilegeSeedData.GT004.PTID
	};

	public static mtMenu ActivityProceduresCreate = new()
	{
		Id = new Guid("8dac7d2f-4761-4e57-8b13-5d9b6cab52ec"),
		Label = "Activity Procedures",
		To = "/guardtour/activityprocedures/create",
		ParentId = ActivityProcedures.Id,
		Visible = false,
		Type = MenuType.CREATE,
		DisplayOrder = 1112,
		PTID = PrivilegeSeedData.GT004.PTID
	};

	public static mtMenu ActivityProceduresEdit = new()
	{
		Id = new Guid("2e48799b-9b5c-482e-8edb-37d419f16793"),
		Label = "Activity Procedures",
		To = "/guardtour/activityprocedures/edit/:id",
		ParentId = ActivityProcedures.Id,
		Visible = false,
		Type = MenuType.EDIT,
		DisplayOrder = 1113,
		PTID = PrivilegeSeedData.GT004.PTID
	};


}
