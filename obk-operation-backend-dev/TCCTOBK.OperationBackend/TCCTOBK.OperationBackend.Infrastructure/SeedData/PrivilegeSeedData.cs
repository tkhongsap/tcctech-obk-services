using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Infrastructure.SeedData;

public static class PrivilegeSeedData
{

	public static List<mtPrivilege> PrivilegesData = new List<mtPrivilege> {
		new() { PID = new Guid("bbc5d8ed-0a6b-4d98-b5c6-5c908d723897"), Name = "HomeContent", Description = "HomeContent Privilege", IsActive = true },
		new() { PID = new Guid("b6cf116b-0cb9-4f99-a8ab-8379b9cb56a5"), Name = "Notifications", Description = "Notifications Privilege", IsActive = true },
		new() { PID = new Guid("39a48451-b23a-43a8-89aa-65ed88403027"), Name = "Building service", Description = "Building Privilege", IsActive = true },
		new() { PID = new Guid("05eb29b8-e23d-4457-b9b5-7440e24903c8"), Name = "App setting", Description = "App setting Privilege", IsActive = true },
		new() { PID = new Guid("d7c9f435-92ab-4177-b888-68f46152f604"), Name = "Member and Roles", Description = "Member and Roles Privilege", IsActive = true },
		new() { PID = new Guid("ee2312ca-2114-4595-9c6b-93dd548a5d88"), Name = "Users", Description = "Users Privilege", IsActive = true },
		new() { PID = new Guid("307c778e-3eed-424e-9ab5-b97cf451ff30"), Name = "Car Park", Description = "Car Park", IsActive = true },
		new() { PID = new Guid("88915772-0e5b-4fb3-9003-4a8b775af55c"), Name = "Art & Culture", Description = "Art & Culture", IsActive = true },
		new() { PID = new Guid("d9a457c9-bf09-4e2d-89ab-123456789abc"), Name = "Sustainability", Description = "Sustainability Privilege", IsActive = true },
		new() { PID = new Guid("f994b3b2-2b16-4619-b71e-7f918315d936"), Name = "Marcom", Description = "Marcom Privilege", IsActive = true },
		new() { PID = new Guid("d53031b0-4112-4039-9360-4373dcfb881e"), Name = "Guard Tour" ,Description = "Guard Tour", IsActive = true},
		new() { PID = new Guid("cebff353-c600-4ed9-ac4d-e6d6765fc6f0"), Name = "Usage Monitoring" ,Description = "Usage Monitoring", IsActive = true},
		new() { PID = new Guid("8b3c633c-eb6b-4165-b073-f15142089e07"), Name = "Operation app" ,Description = "Operation app", IsActive = true},
		new() { PID = new Guid("b78f2175-3b7d-4f91-94df-a5de5e339476"), Name = "Home content" ,Description = "Home content", IsActive = true}
	};
	// HomeContent
	public static mtPrivilegeItem HC000 = new() { PTID = new Guid("0768692f-a586-42b2-8fea-ce0706387ed4"), PID = new Guid("bbc5d8ed-0a6b-4d98-b5c6-5c908d723897"), Name = "Menu Home", Description = "All home access", Code = "HC000", IsActive = false };
	public static mtPrivilegeItem HC001 = new() { PTID = new Guid("9bfe9f97-205d-4a4d-8b7b-c0a75e3485dd"), PID = new Guid("bbc5d8ed-0a6b-4d98-b5c6-5c908d723897"), Name = "View Home content", Description = "View Home content", Code = "HC001", IsActive = true };
	public static mtPrivilegeItem HC002 = new() { PTID = new Guid("a3958d8c-f1f7-4865-872b-f91fc439bec6"), PID = new Guid("bbc5d8ed-0a6b-4d98-b5c6-5c908d723897"), Name = "Edit Home content", Description = "Edit Home content", Code = "HC002", IsActive = true };
	// Notifications
	public static mtPrivilegeItem NT000 = new() { PTID = new Guid("c7caf3cc-9130-4035-ba54-bb7dd418f1ae"), PID = new Guid("b6cf116b-0cb9-4f99-a8ab-8379b9cb56a5"), Name = "Menu Notification", Description = "All notifications access", Code = "NT000", IsActive = false };
	public static mtPrivilegeItem NT001 = new() { PTID = new Guid("499b184b-a44b-4d0c-953a-9204c4c07ddd"), PID = new Guid("b6cf116b-0cb9-4f99-a8ab-8379b9cb56a5"), Name = "View in-app notifications list and details", Description = "View in-app notifications list and details", Code = "NT001", IsActive = true };
	public static mtPrivilegeItem NT002 = new() { PTID = new Guid("fa1ad67a-00bc-4397-b63a-bab78532c28f"), PID = new Guid("b6cf116b-0cb9-4f99-a8ab-8379b9cb56a5"), Name = "Create and edit in-app notification", Description = "Create and edit in-app notification", Code = "NT002", IsActive = true };
	public static mtPrivilegeItem NT003 = new() { PTID = new Guid("18f96e4a-d5ed-41c3-b733-ca8f08fca318"), PID = new Guid("b6cf116b-0cb9-4f99-a8ab-8379b9cb56a5"), Name = "View draft list and details", Description = "View draft list and details", Code = "NT003", IsActive = true };
	public static mtPrivilegeItem NT004 = new() { PTID = new Guid("5c371466-64b6-4608-a66b-9ddcaddec183"), PID = new Guid("b6cf116b-0cb9-4f99-a8ab-8379b9cb56a5"), Name = "Edit draft", Description = "", Code = "NT004", IsActive = true };
	public static mtPrivilegeItem NT005 = new() { PTID = new Guid("560af02b-45da-428c-8aa8-aaf4b6201048"), PID = new Guid("b6cf116b-0cb9-4f99-a8ab-8379b9cb56a5"), Name = "View template list and details", Description = "", Code = "NT005", IsActive = true };
	public static mtPrivilegeItem NT006 = new() { PTID = new Guid("c545119b-7587-4a16-a71d-ad6c189a9106"), PID = new Guid("b6cf116b-0cb9-4f99-a8ab-8379b9cb56a5"), Name = "Create and edit new template", Description = "", Code = "NT006", IsActive = true };
	public static mtPrivilegeItem NT007 = new() { PTID = new Guid("e70e6e8f-3267-4e53-a5af-797e9d96ccce"), PID = new Guid("b6cf116b-0cb9-4f99-a8ab-8379b9cb56a5"), Name = "View in-app notification category list and details", Description = "", Code = "NT007", IsActive = true };
	public static mtPrivilegeItem NT008 = new() { PTID = new Guid("4d7b12d5-0a19-48d2-b524-669ca35acedc"), PID = new Guid("b6cf116b-0cb9-4f99-a8ab-8379b9cb56a5"), Name = "Create and edit new in-app notifications category", Description = "", Code = "NT008", IsActive = true };
	public static mtPrivilegeItem NT009 = new() { PTID = new Guid("59298d4c-1a15-4f5f-bfcd-4f76287c7fdc"), PID = new Guid("b6cf116b-0cb9-4f99-a8ab-8379b9cb56a5"), Name = "Approve or rejected the submitted notification", Description = "", Code = "NT009", IsActive = true };
	// Building service
	public static mtPrivilegeItem BS000 = new() { PTID = new Guid("25461bf1-ac46-4ed5-b6f4-170b7ee70bb5"), PID = new Guid("39a48451-b23a-43a8-89aa-65ed88403027"), Name = "Menu building", Description = "", Code = "BS000", IsActive = false };
	public static mtPrivilegeItem BS001 = new() { PTID = new Guid("cf3a9564-b228-4ca2-858c-66d5c2b35185"), PID = new Guid("39a48451-b23a-43a8-89aa-65ed88403027"), Name = "View service request list and details", Description = "", Code = "BS001", IsActive = true };
	public static mtPrivilegeItem BS002 = new() { PTID = new Guid("1d690399-1844-4295-bf90-42d135e80a0c"), PID = new Guid("39a48451-b23a-43a8-89aa-65ed88403027"), Name = "Update service request status", Description = "", Code = "BS002", IsActive = true };
	public static mtPrivilegeItem BS003 = new() { PTID = new Guid("575e3781-e3e9-4b98-b1cf-8f347b2cf065"), PID = new Guid("39a48451-b23a-43a8-89aa-65ed88403027"), Name = "View air conditioner request list and details", Description = "", Code = "BS003", IsActive = true };
	public static mtPrivilegeItem BS004 = new() { PTID = new Guid("3c19577e-4bbe-4545-a1cd-977684059382"), PID = new Guid("39a48451-b23a-43a8-89aa-65ed88403027"), Name = "Update air conditioner request status", Description = "", Code = "BS004", IsActive = true };
	public static mtPrivilegeItem BS005 = new() { PTID = new Guid("86f4b1ab-c705-4893-a6e7-0c86e287c89b"), PID = new Guid("39a48451-b23a-43a8-89aa-65ed88403027"), Name = "View issue type list and details", Description = "", Code = "BS005", IsActive = true };
	public static mtPrivilegeItem BS006 = new() { PTID = new Guid("2d1911ae-04c8-4f17-bdeb-4c6e077cb1ae"), PID = new Guid("39a48451-b23a-43a8-89aa-65ed88403027"), Name = "Create and edit issue type", Description = "", Code = "BS006", IsActive = true };
	public static mtPrivilegeItem BS007 = new() { PTID = new Guid("27e29d0f-8a02-4176-8f78-ec73c4387d5e"), PID = new Guid("39a48451-b23a-43a8-89aa-65ed88403027"), Name = "View Tenant access", Description = "", Code = "BS007", IsActive = true };
	public static mtPrivilegeItem BS008 = new() { PTID = new Guid("cc4813ae-2a85-42d3-a459-7c80243f9d3e"), PID = new Guid("39a48451-b23a-43a8-89aa-65ed88403027"), Name = "View Visitor access", Description = "", Code = "BS008", IsActive = true };
	public static mtPrivilegeItem BS009 = new() { PTID = new Guid("cc4813ae-2a85-42d3-a459-7c80243f9abc"), PID = new Guid("39a48451-b23a-43a8-89aa-65ed88403027"), Name = "Urgent Service Request", Description = "Urgent Service Request", Code = "BS009", IsActive = true };


