using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Infrastructure;

public static class MemberRoleSeedData
{
	public static taMember Member = new taMember
	{
		MID = new Guid("ead5f4c3-cc7b-4c5f-b7dd-a552b917b6d4"),
		Email = "test1@test.com",
		//KeyCloakUserId = "80fa2533-dab0-4bba-937f-36d4881b084c",
		KeyCloakUserId = "cf352682-423a-4a30-aab7-e9f5559f3f1b",
		IsActive = true,
		Name = "test1",
		Status = 2,
		CreatedBy = Guid.Empty,
		CreatedByName = "system",
		CreatedDate = DateTime.Now.AddMonths(-1),
		UpdatedBy = Guid.Empty,
		UpdatedByName = "system",
		UpdatedDate = DateTime.Now.AddMonths(-1),
	};

	public static trRole Role = new trRole
	{
		RID = new Guid("ac6a0fde-095e-4536-b5b9-70f1cfa9e886"),
		Name = "Super Admin",
		IsActive = true,
		Description = "Super Admin",
		TID = new Guid("4199e4de-bdf8-48f8-a8a8-a5b31756a748"),
		CreatedBy = Guid.Empty,
		CreatedByName = "system",
		CreatedDate = DateTime.Now.AddMonths(-1),
		UpdatedBy = Guid.Empty,
		UpdatedByName = "system",
		UpdatedDate = DateTime.Now.AddMonths(-1),
	};

	public static trRoleMember RoleMember = new trRoleMember
	{
		MID = Member.MID,
		RID = Role.RID,
		IsActive = true,
	};