	// Art and Culture
    public static mtPrivilegeItem AC000 = new() { PTID = new Guid("c294084f-fd98-48db-ba61-a4daf84cf44b"), PID = new Guid("88915772-0e5b-4fb3-9003-4a8b775af55c"), Name = "Menu Art & Culture", Description = "", Code = "AC000", IsActive = false };
	public static mtPrivilegeItem AC001 = new() { PTID = new Guid("96ba4acf-1c97-4220-b2ef-6eb655a30a38"), PID = new Guid("88915772-0e5b-4fb3-9003-4a8b775af55c"), Name = "Config Art&C Landing Page", Description = "", Code = "AC001", IsActive = true };
	public static mtPrivilegeItem AC002 = new() { PTID = new Guid("fec95e97-8767-4139-909b-2cc52c800501"), PID = new Guid("88915772-0e5b-4fb3-9003-4a8b775af55c"), Name = "View Art+C", Description = "", Code = "AC002", IsActive = true };
	public static mtPrivilegeItem AC003 = new() { PTID = new Guid("482f7f4d-aac8-4ef2-90a3-c7178852499f"), PID = new Guid("88915772-0e5b-4fb3-9003-4a8b775af55c"), Name = "Create Art+C", Description = "", Code = "AC003", IsActive = true };
	public static mtPrivilegeItem AC004 = new() { PTID = new Guid("6eb76e1a-b5ba-4a4d-971b-c753c9ee0dd2"), PID = new Guid("88915772-0e5b-4fb3-9003-4a8b775af55c"), Name = "Edit Art+C", Description = "", Code = "AC004", IsActive = true };
	public static mtPrivilegeItem AC005 = new() { PTID = new Guid("3d147124-ac5d-42a1-b1e0-7e3a531bbe8b"), PID = new Guid("88915772-0e5b-4fb3-9003-4a8b775af55c"), Name = "View Art&C Program", Description = "", Code = "AC005", IsActive = true };
	public static mtPrivilegeItem AC006 = new() { PTID = new Guid("345719dc-c6df-4d65-8a82-752273b9864b"), PID = new Guid("88915772-0e5b-4fb3-9003-4a8b775af55c"), Name = "Create Art&C Program", Description = "", Code = "AC006", IsActive = true };
	public static mtPrivilegeItem AC007 = new() { PTID = new Guid("7bfa25e4-7d0f-4fa2-81f4-d464e0888cae"), PID = new Guid("88915772-0e5b-4fb3-9003-4a8b775af55c"), Name = "Edit Art&C Program", Description = "", Code = "AC007", IsActive = true };
	public static mtPrivilegeItem AC008 = new() { PTID = new Guid("e63e87c3-9ab2-4d21-9b0b-435ce7ca3206"), PID = new Guid("88915772-0e5b-4fb3-9003-4a8b775af55c"), Name = "View Art&C Add-On", Description = "", Code = "AC008", IsActive = true };
	public static mtPrivilegeItem AC009 = new() { PTID = new Guid("b28c71e1-ac54-4706-8b9e-e435139a8ea3"), PID = new Guid("88915772-0e5b-4fb3-9003-4a8b775af55c"), Name = "Create Art&C Add-On", Description = "", Code = "AC009", IsActive = true };
	public static mtPrivilegeItem AC010 = new() { PTID = new Guid("4411d520-34ac-4f32-9275-5158b3d14d3f"), PID = new Guid("88915772-0e5b-4fb3-9003-4a8b775af55c"), Name = "Edit Art&C Add-On", Description = "", Code = "AC010", IsActive = true };
	public static mtPrivilegeItem AC011 = new() { PTID = new Guid("ffd40f99-f1c4-4e6e-b2b8-5cd9d6c6fccc"), PID = new Guid("88915772-0e5b-4fb3-9003-4a8b775af55c"), Name = "View Art&C Playlist", Description = "", Code = "AC011", IsActive = true };
	public static mtPrivilegeItem AC012 = new() { PTID = new Guid("de9a81e1-3454-4570-aa6b-ca9cae6545d1"), PID = new Guid("88915772-0e5b-4fb3-9003-4a8b775af55c"), Name = "Create Art&C Playlist", Description = "", Code = "AC012", IsActive = true };
	public static mtPrivilegeItem AC013 = new() { PTID = new Guid("f270445f-018e-4f68-b9f9-b8b10e7350fe"), PID = new Guid("88915772-0e5b-4fb3-9003-4a8b775af55c"), Name = "Edit Art&C Playlist", Description = "", Code = "AC013", IsActive = true };
	public static mtPrivilegeItem AC014 = new() { PTID = new Guid("28a8193f-a616-48ca-ac04-b421da2111d1"), PID = new Guid("88915772-0e5b-4fb3-9003-4a8b775af55c"), Name = "View Art&C Faqs", Description = "", Code = "AC014", IsActive = true };
	public static mtPrivilegeItem AC015 = new() { PTID = new Guid("37ea6ba3-8622-4884-be61-d665ded8c6ae"), PID = new Guid("88915772-0e5b-4fb3-9003-4a8b775af55c"), Name = "Create Art&C Faqs", Description = "", Code = "AC015", IsActive = true };
	public static mtPrivilegeItem AC016 = new() { PTID = new Guid("d25bdc92-1a9b-4222-b07d-b9d32b40678d"), PID = new Guid("88915772-0e5b-4fb3-9003-4a8b775af55c"), Name = "Edit Art&C Faqs", Description = "", Code = "AC016", IsActive = true };
	public static mtPrivilegeItem AC017 = new() { PTID = new Guid("32efd3a8-0955-49e4-ad41-2dbeef20e757"), PID = new Guid("88915772-0e5b-4fb3-9003-4a8b775af55c"), Name = "Order Art&C Faqs", Description = "", Code = "AC017", IsActive = true };
	public static mtPrivilegeItem AC018 = new() { PTID = new Guid("9bdf8ca3-b588-410a-8284-db61ff581256"), PID = new Guid("88915772-0e5b-4fb3-9003-4a8b775af55c"), Name = "View Art&C Partners", Description = "", Code = "AC018", IsActive = true };
	public static mtPrivilegeItem AC019 = new() { PTID = new Guid("5018e9ef-80e7-480a-9afc-c0234b7dc776"), PID = new Guid("88915772-0e5b-4fb3-9003-4a8b775af55c"), Name = "Create Art&C Partners", Description = "", Code = "AC019", IsActive = true };
	public static mtPrivilegeItem AC020 = new() { PTID = new Guid("6a3e6352-94e5-4f6b-b165-0959e00a4dec"), PID = new Guid("88915772-0e5b-4fb3-9003-4a8b775af55c"), Name = "Edit Art&C Partners", Description = "", Code = "AC020", IsActive = true };
	public static mtPrivilegeItem AC021 = new() { PTID = new Guid("d5f9a1c3-d5a0-4231-b04b-e4dfe9033b85"), PID = new Guid("88915772-0e5b-4fb3-9003-4a8b775af55c"), Name = "Create Booking Settings", Description = "", Code = "AC021", IsActive = true };
	public static mtPrivilegeItem AC022 = new() { PTID = new Guid("44c968b5-3570-4167-8837-1e34c0018f29"), PID = new Guid("88915772-0e5b-4fb3-9003-4a8b775af55c"), Name = "Edit Booking Settings", Description = "", Code = "AC022", IsActive = true };
	public static mtPrivilegeItem AC023 = new() { PTID = new Guid("c416a919-c795-42f9-a733-a84e63a6b8c4"), PID = new Guid("88915772-0e5b-4fb3-9003-4a8b775af55c"), Name = "View Booking History", Description = "", Code = "AC023", IsActive = true };
	public static mtPrivilegeItem AC024 = new() { PTID = new Guid("9b3ab157-e0b3-4bdb-9aba-1ad99a23a059"), PID = new Guid("88915772-0e5b-4fb3-9003-4a8b775af55c"), Name = "View Booking Status", Description = "", Code = "AC024", IsActive = true };
	public static mtPrivilegeItem AC025 = new() { PTID = new Guid("4dcc5462-ef19-4569-8231-faf1725c1f99"), PID = new Guid("88915772-0e5b-4fb3-9003-4a8b775af55c"), Name = "Edit Booking Status", Description = "", Code = "AC025", IsActive = true };
	public static mtPrivilegeItem AC026 = new() { PTID = new Guid("812edf62-3850-46e4-bef5-840cb2823816"), PID = new Guid("88915772-0e5b-4fb3-9003-4a8b775af55c"), Name = "Scan Ticket", Description = "", Code = "AC026", IsActive = true };
	public static mtPrivilegeItem AC027 = new() { PTID = new Guid("780e0999-85b0-4b54-b433-918c8ef0298a"), PID = new Guid("88915772-0e5b-4fb3-9003-4a8b775af55c"), Name = "Reset Ticket", Description = "", Code = "AC027", IsActive = true };

	// App setting
	public static mtPrivilegeItem AS000 = new() { PTID = new Guid("108e481f-c36f-43ef-af5d-eae802d4499b"), PID = new Guid("05eb29b8-e23d-4457-b9b5-7440e24903c8"), Name = "Menu App Setting", Description = "All app setting access", Code = "AS000", IsActive = false };
	public static mtPrivilegeItem AS001 = new() { PTID = new Guid("6b87dcbe-ed47-421c-bd0c-f1007f430a5a"), PID = new Guid("05eb29b8-e23d-4457-b9b5-7440e24903c8"), Name = "View FAQ list and details", Description = "", Code = "AS001", IsActive = true };
	public static mtPrivilegeItem AS002 = new() { PTID = new Guid("14cbaf23-dd5d-4819-984e-539f193a0c30"), PID = new Guid("05eb29b8-e23d-4457-b9b5-7440e24903c8"), Name = "Create and edit FAQs", Description = "", Code = "AS002", IsActive = true };
	public static mtPrivilegeItem AS003 = new() { PTID = new Guid("5647c352-0c08-4982-806e-b764ff061ba4"), PID = new Guid("05eb29b8-e23d-4457-b9b5-7440e24903c8"), Name = "View contact center", Description = "", Code = "AS003", IsActive = true };
	public static mtPrivilegeItem AS004 = new() { PTID = new Guid("26c3f61a-f9a5-4348-a2b6-aa0924368f84"), PID = new Guid("05eb29b8-e23d-4457-b9b5-7440e24903c8"), Name = "Edit contact center", Description = "", Code = "AS004", IsActive = true };
	public static mtPrivilegeItem AS005 = new() { PTID = new Guid("55c4ada7-e1cf-43e2-8770-5102c03f8a8e"), PID = new Guid("05eb29b8-e23d-4457-b9b5-7440e24903c8"), Name = "View app version", Description = "", Code = "AS005", IsActive = true };
	public static mtPrivilegeItem AS006 = new() { PTID = new Guid("4e359a86-af2e-4b46-806c-e667aa95bd02"), PID = new Guid("05eb29b8-e23d-4457-b9b5-7440e24903c8"), Name = "Update new app version", Description = "", Code = "AS006", IsActive = true };
	public static mtPrivilegeItem AS007 = new() { PTID = new Guid("e3776352-3511-4b75-b1f3-1b46c9fb1d57"), PID = new Guid("05eb29b8-e23d-4457-b9b5-7440e24903c8"), Name = "View app maintenance", Description = "", Code = "AS007", IsActive = true };
	public static mtPrivilegeItem AS008 = new() { PTID = new Guid("18611757-7383-45ff-8fa6-b2223018d1c6"), PID = new Guid("05eb29b8-e23d-4457-b9b5-7440e24903c8"), Name = "Update app maintenance", Description = "", Code = "AS008", IsActive = true };
	public static mtPrivilegeItem AS009 = new() { PTID = new Guid("ae4f3bcc-ed43-4abb-a082-a1b2cba6bea3"), PID = new Guid("05eb29b8-e23d-4457-b9b5-7440e24903c8"), Name = "View legal content", Description = "", Code = "AS009", IsActive = true };
	public static mtPrivilegeItem AS010 = new() { PTID = new Guid("9f9f751f-3144-49a0-9d7b-c32d742dcd72"), PID = new Guid("05eb29b8-e23d-4457-b9b5-7440e24903c8"), Name = "Edit legal content", Description = "", Code = "AS010", IsActive = true };
	// Member and Roles
	public static mtPrivilegeItem MR000 = new() { PTID = new Guid("ecc622f9-b411-4286-8a50-df2100277210"), PID = new Guid("d7c9f435-92ab-4177-b888-68f46152f604"), Name = "Menu Member And Role", Description = "", Code = "MR000", IsActive = false };
	public static mtPrivilegeItem MR001 = new() { PTID = new Guid("a04722d6-0fc2-4144-b77a-2a67e838f2f1"), PID = new Guid("d7c9f435-92ab-4177-b888-68f46152f604"), Name = "View member management list", Description = "", Code = "MR001", IsActive = true };
	public static mtPrivilegeItem MR002 = new() { PTID = new Guid("d34c2f62-b729-47fa-a1a9-19a6acbb52cb"), PID = new Guid("d7c9f435-92ab-4177-b888-68f46152f604"), Name = "Invite and edit member", Description = "", Code = "MR002", IsActive = true };
	public static mtPrivilegeItem MR003 = new() { PTID = new Guid("65d83597-f3db-4037-acbe-24bf8e01672b"), PID = new Guid("d7c9f435-92ab-4177-b888-68f46152f604"), Name = "View role management list", Description = "", Code = "MR003", IsActive = true };
	public static mtPrivilegeItem MR004 = new() { PTID = new Guid("9ff4e790-dfdb-401c-b450-0e3cc6fa008f"), PID = new Guid("d7c9f435-92ab-4177-b888-68f46152f604"), Name = "Create and edit new role", Description = "", Code = "MR004", IsActive = true };
	// Users
	public static mtPrivilegeItem UU000 = new() { PTID = new Guid("187050f0-ff0e-4767-b37e-2755f0de169a"), PID = new Guid("ee2312ca-2114-4595-9c6b-93dd548a5d88"), Name = "Menu User", Description = "", Code = "UU000", IsActive = false };
	public static mtPrivilegeItem UU001 = new() { PTID = new Guid("f92a3d95-a360-455f-a5df-1534e6fec172"), PID = new Guid("ee2312ca-2114-4595-9c6b-93dd548a5d88"), Name = "View user list and details", Description = "", Code = "UU001", IsActive = true };
	public static mtPrivilegeItem UU002 = new() { PTID = new Guid("e73f190f-6ac7-42a6-b1de-3288c4eea2b5"), PID = new Guid("ee2312ca-2114-4595-9c6b-93dd548a5d88"), Name = "Edit user details", Description = "", Code = "UU002", IsActive = true };