	public static List<trRolePrivilegeItem> RolePrivilegeItemData = new List<trRolePrivilegeItem>
	{
		new(){ RID = new Guid("ac6a0fde-095e-4536-b5b9-70f1cfa9e886"),PTID = new Guid("0768692f-a586-42b2-8fea-ce0706387ed4"),IsActive = false },
		new(){ RID = new Guid("ac6a0fde-095e-4536-b5b9-70f1cfa9e886"),PTID = new Guid("108e481f-c36f-43ef-af5d-eae802d4499b"),IsActive = false },
		new(){ RID = new Guid("ac6a0fde-095e-4536-b5b9-70f1cfa9e886"),PTID = new Guid("14cbaf23-dd5d-4819-984e-539f193a0c30"),IsActive = false },
		new(){ RID = new Guid("ac6a0fde-095e-4536-b5b9-70f1cfa9e886"),PTID = new Guid("18611757-7383-45ff-8fa6-b2223018d1c6"),IsActive = false },
		new(){ RID = new Guid("ac6a0fde-095e-4536-b5b9-70f1cfa9e886"),PTID = new Guid("187050f0-ff0e-4767-b37e-2755f0de169a"),IsActive = false },
		new(){ RID = new Guid("ac6a0fde-095e-4536-b5b9-70f1cfa9e886"),PTID = new Guid("18f96e4a-d5ed-41c3-b733-ca8f08fca318"),IsActive = false },
		new(){ RID = new Guid("ac6a0fde-095e-4536-b5b9-70f1cfa9e886"),PTID = new Guid("1d690399-1844-4295-bf90-42d135e80a0c"),IsActive = false },
		new(){ RID = new Guid("ac6a0fde-095e-4536-b5b9-70f1cfa9e886"),PTID = new Guid("25461bf1-ac46-4ed5-b6f4-170b7ee70bb5"),IsActive = false },
		new(){ RID = new Guid("ac6a0fde-095e-4536-b5b9-70f1cfa9e886"),PTID = new Guid("26c3f61a-f9a5-4348-a2b6-aa0924368f84"),IsActive = false },
		new(){ RID = new Guid("ac6a0fde-095e-4536-b5b9-70f1cfa9e886"),PTID = new Guid("2d1911ae-04c8-4f17-bdeb-4c6e077cb1ae"),IsActive = false },
		new(){ RID = new Guid("ac6a0fde-095e-4536-b5b9-70f1cfa9e886"),PTID = new Guid("3c19577e-4bbe-4545-a1cd-977684059382"),IsActive = false },
		new(){ RID = new Guid("ac6a0fde-095e-4536-b5b9-70f1cfa9e886"),PTID = new Guid("499b184b-a44b-4d0c-953a-9204c4c07ddd"),IsActive = false },
		new(){ RID = new Guid("ac6a0fde-095e-4536-b5b9-70f1cfa9e886"),PTID = new Guid("4d7b12d5-0a19-48d2-b524-669ca35acedc"),IsActive = false },
		new(){ RID = new Guid("ac6a0fde-095e-4536-b5b9-70f1cfa9e886"),PTID = new Guid("4e359a86-af2e-4b46-806c-e667aa95bd02"),IsActive = false },
		new(){ RID = new Guid("ac6a0fde-095e-4536-b5b9-70f1cfa9e886"),PTID = new Guid("55c4ada7-e1cf-43e2-8770-5102c03f8a8e"),IsActive = false },
		new(){ RID = new Guid("ac6a0fde-095e-4536-b5b9-70f1cfa9e886"),PTID = new Guid("560af02b-45da-428c-8aa8-aaf4b6201048"),IsActive = false },
		new(){ RID = new Guid("ac6a0fde-095e-4536-b5b9-70f1cfa9e886"),PTID = new Guid("5647c352-0c08-4982-806e-b764ff061ba4"),IsActive = false },
		new(){ RID = new Guid("ac6a0fde-095e-4536-b5b9-70f1cfa9e886"),PTID = new Guid("575e3781-e3e9-4b98-b1cf-8f347b2cf065"),IsActive = false },
		new(){ RID = new Guid("ac6a0fde-095e-4536-b5b9-70f1cfa9e886"),PTID = new Guid("59298d4c-1a15-4f5f-bfcd-4f76287c7fdc"),IsActive = false },
		new(){ RID = new Guid("ac6a0fde-095e-4536-b5b9-70f1cfa9e886"),PTID = new Guid("5c371466-64b6-4608-a66b-9ddcaddec183"),IsActive = false },
		new(){ RID = new Guid("ac6a0fde-095e-4536-b5b9-70f1cfa9e886"),PTID = new Guid("65d83597-f3db-4037-acbe-24bf8e01672b"),IsActive = false },
		new(){ RID = new Guid("ac6a0fde-095e-4536-b5b9-70f1cfa9e886"),PTID = new Guid("6b87dcbe-ed47-421c-bd0c-f1007f430a5a"),IsActive = false },
		new(){ RID = new Guid("ac6a0fde-095e-4536-b5b9-70f1cfa9e886"),PTID = new Guid("86f4b1ab-c705-4893-a6e7-0c86e287c89b"),IsActive = false },
		new(){ RID = new Guid("ac6a0fde-095e-4536-b5b9-70f1cfa9e886"),PTID = new Guid("9bfe9f97-205d-4a4d-8b7b-c0a75e3485dd"),IsActive = false },
		new(){ RID = new Guid("ac6a0fde-095e-4536-b5b9-70f1cfa9e886"),PTID = new Guid("9f9f751f-3144-49a0-9d7b-c32d742dcd72"),IsActive = false },
		new(){ RID = new Guid("ac6a0fde-095e-4536-b5b9-70f1cfa9e886"),PTID = new Guid("9ff4e790-dfdb-401c-b450-0e3cc6fa008f"),IsActive = false },
		new(){ RID = new Guid("ac6a0fde-095e-4536-b5b9-70f1cfa9e886"),PTID = new Guid("a04722d6-0fc2-4144-b77a-2a67e838f2f1"),IsActive = false },
		new(){ RID = new Guid("ac6a0fde-095e-4536-b5b9-70f1cfa9e886"),PTID = new Guid("a3958d8c-f1f7-4865-872b-f91fc439bec6"),IsActive = false },
		new(){ RID = new Guid("ac6a0fde-095e-4536-b5b9-70f1cfa9e886"),PTID = new Guid("ae4f3bcc-ed43-4abb-a082-a1b2cba6bea3"),IsActive = false },
		new(){ RID = new Guid("ac6a0fde-095e-4536-b5b9-70f1cfa9e886"),PTID = new Guid("c545119b-7587-4a16-a71d-ad6c189a9106"),IsActive = false },
		new(){ RID = new Guid("ac6a0fde-095e-4536-b5b9-70f1cfa9e886"),PTID = new Guid("c7caf3cc-9130-4035-ba54-bb7dd418f1ae"),IsActive = false },
		new(){ RID = new Guid("ac6a0fde-095e-4536-b5b9-70f1cfa9e886"),PTID = new Guid("cf3a9564-b228-4ca2-858c-66d5c2b35185"),IsActive = false },
		new(){ RID = new Guid("ac6a0fde-095e-4536-b5b9-70f1cfa9e886"),PTID = new Guid("d34c2f62-b729-47fa-a1a9-19a6acbb52cb"),IsActive = false },
		new(){ RID = new Guid("ac6a0fde-095e-4536-b5b9-70f1cfa9e886"),PTID = new Guid("e3776352-3511-4b75-b1f3-1b46c9fb1d57"),IsActive = false },
		new(){ RID = new Guid("ac6a0fde-095e-4536-b5b9-70f1cfa9e886"),PTID = new Guid("e70e6e8f-3267-4e53-a5af-797e9d96ccce"),IsActive = false },
		new(){ RID = new Guid("ac6a0fde-095e-4536-b5b9-70f1cfa9e886"),PTID = new Guid("e73f190f-6ac7-42a6-b1de-3288c4eea2b5"),IsActive = false },
		new(){ RID = new Guid("ac6a0fde-095e-4536-b5b9-70f1cfa9e886"),PTID = new Guid("ecc622f9-b411-4286-8a50-df2100277210"),IsActive = false },
		new(){ RID = new Guid("ac6a0fde-095e-4536-b5b9-70f1cfa9e886"),PTID = new Guid("f92a3d95-a360-455f-a5df-1534e6fec172"),IsActive = false },
		new(){ RID = new Guid("ac6a0fde-095e-4536-b5b9-70f1cfa9e886"),PTID = new Guid("fa1ad67a-00bc-4397-b63a-bab78532c28f"),IsActive = false },
		new(){ RID = new Guid("ac6a0fde-095e-4536-b5b9-70f1cfa9e886"),PTID = new Guid("8a2c6484-2f5a-4b84-926a-3b8a5f1a3d12"),IsActive = false },
		new(){ RID = new Guid("ac6a0fde-095e-4536-b5b9-70f1cfa9e886"),PTID = new Guid("92b60d21-5b8f-43a8-9827-6e92c5c3123a"),IsActive = false },
		new(){ RID = new Guid("ac6a0fde-095e-4536-b5b9-70f1cfa9e886"),PTID = new Guid("c7b85f14-e7a3-4d8b-9441-77b8d63f4a29"),IsActive = false },
		new(){ RID = new Guid("ac6a0fde-095e-4536-b5b9-70f1cfa9e886"),PTID = new Guid("efa8cbe7-4d54-4bfb-986f-4b7c3c6e7d29"),IsActive = false },
		new(){ RID = new Guid("ac6a0fde-095e-4536-b5b9-70f1cfa9e886"),PTID = new Guid("f2b67e7c-59f2-4426-812a-678c6d1e3e93"),IsActive = false },
		new(){ RID = new Guid("ac6a0fde-095e-4536-b5b9-70f1cfa9e886"),PTID = new Guid("0e9a80f5-2394-49c3-bf0c-7a8e27b2c4e2"),IsActive = false },
		new(){ RID = new Guid("ac6a0fde-095e-4536-b5b9-70f1cfa9e886"),PTID = new Guid("a4b2394f-2c7a-4b34-b80e-2d1b6a9f1a3c"),IsActive = false },
		new(){ RID = new Guid("ac6a0fde-095e-4536-b5b9-70f1cfa9e886"),PTID = new Guid("b7d25f46-5e8a-4db6-ae8c-7f9b5c7d4e1e"),IsActive = false },
		new(){ RID = new Guid("ac6a0fde-095e-4536-b5b9-70f1cfa9e886"),PTID = new Guid("2d1a20dd-df64-4e57-a3ba-5e731534d461"),IsActive = false },
		new(){ RID = new Guid("ac6a0fde-095e-4536-b5b9-70f1cfa9e886"),PTID = new Guid("b5a7a499-1c12-4c99-9b4a-d5bc882d4bda"),IsActive = false },
		new(){ RID = new Guid("ac6a0fde-095e-4536-b5b9-70f1cfa9e886"),PTID = new Guid("21454bdb-2a44-4b39-8df5-cdb703d33180"),IsActive = false },
		new(){ RID = new Guid("ac6a0fde-095e-4536-b5b9-70f1cfa9e886"),PTID = new Guid("e4972901-3f9c-4b38-aafb-234d43c9d6fc"),IsActive = false },
		new(){ RID = new Guid("ac6a0fde-095e-4536-b5b9-70f1cfa9e886"),PTID = new Guid("fad4a7fc-8076-40c0-93bb-1404558549e0"),IsActive = false },
		new(){ RID = new Guid("ac6a0fde-095e-4536-b5b9-70f1cfa9e886"),PTID = new Guid("a6f07bc9-51d4-4fdd-8215-2aa68383dbfc"),IsActive = false },
		new(){ RID = new Guid("ac6a0fde-095e-4536-b5b9-70f1cfa9e886"),PTID = new Guid("c9453aea-fbc3-4559-84a9-103a532c998a"),IsActive = false },
		new(){ RID = new Guid("ac6a0fde-095e-4536-b5b9-70f1cfa9e886"),PTID = new Guid("cf3d1993-73fe-42b5-b345-d9cc9e7ce331"),IsActive = false },
		new(){ RID = new Guid("ac6a0fde-095e-4536-b5b9-70f1cfa9e886"),PTID = new Guid("b8b117ba-18da-4f73-b67f-7db1581a1b30"),IsActive = false },
		new(){ RID = new Guid("ac6a0fde-095e-4536-b5b9-70f1cfa9e886"),PTID = new Guid("ddfd5827-7610-401f-891f-0fee217f811d"),IsActive = false },
		new(){ RID = new Guid("ac6a0fde-095e-4536-b5b9-70f1cfa9e886"),PTID = new Guid("4ed288f3-11d9-4181-86ae-5684d4c9ebbd"),IsActive = false },
		new(){ RID = new Guid("ac6a0fde-095e-4536-b5b9-70f1cfa9e886"),PTID = new Guid("456dcf29-047e-4482-9f91-74ddf7b10594"),IsActive = false },
		new(){ RID = new Guid("ac6a0fde-095e-4536-b5b9-70f1cfa9e886"),PTID = new Guid("a02b32ea-8db3-4e71-9b97-6dd1fb8828b8"),IsActive = false },
		new(){ RID = new Guid("ac6a0fde-095e-4536-b5b9-70f1cfa9e886"),PTID = new Guid("9a4eeb91-3a8e-4a8a-80e7-bdc9ac36a88a"),IsActive = false },
		new(){ RID = new Guid("ac6a0fde-095e-4536-b5b9-70f1cfa9e886"),PTID = new Guid("05a8f11e-d1ed-4eb5-8430-4907967eb301"),IsActive = false },
		new(){ RID = new Guid("ac6a0fde-095e-4536-b5b9-70f1cfa9e886"),PTID = new Guid("3a11067d-c22f-40d6-b2c9-8ba1e00e0cce"),IsActive = false },
		new(){ RID = new Guid("ac6a0fde-095e-4536-b5b9-70f1cfa9e886"),PTID = new Guid("a037a451-0db5-4832-9fae-9111c89d1cfc"),IsActive = false },
		new(){ RID = new Guid("ac6a0fde-095e-4536-b5b9-70f1cfa9e886"),PTID = new Guid("0e82ceb7-6c37-44a3-83a7-ba700be6e5d9"),IsActive = false },
	};
}