	//car park
	public static mtPrivilegeItem CP000 = new() { PTID = new Guid("df22f078-8c49-47a8-bbaa-37a529a24fba"), PID = new Guid("307c778e-3eed-424e-9ab5-b97cf451ff30"), Name = "Menu Car Park", Description = "", Code = "CP000", IsActive = false };
	public static mtPrivilegeItem CP001 = new() { PTID = new Guid("6319d36b-09cc-4304-842f-a5dac90cb86e"), PID = new Guid("307c778e-3eed-424e-9ab5-b97cf451ff30"), Name = "View Cars access Activities", Description = "", Code = "CP001", IsActive = true };
	public static mtPrivilegeItem CP002 = new() { PTID = new Guid("44ee9361-9c44-4435-aece-01204e0374f1"), PID = new Guid("307c778e-3eed-424e-9ab5-b97cf451ff30"), Name = "Retail Parking: Store Whitelist", Description = "", Code = "CP002", IsActive = true };
	public static mtPrivilegeItem CP003 = new() { PTID = new Guid("6fa909d3-7419-4dc0-a7bf-0292c9527a01"), PID = new Guid("307c778e-3eed-424e-9ab5-b97cf451ff30"), Name = "Retail Parking: Mall Property", Description = "", Code = "CP003", IsActive = true };
	public static mtPrivilegeItem CP005 = new() { PTID = new Guid("137ad989-7a8d-4677-a866-480e944ea68a"), PID = new Guid("307c778e-3eed-424e-9ab5-b97cf451ff30"), Name = "Retail Parking: Document Type", Description = "", Code = "CP005", IsActive = true };
	public static mtPrivilegeItem CP006 = new() { PTID = new Guid("b35991e9-961c-4b99-9a93-253d1b37b2eb"), PID = new Guid("307c778e-3eed-424e-9ab5-b97cf451ff30"), Name = "Retail Parking: Campaign", Description = "", Code = "CP006", IsActive = true };
	public static mtPrivilegeItem CP007 = new() { PTID = new Guid("d9c64711-9d19-4fc0-bb4a-75129dd552bd"), PID = new Guid("307c778e-3eed-424e-9ab5-b97cf451ff30"), Name = "Self Redemption Record", Description = "", Code = "CP007", IsActive = true };
	public static mtPrivilegeItem CP008 = new() { PTID = new Guid("11d5f8ea-5b35-41e0-bc61-97ff9969ed64"), PID = new Guid("307c778e-3eed-424e-9ab5-b97cf451ff30"), Name = "Self Redemption Detail", Description = "", Code = "CP008", IsActive = true };
	//sustainability
	public static mtPrivilegeItem ST000 = new() { PTID = new Guid("8a2c6484-2f5a-4b84-926a-3b8a5f1a3d12"), PID = new Guid("d9a457c9-bf09-4e2d-89ab-123456789abc"), Name = "Menu Sustainability", Description = "All Sustainability access", Code = "ST000", IsActive = false };
	public static mtPrivilegeItem ST001 = new() { PTID = new Guid("92b60d21-5b8f-43a8-9827-6e92c5c3123a"), PID = new Guid("d9a457c9-bf09-4e2d-89ab-123456789abc"), Name = "Update Banner", Description = "", Code = "ST001", IsActive = true };
	public static mtPrivilegeItem ST002 = new() { PTID = new Guid("c7b85f14-e7a3-4d8b-9441-77b8d63f4a29"), PID = new Guid("d9a457c9-bf09-4e2d-89ab-123456789abc"), Name = "View PRBanner", Description = "", Code = "ST002", IsActive = true };
	public static mtPrivilegeItem ST003 = new() { PTID = new Guid("efa8cbe7-4d54-4bfb-986f-4b7c3c6e7d29"), PID = new Guid("d9a457c9-bf09-4e2d-89ab-123456789abc"), Name = "Edit PRBanner", Description = "", Code = "ST003", IsActive = true };
	public static mtPrivilegeItem ST004 = new() { PTID = new Guid("f2b67e7c-59f2-4426-812a-678c6d1e3e93"), PID = new Guid("d9a457c9-bf09-4e2d-89ab-123456789abc"), Name = "View Content Management", Description = "", Code = "ST004", IsActive = true };
	public static mtPrivilegeItem ST005 = new() { PTID = new Guid("0e9a80f5-2394-49c3-bf0c-7a8e27b2c4e2"), PID = new Guid("d9a457c9-bf09-4e2d-89ab-123456789abc"), Name = "Edit Content Management", Description = "", Code = "ST005", IsActive = true };
	public static mtPrivilegeItem ST006 = new() { PTID = new Guid("a4b2394f-2c7a-4b34-b80e-2d1b6a9f1a3c"), PID = new Guid("d9a457c9-bf09-4e2d-89ab-123456789abc"), Name = "View Library", Description = "", Code = "ST006", IsActive = true };
	public static mtPrivilegeItem ST007 = new() { PTID = new Guid("b7d25f46-5e8a-4db6-ae8c-7f9b5c7d4e1e"), PID = new Guid("d9a457c9-bf09-4e2d-89ab-123456789abc"), Name = "Edit Library", Description = "", Code = "ST007", IsActive = true };
	public static mtPrivilegeItem ST008 = new() { PTID = new Guid("2d1a20dd-df64-4e57-a3ba-5e731534d461"), PID = new Guid("d9a457c9-bf09-4e2d-89ab-123456789abc"), Name = "Create PRBanner", Description = "", Code = "ST008", IsActive = true };
	public static mtPrivilegeItem ST009 = new() { PTID = new Guid("b5a7a499-1c12-4c99-9b4a-d5bc882d4bda"), PID = new Guid("d9a457c9-bf09-4e2d-89ab-123456789abc"), Name = "Create Content Management", Description = "", Code = "ST009", IsActive = true };
	public static mtPrivilegeItem ST010 = new() { PTID = new Guid("21454bdb-2a44-4b39-8df5-cdb703d33180"), PID = new Guid("d9a457c9-bf09-4e2d-89ab-123456789abc"), Name = "Sub Content Management", Description = "", Code = "ST010", IsActive = true };
	public static mtPrivilegeItem ST011 = new() { PTID = new Guid("e4972901-3f9c-4b38-aafb-234d43c9d6fc"), PID = new Guid("d9a457c9-bf09-4e2d-89ab-123456789abc"), Name = "Create Library", Description = "", Code = "ST011", IsActive = true };

	//marcom
	public static mtPrivilegeItem MC000 = new() { PTID = new Guid("fad4a7fc-8076-40c0-93bb-1404558549e0"), PID = new Guid("f994b3b2-2b16-4619-b71e-7f918315d936"), Name = "Menu Marcom", Description = "All Marcom access", Code = "MC000", IsActive = false };
	public static mtPrivilegeItem MC001 = new() { PTID = new Guid("a6f07bc9-51d4-4fdd-8215-2aa68383dbfc"), PID = new Guid("f994b3b2-2b16-4619-b71e-7f918315d936"), Name = "List Hero banner", Description = "", Code = "MC001", IsActive = true };
	public static mtPrivilegeItem MC002 = new() { PTID = new Guid("c9453aea-fbc3-4559-84a9-103a532c998a"), PID = new Guid("f994b3b2-2b16-4619-b71e-7f918315d936"), Name = "Create Hero banner", Description = "", Code = "MC002", IsActive = true };
	public static mtPrivilegeItem MC003 = new() { PTID = new Guid("cf3d1993-73fe-42b5-b345-d9cc9e7ce331"), PID = new Guid("f994b3b2-2b16-4619-b71e-7f918315d936"), Name = "Edit Hero banner", Description = "", Code = "MC003", IsActive = true };
	public static mtPrivilegeItem MC004 = new() { PTID = new Guid("b8b117ba-18da-4f73-b67f-7db1581a1b30"), PID = new Guid("f994b3b2-2b16-4619-b71e-7f918315d936"), Name = "List Special event", Description = "", Code = "MC004", IsActive = true };
	public static mtPrivilegeItem MC005 = new() { PTID = new Guid("ddfd5827-7610-401f-891f-0fee217f811d"), PID = new Guid("f994b3b2-2b16-4619-b71e-7f918315d936"), Name = "Create Special event", Description = "", Code = "MC005", IsActive = true };
	public static mtPrivilegeItem MC006 = new() { PTID = new Guid("4ed288f3-11d9-4181-86ae-5684d4c9ebbd"), PID = new Guid("f994b3b2-2b16-4619-b71e-7f918315d936"), Name = "Edit Special event", Description = "", Code = "MC006", IsActive = true };
	public static mtPrivilegeItem MC007 = new() { PTID = new Guid("456dcf29-047e-4482-9f91-74ddf7b10594"), PID = new Guid("f994b3b2-2b16-4619-b71e-7f918315d936"), Name = "List Explore One Bangkok", Description = "", Code = "MC007", IsActive = true };
	public static mtPrivilegeItem MC008 = new() { PTID = new Guid("a02b32ea-8db3-4e71-9b97-6dd1fb8828b8"), PID = new Guid("f994b3b2-2b16-4619-b71e-7f918315d936"), Name = "Create Explore One Bangkok", Description = "", Code = "MC008", IsActive = true };
	public static mtPrivilegeItem MC009 = new() { PTID = new Guid("9a4eeb91-3a8e-4a8a-80e7-bdc9ac36a88a"), PID = new Guid("f994b3b2-2b16-4619-b71e-7f918315d936"), Name = "Edit Explore One Bangkok", Description = "", Code = "MC009", IsActive = true };
	public static mtPrivilegeItem MC010 = new() { PTID = new Guid("05a8f11e-d1ed-4eb5-8430-4907967eb301"), PID = new Guid("f994b3b2-2b16-4619-b71e-7f918315d936"), Name = "List What's Happening", Description = "", Code = "MC010", IsActive = true };
	public static mtPrivilegeItem MC011 = new() { PTID = new Guid("3a11067d-c22f-40d6-b2c9-8ba1e00e0cce"), PID = new Guid("f994b3b2-2b16-4619-b71e-7f918315d936"), Name = "Create What's Happening", Description = "", Code = "MC011", IsActive = true };
	public static mtPrivilegeItem MC012 = new() { PTID = new Guid("a037a451-0db5-4832-9fae-9111c89d1cfc"), PID = new Guid("f994b3b2-2b16-4619-b71e-7f918315d936"), Name = "Edit What's Happening", Description = "", Code = "MC012", IsActive = true };
	public static mtPrivilegeItem MC013 = new() { PTID = new Guid("0e82ceb7-6c37-44a3-83a7-ba700be6e5d9"), PID = new Guid("f994b3b2-2b16-4619-b71e-7f918315d936"), Name = "Article What's Happening", Description = "", Code = "MC013", IsActive = true };

	//guard tour
	public static mtPrivilegeItem GT000 = new() { PTID = new Guid("f1e42cc1-0072-4bf3-b583-300257693ceb"), PID = new Guid("d53031b0-4112-4039-9360-4373dcfb881e"), Name = "Menu Guard Tour", Description = "Menu Guard Tour", Code = "GT000", IsActive = false };
	public static mtPrivilegeItem GT001 = new() { PTID = new Guid("87359e39-78e2-4c5b-b8a4-1f907b2859ec"), PID = new Guid("d53031b0-4112-4039-9360-4373dcfb881e"), Name = "View Action Management", Description = "View Action Management", Code = "GT001", IsActive = true };
	public static mtPrivilegeItem GT002 = new() { PTID = new Guid("3148fe4b-2dc5-43c0-a5a1-51b54c29d300"), PID = new Guid("d53031b0-4112-4039-9360-4373dcfb881e"), Name = "View Task Management", Description = "View Task Management", Code = "GT002", IsActive = true };
	public static mtPrivilegeItem GT003 = new() { PTID = new Guid("db9bc3e3-dd23-4b75-bfe0-bae28f165fc9"), PID = new Guid("d53031b0-4112-4039-9360-4373dcfb881e"), Name = "View Schedule Plan", Description = "View Schedule Plan", Code = "GT003", IsActive = true };
	public static mtPrivilegeItem GT004 = new() { PTID = new Guid("08685195-a06b-42f1-a307-37a51c8aa80f"), PID = new Guid("d53031b0-4112-4039-9360-4373dcfb881e"), Name = "View Activity Procedures", Description = "View Activity Procedures", Code = "GT004", IsActive = true };


	public static mtPrivilegeItem GT005 = new() { PTID = new Guid("7f46e7e5-6de9-423b-b4d7-fb5f44a3072e"), PID = new Guid("d53031b0-4112-4039-9360-4373dcfb881e"), Name = "QR Management", Description = "QR Management", Code = "GT005", IsActive = true };
	public static mtPrivilegeItem GT006 = new() { PTID = new Guid("c62a05b8-72e2-4d98-bb1e-132a29f21e1f"), PID = new Guid("d53031b0-4112-4039-9360-4373dcfb881e"), Name = "Create Task By Activity Procedures", Description = "Create Task By Activity Procedures", Code = "GT006", IsActive = true };

	public static mtPrivilegeItem UM000 = new() { PTID = new Guid("07fff0ba-3c50-43b8-a269-cef9389b254c"), PID = new Guid("cebff353-c600-4ed9-ac4d-e6d6765fc6f0"), Name = "Usage Monitoring", Description = "Usage Monitoring", Code = "UM000", IsActive = false };
	public static mtPrivilegeItem UM001 = new() { PTID = new Guid("cc05a841-80cd-49e2-b342-e16fd72b3d22"), PID = new Guid("cebff353-c600-4ed9-ac4d-e6d6765fc6f0"), Name = "Usage Monitoring Summary", Description = "Usage Monitoring Summary", Code = "UM001", IsActive = true };
	public static mtPrivilegeItem UM002 = new() { PTID = new Guid("7a0d5c2d-04dd-40a1-b3ca-240da580da5f"), PID = new Guid("cebff353-c600-4ed9-ac4d-e6d6765fc6f0"), Name = "Staff-Table", Description = "Staff-Table", Code = "UM002", IsActive = true };
	public static mtPrivilegeItem UM003 = new() { PTID = new Guid("f9e1a00c-534a-4644-a9cb-a9ca35940838"), PID = new Guid("cebff353-c600-4ed9-ac4d-e6d6765fc6f0"), Name = "Roster", Description = "Roster", Code = "UM003", IsActive = true };

	//Operation Onboard
	public static mtPrivilegeItem OP000 = new() { PTID = new Guid("df4f4b00-86e8-4504-b733-39484060a8f5"), PID = new Guid("8b3c633c-eb6b-4165-b073-f15142089e07"), Name = "Operation app", Description = "Operation app", Code = "OP000", IsActive = false };
	public static mtPrivilegeItem OP001 = new() { PTID = new Guid("739432c3-02f7-4d86-9adf-2dea1e72b713"), PID = new Guid("8b3c633c-eb6b-4165-b073-f15142089e07"), Name = "Operations Onboarding", Description = "Operations Onboarding", Code = "OP001", IsActive = true };
	public static mtPrivilegeItem OP002 = new() { PTID = new Guid("a151df3a-aa4b-4489-a879-7be2f80e0e40"), PID = new Guid("8b3c633c-eb6b-4165-b073-f15142089e07"), Name = "Operations Onboarding Create", Description = "Operations Onboarding Create", Code = "OP002", IsActive = true };
	public static mtPrivilegeItem OP003 = new() { PTID = new Guid("d74b073f-7c2b-4ef4-9810-19d0f8fdd3a6"), PID = new Guid("8b3c633c-eb6b-4165-b073-f15142089e07"), Name = "Reset Password CMS", Description = "Reset password CMS to default", Code = "OP003", IsActive = true };
	//office
	public static mtPrivilegeItem OF000 = new()
	{
		PTID = new Guid("3611e967-5cb7-40c6-aa18-ba5189084d80"),
		PID = new Guid("b78f2175-3b7d-4f91-94df-a5de5e339476"),
		Name = "Menu Office",
		Description = "All Menu Office",
		Code = "OF000",
		IsActive = false
	};

	public static mtPrivilegeItem OF001 = new()
	{
		PTID = new Guid("5ee02541-2657-41e1-92e2-6f3b31c5057b"),
		PID = new Guid("b78f2175-3b7d-4f91-94df-a5de5e339476"),
		Name = "View HomeContent",
		Description = "view homecontent",
		Code = "OF001",
		IsActive = true
	};

	public static mtPrivilegeItem OF002 = new()
	{
		PTID = new Guid("f231f8e0-5f4f-41bd-9826-91718cef9fe7"),
		PID = new Guid("b78f2175-3b7d-4f91-94df-a5de5e339476"),
		Name = "View What Happening",
		Description = "view whathappening",
		Code = "OF002",
		IsActive = true
	};

	public static mtPrivilegeItem OF003 = new()
	{
		PTID = new Guid("5c3de96d-3d67-4d4c-9c1b-1c9d5f191283"),
		PID = new Guid("b78f2175-3b7d-4f91-94df-a5de5e339476"),
		Name = "View Version History",
		Description = "view version history",
		Code = "OF003",
		IsActive = true
	};

	public static mtPrivilegeItem OF004 = new()
	{
		PTID = new Guid("8f4a9416-e067-4834-a613-dd882b0693dc"),
		PID = new Guid("b78f2175-3b7d-4f91-94df-a5de5e339476"),
		Name = "View Directory Contact",
		Description = "view directory contact",
		Code = "OF004",
		IsActive = true
	};

	public static mtPrivilegeItem OF005 = new()
	{
		PTID = new Guid("a90545c0-4ad1-49d5-be20-21f53a21e52b"),
		PID = new Guid("b78f2175-3b7d-4f91-94df-a5de5e339476"),
		Name = "View Personal Escord",
		Description = "view personalescord",
		Code = "OF005",
		IsActive = true
	};



	public static List<mtPrivilegeItem> PrivilegeItemsData = new List<mtPrivilegeItem>
	{
		HC000,
		HC001,
		HC002,
		NT000,
		NT001,
		NT002,
		NT003,
		NT004,
		NT005,
		NT006,
		NT007,
		NT008,
		NT009,
		BS000,
		BS001,
		BS002,
		BS003,
		BS004,
		BS005,
		BS006,
		BS007,
		BS008,
		AS000,
		AS001,
		AS002,
		AS003,
		AS004,
		AS005,
		AS006,
		AS007,
		AS008,
		AS009,
		AS010,
		MR000,
		MR001,
		MR002,
		MR003,
		MR004,
		UU000,
		UU001,
		UU002,
		CP001,
		CP002,
		CP003,
		CP005,
		CP006,
		CP007,
		CP008,
		AC000,
		AC001,
		AC002,
		AC003,
		AC004,
		AC005,
		AC006,
		AC007,
		AC008,
		AC009,
		AC010,
		AC011,
		AC012,
		AC013,
		AC014,
		AC015,
		AC016,
		AC017,
		AC018,
		AC019,
		AC020,
		AC021,
		AC022,
		AC023,
		AC024,
		AC025,
		AC026,
		AC027,
		ST000,
		ST001,
		ST002,
		ST003,
		ST004,
		ST005,
		ST006,
		ST007,
		ST008,
		ST009,
		ST010,
		ST011,
		MC000,
		MC001,
		MC002,
		MC003,
		MC004,
		MC005,
		MC006,
		MC007,
		MC008,
		MC009,
		MC010,
		MC011,
		MC012,
		MC013,
		OF000,
		OF001,
		OF002,
		OF003,
		OF004,
		OF005,
		GT000,
		GT001,
		GT002,
		GT003,
		GT004,
		GT005,
		GT006,
		UM000,
		UM001,
		UM002,
		UM003,
		OP000,
		OP001,
		OP002,
		OP003
	};
}