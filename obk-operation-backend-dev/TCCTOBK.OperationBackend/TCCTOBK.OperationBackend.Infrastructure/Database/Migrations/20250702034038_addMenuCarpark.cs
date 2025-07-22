using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace TCCTOBK.OperationBackend.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class addMenuCarpark : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Location",
                keyColumn: "LID",
                keyValue: new Guid("2c055101-2271-44e0-95fe-bcf2c59a459a"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 7, 2, 10, 40, 38, 149, DateTimeKind.Local).AddTicks(3450), new DateTime(2025, 7, 2, 10, 40, 38, 149, DateTimeKind.Local).AddTicks(3450) });

            migrationBuilder.InsertData(
                table: "mtMenu",
                columns: new[] { "Id", "Breadcrumb", "CSID", "Class", "Disabled", "DisplayOrder", "Header", "IconClass", "IconName", "IsActive", "Label", "PTID", "ParentId", "Separator", "To", "Type", "Url", "Visible" },
                values: new object[,]
                {
                    { new Guid("1072eee8-2707-49e4-8131-83457b8edce8"), null, new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 700, null, null, null, true, "", null, null, false, null, "GROUP", null, true },
                    { new Guid("15156413-ca2d-4b3a-8c1e-e7019ca2ca35"), null, new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 100, null, null, null, true, "", null, null, false, null, "GROUP", null, true },
                    { new Guid("1c8d8a4f-23f3-4c6c-bb10-948c6e14dc09"), null, new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 1000, null, null, null, true, "", null, null, false, null, "GROUP", null, true },
                    { new Guid("31038a00-a731-4e91-b1e1-2de9e9479a56"), null, new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 150, null, null, null, true, "", null, null, false, null, "GROUP", null, true },
                    { new Guid("3d1cf108-2efd-4dcc-bb67-13b054e72a18"), null, new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 200, null, null, null, true, "", null, null, false, null, "GROUP", null, true },
                    { new Guid("441badea-bd50-4bf1-908a-b5ca06235d75"), null, new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 400, null, null, null, true, "", null, null, false, null, "GROUP", null, true },
                    { new Guid("468c162a-ea3f-4aa8-84c0-69c04ce0c883"), null, new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 800, null, null, null, true, "", null, null, false, null, "GROUP", null, true },
                    { new Guid("55a37615-fab7-49d9-a191-40eaf5f308a2"), null, new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 1100, null, null, null, true, "", null, null, false, null, "GROUP", null, true },
                    { new Guid("7f7eb8ad-18aa-49f7-9f0d-5f272cb26cb1"), null, new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 900, null, null, null, true, "", null, null, false, null, "GROUP", null, true },
                    { new Guid("84bf146b-86c5-4b51-8829-226a3dd475c1"), null, new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 300, null, null, null, true, "", null, null, false, null, "GROUP", null, true },
                    { new Guid("8b3c633c-eb6b-4165-b073-f15142089e07"), null, new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 1200, null, null, null, true, "", null, null, false, null, "GROUP", null, true },
                    { new Guid("cc6f542c-7572-4bc0-b1d7-cedf08b37342"), null, new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 800, null, null, null, true, "", null, null, false, null, "GROUP", null, true },
                    { new Guid("cebff353-c600-4ed9-ac4d-e6d6765fc6f0"), null, new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 1205, null, null, null, true, "", null, null, false, null, "GROUP", null, true },
                    { new Guid("d4b81ede-36b6-4561-b59a-a15d874c28cf"), null, new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 500, null, null, null, true, "", null, null, false, null, "GROUP", null, true },
                    { new Guid("dc712dc0-9a6b-4b35-8c42-e2870deb804c"), null, new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 600, null, null, null, true, "", null, null, false, null, "GROUP", null, true },
                    { new Guid("0885f38e-0f44-44fa-90b4-82467b270faa"), null, new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 801, "Car access activities", null, "SvgCar", true, "Car park", new Guid("6319d36b-09cc-4304-842f-a5dac90cb86e"), new Guid("cc6f542c-7572-4bc0-b1d7-cedf08b37342"), false, null, "GROUP", null, true },
                    { new Guid("119e8afe-263c-4219-9d33-67825b221dd5"), null, new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 301, "Notifications", null, "SvgBell", true, "Notifications", new Guid("c7caf3cc-9130-4035-ba54-bb7dd418f1ae"), new Guid("84bf146b-86c5-4b51-8829-226a3dd475c1"), false, null, null, null, true },
                    { new Guid("1c6b105b-cca1-42ec-9fdc-8ca03b1ef978"), null, new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 501, "Building Service", null, "SvgUser", true, "Building Service", new Guid("25461bf1-ac46-4ed5-b6f4-170b7ee70bb5"), new Guid("d4b81ede-36b6-4561-b59a-a15d874c28cf"), false, null, "GROUP", null, true },
                    { new Guid("22743885-cf89-4009-8ca6-01049a2dba36"), null, new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 701, "Members & Roles", null, "SvgRole", true, "Members & Roles", new Guid("ecc622f9-b411-4286-8a50-df2100277210"), new Guid("1072eee8-2707-49e4-8131-83457b8edce8"), false, null, "GROUP", null, true },
                    { new Guid("2ad8b5cc-8189-4be0-ad71-6ae15b23b7e9"), null, new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 601, null, null, "SvgSupport", true, "Support", new Guid("108e481f-c36f-43ef-af5d-eae802d4499b"), new Guid("dc712dc0-9a6b-4b35-8c42-e2870deb804c"), false, null, null, null, true },
                    { new Guid("2c43fd62-d1d1-4100-a04e-7f08b0046809"), null, new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 901, "Art & Culture", null, "SvgPaint", true, "Art & Culture", new Guid("c294084f-fd98-48db-ba61-a4daf84cf44b"), new Guid("7f7eb8ad-18aa-49f7-9f0d-5f272cb26cb1"), false, null, "GROUP", null, true },
                    { new Guid("34481ce3-583e-4ad3-9411-dbe319f7ba3e"), null, new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 152, "Marcom", null, "SvgContent", true, "Marcom", new Guid("fad4a7fc-8076-40c0-93bb-1404558549e0"), new Guid("31038a00-a731-4e91-b1e1-2de9e9479a56"), false, null, null, null, true },
                    { new Guid("70cf0c58-b435-4b3e-91e5-d1b2ccb217ba"), null, new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 1206, "UsageMonitoring", null, "SvgOfficeBlock", true, "UsageMonitoring", new Guid("07fff0ba-3c50-43b8-a269-cef9389b254c"), new Guid("cebff353-c600-4ed9-ac4d-e6d6765fc6f0"), false, null, null, null, true },
                    { new Guid("70cf0c58-b435-4b3e-91e5-d1b2ccb217bf"), null, new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 1201, "Operation app", null, "SvgOfficeBlock", true, "Operation app", new Guid("df4f4b00-86e8-4504-b733-39484060a8f5"), new Guid("8b3c633c-eb6b-4165-b073-f15142089e07"), false, null, null, null, true },
                    { new Guid("9674aef9-f1af-46f5-8457-f920cfdb1600"), null, new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 1101, null, null, "SvgContent", true, "Guard Tour Config", new Guid("f1e42cc1-0072-4bf3-b583-300257693ceb"), new Guid("55a37615-fab7-49d9-a191-40eaf5f308a2"), false, null, null, null, true },
                    { new Guid("994bbf11-10bf-411f-b395-27c3561ade9b"), null, new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 201, "Office", null, "SvgOffice", true, "Office", new Guid("3611e967-5cb7-40c6-aa18-ba5189084d80"), new Guid("3d1cf108-2efd-4dcc-bb67-13b054e72a18"), false, null, null, null, true },
                    { new Guid("b1b3907e-503c-408d-911b-32d7f6450694"), null, new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 101, null, null, "SvgUser", true, "Users", new Guid("187050f0-ff0e-4767-b37e-2755f0de169a"), new Guid("15156413-ca2d-4b3a-8c1e-e7019ca2ca35"), false, null, "GROUP", null, true },
                    { new Guid("eac1e712-1f6c-4b20-bf47-fdb593c69b36"), null, new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 1001, null, null, "SvgSustainability", true, "Sustainability", new Guid("8a2c6484-2f5a-4b84-926a-3b8a5f1a3d12"), new Guid("1c8d8a4f-23f3-4c6c-bb10-948c6e14dc09"), false, null, "EDIT", null, true },
                    { new Guid("ed8b89d9-aa36-4fa2-bc23-5e5cdf8fd85e"), null, new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 801, "My account", null, "SvgUser", true, "My account", null, new Guid("468c162a-ea3f-4aa8-84c0-69c04ce0c883"), false, null, null, null, true },
                    { new Guid("ffb61799-f008-4dee-9645-b6ba162224d2"), null, new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 401, "Building Access", null, "SvgBuilding", true, "Building Access", new Guid("25461bf1-ac46-4ed5-b6f4-170b7ee70bb5"), new Guid("441badea-bd50-4bf1-908a-b5ca06235d75"), false, null, "GROUP", null, true },
                    { new Guid("01706d92-128e-40d5-98a3-e54f1e66b810"), "[\"Operations Onboarding\"]", new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 1202, "Operations Onboarding", null, null, true, "Operations Onboarding", new Guid("739432c3-02f7-4d86-9adf-2dea1e72b713"), new Guid("70cf0c58-b435-4b3e-91e5-d1b2ccb217bf"), false, "/opsapp-register", "LIST", null, true },
                    { new Guid("01706d92-128e-40d5-98a3-e54f1e66b813"), "[\"UsageMonitoring\",\"UsageMonitoring Summary\"]", new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 1207, "UsageMonitoring Summary", null, null, true, "UsageMonitoring Summary", new Guid("cc05a841-80cd-49e2-b342-e16fd72b3d22"), new Guid("70cf0c58-b435-4b3e-91e5-d1b2ccb217ba"), false, "/usagemonitoring", "LIST", null, true },
                    { new Guid("01706d92-128e-40d5-98a3-e54f1e66b814"), "[\"UsageMonitoring\",\"Staff\"]", new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 1208, "Staff", null, null, true, "Staff", new Guid("7a0d5c2d-04dd-40a1-b3ca-240da580da5f"), new Guid("70cf0c58-b435-4b3e-91e5-d1b2ccb217ba"), false, "/usagemonitoring/staff", "LIST", null, true },
                    { new Guid("01706d92-128e-40d5-98a3-e54f1e66b815"), "[\"Usage Monitoring\",\"Roster\"]", new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 1209, "Roster", null, null, true, "Roster", new Guid("f9e1a00c-534a-4644-a9cb-a9ca35940838"), new Guid("70cf0c58-b435-4b3e-91e5-d1b2ccb217ba"), false, "/usagemonitoring/roster", "LIST", null, true },
                    { new Guid("05ab1003-7561-44d9-8721-c1117799e4ef"), "[\"Dashboard\",\"Support\",\"Access Local Information\"]", new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 602, null, null, null, true, "Access Local Information", new Guid("6b87dcbe-ed47-421c-bd0c-f1007f430a5a"), new Guid("2ad8b5cc-8189-4be0-ad71-6ae15b23b7e9"), false, "/support/access-information", null, null, true },
                    { new Guid("0b033360-e296-41e9-a572-b57abd9fa98b"), null, new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 1105, null, null, null, true, "Task Management", new Guid("3148fe4b-2dc5-43c0-a5a1-51b54c29d300"), new Guid("9674aef9-f1af-46f5-8457-f920cfdb1600"), false, "/guardtour/task-management", "LIST", null, true },
                    { new Guid("0ea4b40d-2bce-4e9b-8ec2-13de9e36a228"), null, new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 182, null, null, null, true, "Special Event", new Guid("b8b117ba-18da-4f73-b67f-7db1581a1b30"), new Guid("34481ce3-583e-4ad3-9411-dbe319f7ba3e"), false, "/marcom/event", "LIST", null, true },
                    { new Guid("137ad989-7a8d-4677-a866-480e944ea68a"), null, new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 806, "Retail Parking: Document Type", null, null, true, "Retail Parking: Document Type", new Guid("137ad989-7a8d-4677-a866-480e944ea68a"), new Guid("0885f38e-0f44-44fa-90b4-82467b270faa"), false, "/car-park/document-type", "LIST", null, true },
                    { new Guid("13b65779-5c92-4b76-9d46-41b743a585aa"), "[\"Dashboard\",\"Support\",\"FAQs\"]", new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 603, null, null, null, true, "FAQs", new Guid("6b87dcbe-ed47-421c-bd0c-f1007f430a5a"), new Guid("2ad8b5cc-8189-4be0-ad71-6ae15b23b7e9"), false, "/support/faqs", null, null, true },
                    { new Guid("16383f7a-aed4-4b92-ac83-2d602aa2d508"), "[\"Dashboard\",\"Support\",\"App Maintenance\"]", new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 606, null, null, null, true, "App Maintenance", new Guid("e3776352-3511-4b75-b1f3-1b46c9fb1d57"), new Guid("2ad8b5cc-8189-4be0-ad71-6ae15b23b7e9"), false, "/support/app-maintenance", null, null, true },
                    { new Guid("1881843c-404b-4fc6-a55b-8923fa409a02"), null, new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 1111, null, null, null, true, "Activity Procedures", new Guid("08685195-a06b-42f1-a307-37a51c8aa80f"), new Guid("9674aef9-f1af-46f5-8457-f920cfdb1600"), false, "/guardtour/activityprocedures", "LIST", null, true },
                    { new Guid("1a6d14da-6c8f-4962-a445-ef0e8e0c6524"), null, new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 809, "Self Redemption Detail", null, null, true, "Self Redemption Detail", new Guid("11d5f8ea-5b35-41e0-bc61-97ff9969ed64"), new Guid("0885f38e-0f44-44fa-90b4-82467b270faa"), false, "/car-park/self-redemption-record/show/[id]", "EDIT", null, false },
                    { new Guid("1b6827e0-3272-4cf1-8b6b-4313e0fa6532"), "[\"Building Service\",\"Urgent Service Request\"]", new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 510, "Urgent Service Request", null, null, true, "Urgent Service Request", null, new Guid("1c6b105b-cca1-42ec-9fdc-8ca03b1ef978"), false, "/building/inspectionrequest", "LIST", null, true },
                    { new Guid("20104da5-004f-4fdb-9987-8603cf49959a"), null, new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 102, null, null, null, true, "All Users", new Guid("f92a3d95-a360-455f-a5df-1534e6fec172"), new Guid("b1b3907e-503c-408d-911b-32d7f6450694"), false, "/users/all", "LIST", null, true },
                    { new Guid("245b2e4a-6e4b-4e1b-8dd8-9c46d0438cda"), "[\"Building Service\"]", new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 502, "Service Request", null, null, true, "Service Request", new Guid("cf3a9564-b228-4ca2-858c-66d5c2b35185"), new Guid("1c6b105b-cca1-42ec-9fdc-8ca03b1ef978"), false, "/building/servicerequest", "LIST", null, true },
                    { new Guid("274ca920-c069-4c41-9ee1-dcd499713e3d"), "[\"Members & Roles\"]", new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 705, "Role management", null, null, true, "Role management", new Guid("65d83597-f3db-4037-acbe-24bf8e01672b"), new Guid("22743885-cf89-4009-8ca6-01049a2dba36"), false, "/roles/role", "LIST", null, true },
                    { new Guid("27801834-36e4-4fec-9750-aa4ff498063a"), "[\"Home content\"]", new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 202, "Home content", null, null, true, "Home content", new Guid("5ee02541-2657-41e1-92e2-6f3b31c5057b"), new Guid("994bbf11-10bf-411f-b395-27c3561ade9b"), false, "/home-content/edit-content", null, null, true },
                    { new Guid("293a2e71-278a-4c95-bdd4-a3b9dbd8e13c"), null, new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 306, "Draft(s)", null, null, true, "Draft(s)", new Guid("18f96e4a-d5ed-41c3-b733-ca8f08fca318"), new Guid("119e8afe-263c-4219-9d33-67825b221dd5"), false, "/notifications/draft", "LIST", null, true },
                    { new Guid("29eb488e-e405-416a-a492-b2b433cc2778"), null, new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 1102, null, null, null, true, "Action Management", new Guid("87359e39-78e2-4c5b-b8a4-1f907b2859ec"), new Guid("9674aef9-f1af-46f5-8457-f920cfdb1600"), false, "/guardtour/action-management", "LIST", null, true },
                    { new Guid("2e8b45cb-6288-4744-9231-f92527bfb476"), "[\"Art & Culture\", \"Booking Settings\"]", new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 922, null, null, null, true, "Create Booking Setting", new Guid("d5f9a1c3-d5a0-4231-b04b-e4dfe9033b85"), new Guid("2c43fd62-d1d1-4100-a04e-7f08b0046809"), false, "/art-and-culture/booking/create-setting", "CREATE", null, false },
                    { new Guid("35924bcd-d085-4c3a-8026-37ea2ca82482"), "[\"Legal\",\"Legal Content\"]", new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 607, null, null, null, true, "Legal Content", new Guid("ae4f3bcc-ed43-4abb-a082-a1b2cba6bea3"), new Guid("2ad8b5cc-8189-4be0-ad71-6ae15b23b7e9"), false, "/legal/legal-content", null, null, true },
                    { new Guid("366e47bb-895a-4157-8d2d-d474fcfcbed6"), null, new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 1005, null, null, null, true, "Banner Management", new Guid("92b60d21-5b8f-43a8-9827-6e92c5c3123a"), new Guid("eac1e712-1f6c-4b20-bf47-fdb593c69b36"), false, "/sustainability/banner", "LIST", null, true },
                    { new Guid("3d147124-ac5d-42a1-b1e0-7e3a531bbe8b"), "[\"Art & Culture\"]", new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 906, null, null, null, true, "Program", new Guid("3d147124-ac5d-42a1-b1e0-7e3a531bbe8b"), new Guid("2c43fd62-d1d1-4100-a04e-7f08b0046809"), false, "/art-and-culture/programs", "LIST", null, true },
                    { new Guid("41748bc4-023c-4b1b-adcb-75cdfbdafc27"), "[\"Car park\"]", new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 802, "Car access activities", null, null, true, "Car access activities", new Guid("6319d36b-09cc-4304-842f-a5dac90cb86e"), new Guid("0885f38e-0f44-44fa-90b4-82467b270faa"), false, "/car-park/cars-access-activities", "LIST", null, true },
                    { new Guid("44ee9361-9c44-4435-aece-01204e0374f1"), null, new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 803, "Retail Parking: Store Whitelist", null, null, true, "Retail Parking: Store Whitelist", new Guid("44ee9361-9c44-4435-aece-01204e0374f1"), new Guid("0885f38e-0f44-44fa-90b4-82467b270faa"), false, "/car-park/store-whitelists", "LIST", null, true },
                    { new Guid("4d163844-5319-4a18-ab91-3538c6bbcb29"), "[\"Art & Culture\"]", new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 915, null, null, null, true, "Partners", new Guid("9bdf8ca3-b588-410a-8284-db61ff581256"), new Guid("2c43fd62-d1d1-4100-a04e-7f08b0046809"), false, "/art-and-culture/partners", "LIST", null, true },
                    { new Guid("58aa403f-72d4-41a5-9737-41a686e107bb"), null, new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 1012, null, null, null, true, "Sub Content Management", new Guid("21454bdb-2a44-4b39-8df5-cdb703d33180"), new Guid("eac1e712-1f6c-4b20-bf47-fdb593c69b36"), false, "/sustainability/all/show/:id", "LIST", null, false },
                    { new Guid("599d3c7a-3a17-427a-8641-68db20dc0042"), "[\"Building Access\",\"Visitors\"]", new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 411, "Visitors access", null, null, true, "Visitors access", null, new Guid("ffb61799-f008-4dee-9645-b6ba162224d2"), false, "/buildingaccess/visitors", "LIST", null, true },
                    { new Guid("5ae35f75-2b89-4ae3-bb85-c3e4b85f7627"), null, new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 1009, null, null, null, true, "Content Management", new Guid("f2b67e7c-59f2-4426-812a-678c6d1e3e93"), new Guid("eac1e712-1f6c-4b20-bf47-fdb593c69b36"), false, "/sustainability/all", "LIST", null, true },
                    { new Guid("5b5be629-2886-4c70-8864-ad4fa650df0a"), null, new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 161, null, null, null, true, "Hero Banner", new Guid("a6f07bc9-51d4-4fdd-8215-2aa68383dbfc"), new Guid("34481ce3-583e-4ad3-9411-dbe319f7ba3e"), false, "/marcom/hero", "LIST", null, true },
                    { new Guid("6103a7fc-8362-4daf-9d43-ec8c9b39813e"), null, new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 1002, null, null, null, true, "PR Banner", new Guid("c7b85f14-e7a3-4d8b-9441-77b8d63f4a29"), new Guid("eac1e712-1f6c-4b20-bf47-fdb593c69b36"), false, "/sustainability/prbanner", "LIST", null, true },
                    { new Guid("62ff1523-5536-4baa-87b0-9d702d65ce48"), "[\"Office\"]", new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 213, "Personal Escort", null, null, true, "Personal Escort", new Guid("a90545c0-4ad1-49d5-be20-21f53a21e52b"), new Guid("994bbf11-10bf-411f-b395-27c3561ade9b"), false, "/personal-escort", "LIST", null, true },
                    { new Guid("65de772d-7c34-4855-83c3-2b29786ed9ba"), "[\"Art & Culture\", \"Booking History\"]", new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 924, null, null, null, true, "Booking History", new Guid("c416a919-c795-42f9-a733-a84e63a6b8c4"), new Guid("2c43fd62-d1d1-4100-a04e-7f08b0046809"), false, "/art-and-culture/booking/show-history", "LIST", null, false },
                    { new Guid("6fa909d3-7419-4dc0-a7bf-0292c9527a01"), null, new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 804, "Retail Parking: Mall Property", null, null, true, "Retail Parking: Mall Property", new Guid("6fa909d3-7419-4dc0-a7bf-0292c9527a01"), new Guid("0885f38e-0f44-44fa-90b4-82467b270faa"), false, "/car-park/property", "LIST", null, true },
                    { new Guid("74a9aaf6-32d6-431f-a1e7-68d041dc1f1f"), "[\"Office\"]", new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 203, "What's Happening", null, null, true, "What's Happening", new Guid("f231f8e0-5f4f-41bd-9826-91718cef9fe7"), new Guid("994bbf11-10bf-411f-b395-27c3561ade9b"), false, "/what-happening", "LIST", null, true },
                    { new Guid("75eaf43e-b878-4d95-b668-d6b419100f8f"), "[\"Building Service\"]", new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 508, "Issue type", null, null, true, "Issue type", new Guid("86f4b1ab-c705-4893-a6e7-0c86e287c89b"), new Guid("1c6b105b-cca1-42ec-9fdc-8ca03b1ef978"), false, "/building/issuetype", "LIST", null, true },
                    { new Guid("85dbfe62-ca8c-472c-a33c-3f2dd43fe3d9"), "[\"Office\"]", new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 209, "Directory Contact", null, null, true, "Directory Contact", new Guid("8f4a9416-e067-4834-a613-dd882b0693dc"), new Guid("994bbf11-10bf-411f-b395-27c3561ade9b"), false, "/directory-contact", "LIST", null, true },
                    { new Guid("88874de1-34c6-40b5-895b-b8c68e0455bb"), null, new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 311, "Categories", null, null, true, "Categories", new Guid("e70e6e8f-3267-4e53-a5af-797e9d96ccce"), new Guid("119e8afe-263c-4219-9d33-67825b221dd5"), false, "/notifications/categories", "LIST", null, true },
                    { new Guid("8911cdf9-71ec-49aa-ad3b-716c966a54df"), "[\"Dashboard\",\"Support\",\"App Version\"]", new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 605, null, null, null, true, "App Version", new Guid("55c4ada7-e1cf-43e2-8770-5102c03f8a8e"), new Guid("2ad8b5cc-8189-4be0-ad71-6ae15b23b7e9"), false, "/support/app-version", null, null, true },
                    { new Guid("92fc160b-46ce-4c83-82c0-e047cd886eda"), null, new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 1108, null, null, null, true, "Schedule Plan", new Guid("db9bc3e3-dd23-4b75-bfe0-bae28f165fc9"), new Guid("9674aef9-f1af-46f5-8457-f920cfdb1600"), false, "/guardtour/scheduleplan", "LIST", null, true },
                    { new Guid("9715e820-19ca-48fc-b4a4-5e5c6d193bc1"), null, new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 307, "Templates", null, null, true, "Templates", new Guid("560af02b-45da-428c-8aa8-aaf4b6201048"), new Guid("119e8afe-263c-4219-9d33-67825b221dd5"), false, "/notifications/template", "LIST", null, true },
                    { new Guid("9a2da925-5c65-4d18-a60d-371d8f712b9d"), "[\"Art & Culture\", \"Ticket Scanner\"]", new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 927, null, null, null, true, "Ticket Scanner", new Guid("812edf62-3850-46e4-bef5-840cb2823816"), new Guid("2c43fd62-d1d1-4100-a04e-7f08b0046809"), false, "/art-and-culture/booking/ticket-scanner", "EDIT", null, true },
                    { new Guid("a1558dca-7677-4749-a2f4-71d79779b3ab"), "[\"Building Access\",\"Tenant\"]", new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 410, "Tenant access", null, null, true, "Tenant access", null, new Guid("ffb61799-f008-4dee-9645-b6ba162224d2"), false, "/buildingaccess/tenant", "LIST", null, true },
                    { new Guid("a3cec3e0-5e22-48d4-b149-bd6a50d6ce58"), "[\"Art & Culture\", \"Booking Settings\"]", new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 923, null, null, null, true, "Edit Booking Setting", new Guid("44c968b5-3570-4167-8837-1e34c0018f29"), new Guid("2c43fd62-d1d1-4100-a04e-7f08b0046809"), false, "/art-and-culture/booking/edit-setting", "EDIT", null, false },
                    { new Guid("a74ad063-a576-4834-bf3b-f7fba194dd81"), "[\"Art & Culture\"]", new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 918, null, null, null, true, "Faqs", new Guid("28a8193f-a616-48ca-ac04-b421da2111d1"), new Guid("2c43fd62-d1d1-4100-a04e-7f08b0046809"), false, "/art-and-culture/faqs", "LIST", null, true },
                    { new Guid("a7e4303b-40bc-492b-8cfd-951db9403628"), "[\"Art & Culture\", \"Booking Status\"]", new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 925, null, null, null, true, "Booking Status", new Guid("9b3ab157-e0b3-4bdb-9aba-1ad99a23a059"), new Guid("2c43fd62-d1d1-4100-a04e-7f08b0046809"), false, "/art-and-culture/booking/manage-status", "LIST", null, true },
                    { new Guid("b35991e9-961c-4b99-9a93-253d1b37b2eb"), null, new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 807, "Retail Parking: Campaign", null, null, true, "Retail Parking: Campaign", new Guid("b35991e9-961c-4b99-9a93-253d1b37b2eb"), new Guid("0885f38e-0f44-44fa-90b4-82467b270faa"), false, "/car-park/campaign-management", "LIST", null, true },
                    { new Guid("c0a62684-d85a-4b8a-bbb7-8d7d55b3c049"), null, new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 171, null, null, null, true, "What's Happening", new Guid("05a8f11e-d1ed-4eb5-8430-4907967eb301"), new Guid("34481ce3-583e-4ad3-9411-dbe319f7ba3e"), false, "/marcom/happening", "LIST", null, true },
                    { new Guid("c3038f9f-7742-4b1e-9287-f540e208b586"), "[\"Notifications\"]", new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 302, "In-apps notifications", null, null, true, "In-apps notifications", new Guid("499b184b-a44b-4d0c-953a-9204c4c07ddd"), new Guid("119e8afe-263c-4219-9d33-67825b221dd5"), false, "/notifications/inapp", null, null, true },
                    { new Guid("d234f890-4b27-45d8-9fa7-9c8b014b5f4b"), null, new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 182, null, null, null, true, "Explore One Bangkok", new Guid("456dcf29-047e-4482-9f91-74ddf7b10594"), new Guid("34481ce3-583e-4ad3-9411-dbe319f7ba3e"), false, "/marcom/explore", "LIST", null, true },
                    { new Guid("d3a532d7-c625-4d48-8699-e8b6f915da71"), null, new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 802, "Personal information", null, null, true, "Personal Information", null, new Guid("ed8b89d9-aa36-4fa2-bc23-5e5cdf8fd85e"), false, "/account/personal-information", null, null, true },
                    { new Guid("d3e796c4-54db-4cad-9d15-ebc3d7759dcf"), null, new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 1006, null, null, null, true, "Digital Library", new Guid("a4b2394f-2c7a-4b34-b80e-2d1b6a9f1a3c"), new Guid("eac1e712-1f6c-4b20-bf47-fdb593c69b36"), false, "/sustainability/library", "LIST", null, true },
                    { new Guid("d65f958d-a3ab-45f9-9b34-99c362376eb5"), "[\"Home content\"]", new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 207, "Home content", null, null, true, "Version history", new Guid("5c3de96d-3d67-4d4c-9c1b-1c9d5f191283"), new Guid("994bbf11-10bf-411f-b395-27c3561ade9b"), false, "/home-content/version-history", null, null, true },
                    { new Guid("d8f12f83-60d0-4d81-ab79-39edd94cad82"), "[\"Art & Culture\"]", new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 902, null, null, null, true, "Landing Page", new Guid("96ba4acf-1c97-4220-b2ef-6eb655a30a38"), new Guid("2c43fd62-d1d1-4100-a04e-7f08b0046809"), false, "/art-and-culture/landing", "LIST", null, true },
                    { new Guid("d9c64711-9d19-4fc0-bb4a-75129dd552bd"), null, new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 808, "Self Redemption Record", null, null, true, "Self Redemption Record", new Guid("d9c64711-9d19-4fc0-bb4a-75129dd552bd"), new Guid("0885f38e-0f44-44fa-90b4-82467b270faa"), false, "/car-park/self-redemption-record", "LIST", null, true },
                    { new Guid("e63e87c3-9ab2-4d21-9b0b-435ce7ca3206"), "[\"Art & Culture\"]", new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 909, null, null, null, true, "Add-On", new Guid("e63e87c3-9ab2-4d21-9b0b-435ce7ca3206"), new Guid("2c43fd62-d1d1-4100-a04e-7f08b0046809"), false, "/art-and-culture/add-on", "LIST", null, true },
                    { new Guid("ed1aae97-4614-4a27-822d-d3d0dec4d26a"), "[\"Building Service\",\"After-hour Air Condition Requests\"]", new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 504, "After-hour Air Condition Requests", null, null, true, "AC Request", new Guid("575e3781-e3e9-4b98-b1cf-8f347b2cf065"), new Guid("1c6b105b-cca1-42ec-9fdc-8ca03b1ef978"), false, "/building/acrequest", "LIST", null, true },
                    { new Guid("efe3a53a-92a7-452e-a541-793782a805c2"), "[\"Art & Culture\"]", new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 903, null, null, null, true, "Art & Culture Category", new Guid("fec95e97-8767-4139-909b-2cc52c800501"), new Guid("2c43fd62-d1d1-4100-a04e-7f08b0046809"), false, "/art-and-culture/art-c", "LIST", null, true },
                    { new Guid("f2291ac0-0469-488a-9f9c-d5596dd1ed7f"), "[\"Dashboard\",\"Support\",\"ContactCenter\"]", new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 604, null, null, null, true, "Contact Center", new Guid("5647c352-0c08-4982-806e-b764ff061ba4"), new Guid("2ad8b5cc-8189-4be0-ad71-6ae15b23b7e9"), false, "/support/contact-center", null, null, true },
                    { new Guid("f9720e30-bc8f-49aa-a31a-d51ef69422a3"), "[\"Members & Roles\"]", new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 702, "Member management", null, null, true, "Member management", new Guid("a04722d6-0fc2-4144-b77a-2a67e838f2f1"), new Guid("22743885-cf89-4009-8ca6-01049a2dba36"), false, "/roles/member", "LIST", null, true },
                    { new Guid("ffd40f99-f1c4-4e6e-b2b8-5cd9d6c6fccc"), "[\"Art & Culture\"]", new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 912, null, null, null, true, "Playlist", new Guid("ffd40f99-f1c4-4e6e-b2b8-5cd9d6c6fccc"), new Guid("2c43fd62-d1d1-4100-a04e-7f08b0046809"), false, "/art-and-culture/playlist", "LIST", null, true },
                    { new Guid("01706d92-128e-40d5-98a3-e54f1e66b816"), "[\"Usage Monitoring\",\"UsageMonitoring Summary\",\"Staff By Componant\"]", new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 1210, "Staff By Componant", null, null, true, "staff-by-compopnant", new Guid("f9e1a00c-534a-4644-a9cb-a9ca35940838"), new Guid("01706d92-128e-40d5-98a3-e54f1e66b813"), false, "/usagemonitoring/staff-by-componant", null, null, false },
                    { new Guid("01706d92-128e-40d5-98a3-e54f1e66b817"), "[\"Usage Monitoring\",\"Usage Monitoring Summary\",\"All Staff\"]", new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 1211, "All Staff", null, null, true, "all-staff", new Guid("f9e1a00c-534a-4644-a9cb-a9ca35940838"), new Guid("01706d92-128e-40d5-98a3-e54f1e66b813"), false, "/usagemonitoring/component", null, null, false },
                    { new Guid("054dac0c-1636-40f3-9120-4996b5c7c65e"), null, new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 185, null, null, null, true, "Edit Explore One Bangkok", new Guid("9a4eeb91-3a8e-4a8a-80e7-bdc9ac36a88a"), new Guid("d234f890-4b27-45d8-9fa7-9c8b014b5f4b"), false, "/marcom/explore/edit/:id", "EDIT", null, false },
                    { new Guid("115a8009-9e01-411e-8894-0f8e511924a0"), null, new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 1110, null, null, null, true, "Schedule Plan", new Guid("db9bc3e3-dd23-4b75-bfe0-bae28f165fc9"), new Guid("92fc160b-46ce-4c83-82c0-e047cd886eda"), false, "/guardtour/scheduleplan/edit/:id", "EDIT", null, false },
                    { new Guid("15aaa462-e484-4ca4-b355-5b5440f5eef8"), "[\"Art & Culture\", \"Art+C\"]", new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 905, null, null, null, true, "Edit Art & Culture Category", new Guid("6eb76e1a-b5ba-4a4d-971b-c753c9ee0dd2"), new Guid("efe3a53a-92a7-452e-a541-793782a805c2"), false, "/art-and-culture/art-c/edit/:id", "EDIT", null, false },
                    { new Guid("169891fe-97c7-4181-83e2-1f2045f66f14"), null, new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 1010, null, null, null, true, "Create Content Management", new Guid("b5a7a499-1c12-4c99-9b4a-d5bc882d4bda"), new Guid("5ae35f75-2b89-4ae3-bb85-c3e4b85f7627"), false, "/sustainability/all/create", "CREATE", null, false },
                    { new Guid("1a920071-d382-4a87-9626-7ca1c78ead44"), null, new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 311, "Edit Announcement template", null, null, true, "Edit Announcement template", new Guid("c545119b-7587-4a16-a71d-ad6c189a9106"), new Guid("9715e820-19ca-48fc-b4a4-5e5c6d193bc1"), false, "/notifications/template/edit-announcement/:id", "EDIT", null, false },
                    { new Guid("1b6827e0-3272-4cf1-8b6b-4313e0fa6632"), "[\"Building Service\",\"Issue type\"]", new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 509, "Issue type", null, null, true, "Issue type", null, new Guid("75eaf43e-b878-4d95-b668-d6b419100f8f"), false, "/building/servicerequest/edit/:id", "EDIT", null, false },
                    { new Guid("1dd4cd55-7ac5-46cf-ad6b-461b32254abb"), "[\"Building Service\",\"After-hour Air Condition Requests\"]", new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 505, "After-hour Air Condition Requests", null, null, true, "AC Request", new Guid("575e3781-e3e9-4b98-b1cf-8f347b2cf065"), new Guid("ed1aae97-4614-4a27-822d-d3d0dec4d26a"), false, "/building/acrequest/show/:id", "SHOW", null, false },
                    { new Guid("1e62d86d-129a-45c4-bb42-d3a0d0fddc96"), "[\"Building Service\",\"After-hour Air Condition Requests\"]", new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 506, "After-hour Air Condition Requests", null, null, true, "AC Request", null, new Guid("ed1aae97-4614-4a27-822d-d3d0dec4d26a"), false, "/building/acrequest/create", "CREATE", null, false },
                    { new Guid("234a02c1-b447-4e41-aa6f-64ce26e1d77c"), "[\"Notification\",\"Edit category\"]", new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 315, "Edit category", null, null, true, "Edit category", new Guid("4d7b12d5-0a19-48d2-b524-669ca35acedc"), new Guid("88874de1-34c6-40b5-895b-b8c68e0455bb"), false, "/notifications/categories/edit/:id", "EDIT", null, false },
                    { new Guid("25136f0a-b0b1-4b56-a8e7-0cccefa8025b"), null, new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 304, "Create new Announcement", null, null, true, "In-apps notifications", new Guid("9bfe9f97-205d-4a4d-8b7b-c0a75e3485dd"), new Guid("c3038f9f-7742-4b1e-9287-f540e208b586"), false, "/notifications/inapp/create-announcement/duplicate/:id", "CREATE", null, false },
                    { new Guid("291f47ff-2783-48cc-a7e1-6242bcb26d2a"), "[\"Art & Culture\"]", new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 921, null, null, null, true, "Order Faqs", new Guid("32efd3a8-0955-49e4-ad41-2dbeef20e757"), new Guid("a74ad063-a576-4834-bf3b-f7fba194dd81"), false, "/art-and-culture/faqs/order", "EDIT", null, false },
                    { new Guid("292462da-4d95-4189-94f0-8414fc42d303"), null, new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 172, null, null, null, true, "Create What's Happening", new Guid("3a11067d-c22f-40d6-b2c9-8ba1e00e0cce"), new Guid("c0a62684-d85a-4b8a-bbb7-8d7d55b3c049"), false, "/marcom/happening/create", "CREATE", null, false },
                    { new Guid("2e48799b-9b5c-482e-8edb-37d419f16793"), null, new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 1113, null, null, null, true, "Activity Procedures", new Guid("08685195-a06b-42f1-a307-37a51c8aa80f"), new Guid("1881843c-404b-4fc6-a55b-8923fa409a02"), false, "/guardtour/activityprocedures/edit/:id", "EDIT", null, false },
                    { new Guid("345719dc-c6df-4d65-8a82-752273b9864b"), "[\"Art & Culture\", \"Program\"]", new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 907, null, null, null, true, "Create Program", new Guid("345719dc-c6df-4d65-8a82-752273b9864b"), new Guid("3d147124-ac5d-42a1-b1e0-7e3a531bbe8b"), false, "/art-and-culture/programs/create", "CREATE", null, false },
                    { new Guid("3fab705d-2e74-47d3-8f20-70378dcb1f38"), "[\"Art & Culture\", \"Reset Ticket\"]", new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 928, null, null, null, true, "Reset Ticket", new Guid("780e0999-85b0-4b54-b433-918c8ef0298a"), new Guid("9a2da925-5c65-4d18-a60d-371d8f712b9d"), false, "/art-and-culture/booking/reset-ticket/:id", "EDIT", null, false },
                    { new Guid("40f7997c-a807-4dd5-9207-5a37d5894175"), null, new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 304, "Create new Announcement", null, null, true, "In-apps notifications", new Guid("9bfe9f97-205d-4a4d-8b7b-c0a75e3485dd"), new Guid("c3038f9f-7742-4b1e-9287-f540e208b586"), false, "/notifications/inapp/create-announcement", "CREATE", null, false },
                    { new Guid("41587cf4-5588-46c7-bd79-5f04bc337b80"), "[\"Office\"]", new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 206, "Emergency Contact", null, null, true, "Emergency Contact", new Guid("f231f8e0-5f4f-41bd-9826-91718cef9fe7"), new Guid("74a9aaf6-32d6-431f-a1e7-68d041dc1f1f"), false, "/emergency-contact", "SHOW", null, false },
                    { new Guid("4411d520-34ac-4f32-9275-5158b3d14d3f"), "[\"Art & Culture\", \"Add-On\"]", new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 911, null, null, null, true, "Edit Add-On", new Guid("4411d520-34ac-4f32-9275-5158b3d14d3f"), new Guid("e63e87c3-9ab2-4d21-9b0b-435ce7ca3206"), false, "/art-and-culture/add-on/edit/:id", "EDIT", null, false },
                    { new Guid("482f7f4d-aac8-4ef2-90a3-c7178852499f"), "[\"Art & Culture\", \"Art+C\"]", new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 904, null, null, null, true, "Create Art & Culture Category", new Guid("482f7f4d-aac8-4ef2-90a3-c7178852499f"), new Guid("efe3a53a-92a7-452e-a541-793782a805c2"), false, "/art-and-culture/art-c/create", "CREATE", null, false },
                    { new Guid("4eeaf585-c62c-4e44-8e49-0f58daa6b6d1"), null, new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 184, null, null, null, true, "Special Event", new Guid("ddfd5827-7610-401f-891f-0fee217f811d"), new Guid("0ea4b40d-2bce-4e9b-8ec2-13de9e36a228"), false, "/marcom/event/create", "CREATE", null, false },
                    { new Guid("54f6ea7d-cc01-45a2-a68e-48d22dfdf01d"), null, new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 185, null, null, null, true, "Special Event", new Guid("4ed288f3-11d9-4181-86ae-5684d4c9ebbd"), new Guid("0ea4b40d-2bce-4e9b-8ec2-13de9e36a228"), false, "/marcom/event/edit/:id", "EDIT", null, false },
                    { new Guid("5622623f-e8b2-4d5f-9d8d-0e9413ada6d4"), "[\"Art & Culture\", \"Booking Status\"]", new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 926, null, null, null, true, "Edit Booking Status", new Guid("4dcc5462-ef19-4569-8231-faf1725c1f99"), new Guid("a7e4303b-40bc-492b-8cfd-951db9403628"), false, "/art-and-culture/booking/manage-status/:id", "EDIT", null, false },
                    { new Guid("56f8419c-e36e-4dc9-8ac9-25261174f50b"), null, new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 174, null, null, null, true, "Article What's Happening", new Guid("0e82ceb7-6c37-44a3-83a7-ba700be6e5d9"), new Guid("c0a62684-d85a-4b8a-bbb7-8d7d55b3c049"), false, "/marcom/happening/show/:id", "SHOW", null, false },
                    { new Guid("5b0a2540-56d0-416d-a346-cca2ca96f828"), null, new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 1007, null, null, null, true, "Create Digital Library", new Guid("e4972901-3f9c-4b38-aafb-234d43c9d6fc"), new Guid("d3e796c4-54db-4cad-9d15-ebc3d7759dcf"), false, "/sustainability/library/create", "CREATE", null, false },
                    { new Guid("5c7b655b-0d9d-4676-83a4-a3fc160bd078"), "[\"Building Service\",\"Service Request\"]", new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 503, "Service Request", null, null, true, "Service Request", new Guid("cf3a9564-b228-4ca2-858c-66d5c2b35185"), new Guid("245b2e4a-6e4b-4e1b-8dd8-9c46d0438cda"), false, "/building/servicerequest/show/:id", "SHOW", null, false },
                    { new Guid("6089cedc-519e-40c8-a5d0-cf868307e0e7"), null, new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 1106, null, null, null, true, "Task Management", new Guid("3148fe4b-2dc5-43c0-a5a1-51b54c29d300"), new Guid("0b033360-e296-41e9-a572-b57abd9fa98b"), false, "/guardtour/task-management/create", "CREATE", null, false },
                    { new Guid("67221236-b4fb-407d-9fa5-79609e835858"), null, new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 1103, null, null, null, true, "Action Management", new Guid("87359e39-78e2-4c5b-b8a4-1f907b2859ec"), new Guid("29eb488e-e405-416a-a492-b2b433cc2778"), false, "/guardtour/action-management/create", "CREATE", null, false },
                    { new Guid("67b4b518-80f7-449c-9f17-51e989f5ab90"), "[\"Operations Onboarding\"]", new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 1203, "Operations Onboarding", null, null, true, "Operations Onboarding", new Guid("a151df3a-aa4b-4489-a879-7be2f80e0e40"), new Guid("01706d92-128e-40d5-98a3-e54f1e66b810"), false, "/opsapp-register/create", null, null, false },
                    { new Guid("699415f6-01a2-4556-9734-2e918c2748d7"), "[\"Members & Roles\",\"Member management\"]", new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 704, "Edit Member", null, null, true, "Edit Member", new Guid("d34c2f62-b729-47fa-a1a9-19a6acbb52cb"), new Guid("f9720e30-bc8f-49aa-a31a-d51ef69422a3"), false, "/roles/member/edit/:id", "EDIT", null, false },
                    { new Guid("6e0777ec-4958-402b-a374-b8e604fa8da7"), "[\"Members & Roles\",\"Role management\"]", new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 707, "Edit role privileges", null, null, true, "Edit role privileges", new Guid("9ff4e790-dfdb-401c-b450-0e3cc6fa008f"), new Guid("274ca920-c069-4c41-9ee1-dcd499713e3d"), false, "/roles/role/edit/:id", "EDIT", null, false },
                    { new Guid("6f9dcead-e770-476a-943f-c4606b3f36a8"), "[\"Notification\",\"Create new category\"]", new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 314, "Create new category", null, null, true, "Create new category", new Guid("4d7b12d5-0a19-48d2-b524-669ca35acedc"), new Guid("88874de1-34c6-40b5-895b-b8c68e0455bb"), false, "/notifications/categories/create", "CREATE", null, false },
                    { new Guid("72178f6f-99b2-4a32-9e45-a296dcdb025e"), null, new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 304, "Create new announcement", null, null, true, "In-apps notifications", new Guid("9bfe9f97-205d-4a4d-8b7b-c0a75e3485dd"), new Guid("c3038f9f-7742-4b1e-9287-f540e208b586"), false, "/notifications/inapp/create-announcement/template/:id", "CREATE", null, false },
                    { new Guid("77bb48c9-5609-436b-a574-cb71ba288e2a"), null, new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 1104, null, null, null, true, "Action Management", new Guid("87359e39-78e2-4c5b-b8a4-1f907b2859ec"), new Guid("29eb488e-e405-416a-a492-b2b433cc2778"), false, "/guardtour/action-management/edit/:id", "EDIT", null, false },
                    { new Guid("7bfa25e4-7d0f-4fa2-81f4-d464e0888cae"), "[\"Art & Culture\", \"Program\"]", new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 908, null, null, null, true, "Edit Program", new Guid("7bfa25e4-7d0f-4fa2-81f4-d464e0888cae"), new Guid("3d147124-ac5d-42a1-b1e0-7e3a531bbe8b"), false, "/art-and-culture/programs/edit/:id", "EDIT", null, false },
                    { new Guid("7cc7ea3f-b216-40af-973f-58734ea4b5ea"), "[\"Building Service\",\"After-hour Air Condition Requests\"]", new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 507, "After-hour Air Condition Requests", null, null, true, "AC Request", null, new Guid("ed1aae97-4614-4a27-822d-d3d0dec4d26a"), false, "/building/acrequest/edit/:id", "EDIT", null, false },
                    { new Guid("7f03b134-cc4a-475b-84f3-a3ebc6521103"), null, new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 184, null, null, null, true, "Create Explore One Bangkok", new Guid("a02b32ea-8db3-4e71-9b97-6dd1fb8828b8"), new Guid("d234f890-4b27-45d8-9fa7-9c8b014b5f4b"), false, "/marcom/explore/create", "CREATE", null, false },
                    { new Guid("8ad532c7-1cdd-4f35-8a40-4a13cf0bb60c"), "[\"Home content\"]", new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 208, "History Log", null, null, true, "Version history", new Guid("5c3de96d-3d67-4d4c-9c1b-1c9d5f191283"), new Guid("d65f958d-a3ab-45f9-9b34-99c362376eb5"), false, "/home-content/version-history/show/:id", "SHOW", null, false },
                    { new Guid("8dac7d2f-4761-4e57-8b13-5d9b6cab52ec"), null, new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 1112, null, null, null, true, "Activity Procedures", new Guid("08685195-a06b-42f1-a307-37a51c8aa80f"), new Guid("1881843c-404b-4fc6-a55b-8923fa409a02"), false, "/guardtour/activityprocedures/create", "CREATE", null, false },
                    { new Guid("8e3379a0-fa55-48a0-a873-19726a50f003"), "[\"Art & Culture\", \"Partners\"]", new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 917, null, null, null, true, "Edit Partners", new Guid("6a3e6352-94e5-4f6b-b165-0959e00a4dec"), new Guid("4d163844-5319-4a18-ab91-3538c6bbcb29"), false, "/art-and-culture/partners/edit/:id", "EDIT", null, false },
                    { new Guid("95c3bef9-94aa-40e7-858b-c0d1a4e26b48"), null, new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 163, null, null, null, true, "Edit Hero Banner", new Guid("65d83597-f3db-4037-acbe-24bf8e01672b"), new Guid("5b5be629-2886-4c70-8864-ad4fa650df0a"), false, "/marcom/hero/edit/:id", "EDIT", null, false },
                    { new Guid("9b49ddba-1b9d-445b-a2c9-168dd1903dde"), "[\"Notification\",\"Category\"]", new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 313, "Categories", null, null, true, "Categories", new Guid("e70e6e8f-3267-4e53-a5af-797e9d96ccce"), new Guid("88874de1-34c6-40b5-895b-b8c68e0455bb"), false, "/notifications/categories/show/:id", "SHOW", null, false },
                    { new Guid("9c16bb6a-2798-4da7-916d-ef91a917dcd1"), null, new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 311, "In-apps edit template notifications", null, null, true, "In-apps edit template notifications", new Guid("c545119b-7587-4a16-a71d-ad6c189a9106"), new Guid("9715e820-19ca-48fc-b4a4-5e5c6d193bc1"), false, "/notifications/template/edit/:id", "EDIT", null, false },
                    { new Guid("9debbc29-17a3-4753-9edd-edda1292a340"), null, new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 310, "Create new announcement template", null, null, true, "Create new announcement template", null, new Guid("9715e820-19ca-48fc-b4a4-5e5c6d193bc1"), false, "/notifications/template/create-announcement/campaign/:id", "LIST", null, false },
                    { new Guid("9f66e2a4-fe19-42a9-a98f-65b2ebce2856"), "[\"Art & Culture\", \"Faqs\"]", new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 919, null, null, null, true, "Create Faqs", new Guid("37ea6ba3-8622-4884-be61-d665ded8c6ae"), new Guid("a74ad063-a576-4834-bf3b-f7fba194dd81"), false, "/art-and-culture/faqs/create", "CREATE", null, false },
                    { new Guid("b1411131-4f55-4d9d-8910-3daf76c26dc1"), null, new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 309, "Create new in-apps notification template", null, null, true, "Create new in-apps notification template", new Guid("c545119b-7587-4a16-a71d-ad6c189a9106"), new Guid("9715e820-19ca-48fc-b4a4-5e5c6d193bc1"), false, "/notifications/template/create-inapp", "CREATE", null, false },
                    { new Guid("b15a2f26-0cc2-44a8-9fea-52a43a20ca29"), null, new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 305, "Edit announcement", null, null, true, "Edit announcement", null, new Guid("c3038f9f-7742-4b1e-9287-f540e208b586"), false, "/notifications/inapp/edit-announcement/:id", "EDIT", null, false },
                    { new Guid("b28c71e1-ac54-4706-8b9e-e435139a8ea3"), "[\"Art & Culture\", \"Add-On\"]", new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 910, null, null, null, true, "Create Add-On", new Guid("b28c71e1-ac54-4706-8b9e-e435139a8ea3"), new Guid("e63e87c3-9ab2-4d21-9b0b-435ce7ca3206"), false, "/art-and-culture/add-on/create", "CREATE", null, false },
                    { new Guid("b38bd9d0-d315-4bfd-b8c1-c23f38265587"), null, new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 1003, null, null, null, true, "Create PR Banner", new Guid("2d1a20dd-df64-4e57-a3ba-5e731534d461"), new Guid("6103a7fc-8362-4daf-9d43-ec8c9b39813e"), false, "/sustainability/prbanner/create", "CREATE", null, false },
                    { new Guid("be549187-a15c-4951-a983-a37a64c195b3"), null, new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 1004, null, null, null, true, "Edit PR Banner", new Guid("efa8cbe7-4d54-4bfb-986f-4b7c3c6e7d29"), new Guid("6103a7fc-8362-4daf-9d43-ec8c9b39813e"), false, "/sustainability/prbanner/edit/:id", "EDIT", null, false },
                    { new Guid("bfef882e-682b-4753-b9f3-c7ec3f3acb46"), null, new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 173, null, null, null, true, "Edit What's Happening", new Guid("a037a451-0db5-4832-9fae-9111c89d1cfc"), new Guid("c0a62684-d85a-4b8a-bbb7-8d7d55b3c049"), false, "/marcom/happening/edit/:id", "EDIT", null, false },
                    { new Guid("c078d178-96f5-4aee-b6b9-a64d339ee6aa"), "[\"Office\"]", new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 212, "Directory Contact", null, null, true, "Directory Contact", new Guid("8f4a9416-e067-4834-a613-dd882b0693dc"), new Guid("85dbfe62-ca8c-472c-a33c-3f2dd43fe3d9"), false, "/directory-contact/edit/:id", "EDIT", null, false },
                    { new Guid("c6328155-2278-4e0c-8765-f6e6ca951055"), "[\"Notifications\",\"In-apps notifications\"]", new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 303, "View in-app notification", null, null, true, "In-apps notifications", new Guid("499b184b-a44b-4d0c-953a-9204c4c07ddd"), new Guid("c3038f9f-7742-4b1e-9287-f540e208b586"), false, "/notifications/inapp/show/:id", "SHOW", null, false },
                    { new Guid("c70c8ed6-9ba2-4fca-a1dc-88dea997f280"), null, new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 1107, null, null, null, true, "Task Management", new Guid("3148fe4b-2dc5-43c0-a5a1-51b54c29d300"), new Guid("0b033360-e296-41e9-a572-b57abd9fa98b"), false, "/guardtour/task-management/edit/:id", "EDIT", null, false },
                    { new Guid("c965d9bd-6f96-4fa6-9422-3b4c6d0930d8"), null, new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 309, "Create new in-apps notification template", null, null, true, "Create new in-apps notification template", new Guid("c545119b-7587-4a16-a71d-ad6c189a9106"), new Guid("9715e820-19ca-48fc-b4a4-5e5c6d193bc1"), false, "/notifications/template/create-inapp/campaign/:id", "CREATE", null, false },
                    { new Guid("cb77ab47-4d4f-453a-91e1-a42fb2d9a20e"), "[\"Art & Culture\", \"Partners\"]", new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 916, null, null, null, true, "Create Partners", new Guid("5018e9ef-80e7-480a-9afc-c0234b7dc776"), new Guid("4d163844-5319-4a18-ab91-3538c6bbcb29"), false, "/art-and-culture/partners/create", "CREATE", null, false },
                    { new Guid("cd06d2c3-a8e1-4c10-b70e-8bb7348a1d7f"), "[\"Office\"]", new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 205, "Emergency Contact", null, null, true, "Emergency Contact", new Guid("a90545c0-4ad1-49d5-be20-21f53a21e52b"), new Guid("74a9aaf6-32d6-431f-a1e7-68d041dc1f1f"), false, "/emergency-contact", "EDIT", null, false },
                    { new Guid("cecdbe9e-639f-40cc-abd1-7fa588904d2e"), null, new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 304, "Create new in-app notification", null, null, true, "In-apps notifications", new Guid("9bfe9f97-205d-4a4d-8b7b-c0a75e3485dd"), new Guid("c3038f9f-7742-4b1e-9287-f540e208b586"), false, "/notifications/inapp/create-inapp/template/:id", "CREATE", null, false },
                    { new Guid("d0fbe2f6-2973-4cba-91a1-680dd86d72bc"), "[\"Members & Roles\",\"Member management\"]", new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 703, "Invite member", null, null, true, "Invite Member", new Guid("d34c2f62-b729-47fa-a1a9-19a6acbb52cb"), new Guid("f9720e30-bc8f-49aa-a31a-d51ef69422a3"), false, "/roles/member/create", "CREATE", null, false },
                    { new Guid("d4f29776-3f01-4dde-8c47-3f06735fe01b"), "[\"Members & Roles\",\"Role management\"]", new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 706, "Create new role", null, null, true, "Create new role", new Guid("9ff4e790-dfdb-401c-b450-0e3cc6fa008f"), new Guid("274ca920-c069-4c41-9ee1-dcd499713e3d"), false, "/roles/role/create", "CREATE", null, false },
                    { new Guid("d5ffc30d-aeb4-4b08-bb4b-4b8e29b7a4a9"), "[\"Art & Culture\", \"Faqs\"]", new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 920, null, null, null, true, "Edit Faqs", new Guid("d25bdc92-1a9b-4222-b07d-b9d32b40678d"), new Guid("a74ad063-a576-4834-bf3b-f7fba194dd81"), false, "/art-and-culture/faqs/edit/:id", "EDIT", null, false },
                    { new Guid("db52ec33-64d6-43d9-a13b-38cf09c1792f"), null, new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 1008, null, null, null, true, "Edit Digital Library", new Guid("b7d25f46-5e8a-4db6-ae8c-7f9b5c7d4e1e"), new Guid("d3e796c4-54db-4cad-9d15-ebc3d7759dcf"), false, "/sustainability/library/edit/:id", "EDIT", null, false },
                    { new Guid("dc0b252a-e9b2-458c-b2be-23d6a063e882"), "[\"Office\"]", new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 204, "Emergency Contact", null, null, true, "Emergency Contact", new Guid("f231f8e0-5f4f-41bd-9826-91718cef9fe7"), new Guid("74a9aaf6-32d6-431f-a1e7-68d041dc1f1f"), false, "/emergency-contact", "CREATE", null, false },
                    { new Guid("de9a81e1-3454-4570-aa6b-ca9cae6545d1"), "[\"Art & Culture\", \"Playlist\"]", new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 913, null, null, null, true, "Create Playlist", new Guid("de9a81e1-3454-4570-aa6b-ca9cae6545d1"), new Guid("ffd40f99-f1c4-4e6e-b2b8-5cd9d6c6fccc"), false, "/art-and-culture/playlist/create", "CREATE", null, false },
                    { new Guid("dfb26e2d-336e-49cb-9162-bd933453c67c"), null, new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 304, "Create new in-app notification", null, null, true, "In-apps notifications", new Guid("9bfe9f97-205d-4a4d-8b7b-c0a75e3485dd"), new Guid("c3038f9f-7742-4b1e-9287-f540e208b586"), false, "/notifications/inapp/create-inapp", "CREATE", null, false },
                    { new Guid("e3bfce6b-dc41-4dbe-a9e8-d43cbe69cae6"), null, new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 162, null, null, null, true, "Create Hero Banner", new Guid("c9453aea-fbc3-4559-84a9-103a532c998a"), new Guid("5b5be629-2886-4c70-8864-ad4fa650df0a"), false, "/marcom/hero/create", "CREATE", null, false },
                    { new Guid("e5afae2f-6fa5-4bfb-a5bc-963c9c3713fb"), null, new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 305, "In-apps notifications", null, null, true, "In-apps notifications", null, new Guid("c3038f9f-7742-4b1e-9287-f540e208b586"), false, "/notifications/inapp/edit/:id", "EDIT", null, false },
                    { new Guid("e5e64ccf-7f86-4896-9e4c-e5ef6720732e"), null, new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 304, "Create new in-app notification", null, null, true, "In-apps notifications", new Guid("9bfe9f97-205d-4a4d-8b7b-c0a75e3485dd"), new Guid("c3038f9f-7742-4b1e-9287-f540e208b586"), false, "/notifications/inapp/create-inapp/duplicate/:id", "CREATE", null, false },
                    { new Guid("e7806d02-a603-47f0-9bb6-2b0aaa852869"), null, new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 310, "Create new announcement template", null, null, true, "Create new announcement template", null, new Guid("9715e820-19ca-48fc-b4a4-5e5c6d193bc1"), false, "/notifications/template/create-announcement", "LIST", null, false },
                    { new Guid("e856099a-4ef5-4b2d-8fe1-df5f5c975b3a"), "[\"Office\"]", new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 210, "Directory Contact", null, null, true, "Directory Contact", new Guid("8f4a9416-e067-4834-a613-dd882b0693dc"), new Guid("85dbfe62-ca8c-472c-a33c-3f2dd43fe3d9"), false, "/directory-contact/show", "SHOW", null, false },
                    { new Guid("f0b65d94-67f7-4429-89dd-def0afa20e5e"), null, new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 1109, null, null, null, true, "Schedule Plan", new Guid("db9bc3e3-dd23-4b75-bfe0-bae28f165fc9"), new Guid("92fc160b-46ce-4c83-82c0-e047cd886eda"), false, "/guardtour/scheduleplan/create", "CREATE", null, false },
                    { new Guid("f270445f-018e-4f68-b9f9-b8b10e7350fe"), "[\"Art & Culture\", \"Playlist\"]", new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 914, null, null, null, true, "Edit Playlist", new Guid("f270445f-018e-4f68-b9f9-b8b10e7350fe"), new Guid("ffd40f99-f1c4-4e6e-b2b8-5cd9d6c6fccc"), false, "/art-and-culture/playlist/edit/:id", "EDIT", null, false },
                    { new Guid("f340108d-2384-409a-b3ae-80d21ba6134c"), "[\"Notifications\",\"In-apps template notifications\"]", new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 308, "View in-app template notification template", null, null, true, "View in-app template notification template", new Guid("560af02b-45da-428c-8aa8-aaf4b6201048"), new Guid("9715e820-19ca-48fc-b4a4-5e5c6d193bc1"), false, "/notifications/template/show/:id", "SHOW", null, false },
                    { new Guid("fec611d1-a66e-4193-8f73-d7a982f89edb"), "[\"Office\"]", new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 211, "Directory Contact", null, null, true, "Directory Contact", new Guid("8f4a9416-e067-4834-a613-dd882b0693dc"), new Guid("85dbfe62-ca8c-472c-a33c-3f2dd43fe3d9"), false, "/directory-contact/create", "CREATE", null, false },
                    { new Guid("ff3680b5-6fc2-4453-af50-733197029825"), null, new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), null, false, 1011, null, null, null, true, "Edit Content Management", new Guid("0e9a80f5-2394-49c3-bf0c-7a8e27b2c4e2"), new Guid("5ae35f75-2b89-4ae3-bb85-c3e4b85f7627"), false, "/sustainability/all/edit/:id", "EDIT", null, false }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("01706d92-128e-40d5-98a3-e54f1e66b814"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("01706d92-128e-40d5-98a3-e54f1e66b815"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("01706d92-128e-40d5-98a3-e54f1e66b816"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("01706d92-128e-40d5-98a3-e54f1e66b817"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("054dac0c-1636-40f3-9120-4996b5c7c65e"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("05ab1003-7561-44d9-8721-c1117799e4ef"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("115a8009-9e01-411e-8894-0f8e511924a0"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("137ad989-7a8d-4677-a866-480e944ea68a"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("13b65779-5c92-4b76-9d46-41b743a585aa"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("15aaa462-e484-4ca4-b355-5b5440f5eef8"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("16383f7a-aed4-4b92-ac83-2d602aa2d508"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("169891fe-97c7-4181-83e2-1f2045f66f14"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("1a6d14da-6c8f-4962-a445-ef0e8e0c6524"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("1a920071-d382-4a87-9626-7ca1c78ead44"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("1b6827e0-3272-4cf1-8b6b-4313e0fa6532"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("1b6827e0-3272-4cf1-8b6b-4313e0fa6632"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("1dd4cd55-7ac5-46cf-ad6b-461b32254abb"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("1e62d86d-129a-45c4-bb42-d3a0d0fddc96"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("20104da5-004f-4fdb-9987-8603cf49959a"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("234a02c1-b447-4e41-aa6f-64ce26e1d77c"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("25136f0a-b0b1-4b56-a8e7-0cccefa8025b"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("27801834-36e4-4fec-9750-aa4ff498063a"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("291f47ff-2783-48cc-a7e1-6242bcb26d2a"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("292462da-4d95-4189-94f0-8414fc42d303"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("293a2e71-278a-4c95-bdd4-a3b9dbd8e13c"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("2e48799b-9b5c-482e-8edb-37d419f16793"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("2e8b45cb-6288-4744-9231-f92527bfb476"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("345719dc-c6df-4d65-8a82-752273b9864b"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("35924bcd-d085-4c3a-8026-37ea2ca82482"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("366e47bb-895a-4157-8d2d-d474fcfcbed6"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("3fab705d-2e74-47d3-8f20-70378dcb1f38"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("40f7997c-a807-4dd5-9207-5a37d5894175"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("41587cf4-5588-46c7-bd79-5f04bc337b80"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("41748bc4-023c-4b1b-adcb-75cdfbdafc27"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("4411d520-34ac-4f32-9275-5158b3d14d3f"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("44ee9361-9c44-4435-aece-01204e0374f1"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("482f7f4d-aac8-4ef2-90a3-c7178852499f"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("4eeaf585-c62c-4e44-8e49-0f58daa6b6d1"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("54f6ea7d-cc01-45a2-a68e-48d22dfdf01d"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("5622623f-e8b2-4d5f-9d8d-0e9413ada6d4"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("56f8419c-e36e-4dc9-8ac9-25261174f50b"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("58aa403f-72d4-41a5-9737-41a686e107bb"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("599d3c7a-3a17-427a-8641-68db20dc0042"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("5b0a2540-56d0-416d-a346-cca2ca96f828"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("5c7b655b-0d9d-4676-83a4-a3fc160bd078"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("6089cedc-519e-40c8-a5d0-cf868307e0e7"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("62ff1523-5536-4baa-87b0-9d702d65ce48"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("65de772d-7c34-4855-83c3-2b29786ed9ba"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("67221236-b4fb-407d-9fa5-79609e835858"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("67b4b518-80f7-449c-9f17-51e989f5ab90"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("699415f6-01a2-4556-9734-2e918c2748d7"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("6e0777ec-4958-402b-a374-b8e604fa8da7"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("6f9dcead-e770-476a-943f-c4606b3f36a8"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("6fa909d3-7419-4dc0-a7bf-0292c9527a01"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("72178f6f-99b2-4a32-9e45-a296dcdb025e"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("77bb48c9-5609-436b-a574-cb71ba288e2a"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("7bfa25e4-7d0f-4fa2-81f4-d464e0888cae"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("7cc7ea3f-b216-40af-973f-58734ea4b5ea"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("7f03b134-cc4a-475b-84f3-a3ebc6521103"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("8911cdf9-71ec-49aa-ad3b-716c966a54df"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("8ad532c7-1cdd-4f35-8a40-4a13cf0bb60c"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("8dac7d2f-4761-4e57-8b13-5d9b6cab52ec"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("8e3379a0-fa55-48a0-a873-19726a50f003"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("95c3bef9-94aa-40e7-858b-c0d1a4e26b48"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("9b49ddba-1b9d-445b-a2c9-168dd1903dde"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("9c16bb6a-2798-4da7-916d-ef91a917dcd1"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("9debbc29-17a3-4753-9edd-edda1292a340"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("9f66e2a4-fe19-42a9-a98f-65b2ebce2856"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("a1558dca-7677-4749-a2f4-71d79779b3ab"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("a3cec3e0-5e22-48d4-b149-bd6a50d6ce58"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("b1411131-4f55-4d9d-8910-3daf76c26dc1"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("b15a2f26-0cc2-44a8-9fea-52a43a20ca29"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("b28c71e1-ac54-4706-8b9e-e435139a8ea3"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("b35991e9-961c-4b99-9a93-253d1b37b2eb"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("b38bd9d0-d315-4bfd-b8c1-c23f38265587"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("be549187-a15c-4951-a983-a37a64c195b3"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("bfef882e-682b-4753-b9f3-c7ec3f3acb46"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("c078d178-96f5-4aee-b6b9-a64d339ee6aa"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("c6328155-2278-4e0c-8765-f6e6ca951055"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("c70c8ed6-9ba2-4fca-a1dc-88dea997f280"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("c965d9bd-6f96-4fa6-9422-3b4c6d0930d8"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("cb77ab47-4d4f-453a-91e1-a42fb2d9a20e"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("cd06d2c3-a8e1-4c10-b70e-8bb7348a1d7f"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("cecdbe9e-639f-40cc-abd1-7fa588904d2e"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("d0fbe2f6-2973-4cba-91a1-680dd86d72bc"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("d3a532d7-c625-4d48-8699-e8b6f915da71"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("d4f29776-3f01-4dde-8c47-3f06735fe01b"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("d5ffc30d-aeb4-4b08-bb4b-4b8e29b7a4a9"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("d8f12f83-60d0-4d81-ab79-39edd94cad82"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("d9c64711-9d19-4fc0-bb4a-75129dd552bd"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("db52ec33-64d6-43d9-a13b-38cf09c1792f"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("dc0b252a-e9b2-458c-b2be-23d6a063e882"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("de9a81e1-3454-4570-aa6b-ca9cae6545d1"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("dfb26e2d-336e-49cb-9162-bd933453c67c"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("e3bfce6b-dc41-4dbe-a9e8-d43cbe69cae6"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("e5afae2f-6fa5-4bfb-a5bc-963c9c3713fb"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("e5e64ccf-7f86-4896-9e4c-e5ef6720732e"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("e7806d02-a603-47f0-9bb6-2b0aaa852869"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("e856099a-4ef5-4b2d-8fe1-df5f5c975b3a"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("f0b65d94-67f7-4429-89dd-def0afa20e5e"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("f2291ac0-0469-488a-9f9c-d5596dd1ed7f"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("f270445f-018e-4f68-b9f9-b8b10e7350fe"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("f340108d-2384-409a-b3ae-80d21ba6134c"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("fec611d1-a66e-4193-8f73-d7a982f89edb"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("ff3680b5-6fc2-4453-af50-733197029825"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("01706d92-128e-40d5-98a3-e54f1e66b810"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("01706d92-128e-40d5-98a3-e54f1e66b813"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("0885f38e-0f44-44fa-90b4-82467b270faa"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("0b033360-e296-41e9-a572-b57abd9fa98b"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("0ea4b40d-2bce-4e9b-8ec2-13de9e36a228"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("1881843c-404b-4fc6-a55b-8923fa409a02"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("245b2e4a-6e4b-4e1b-8dd8-9c46d0438cda"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("274ca920-c069-4c41-9ee1-dcd499713e3d"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("29eb488e-e405-416a-a492-b2b433cc2778"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("2ad8b5cc-8189-4be0-ad71-6ae15b23b7e9"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("3d147124-ac5d-42a1-b1e0-7e3a531bbe8b"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("4d163844-5319-4a18-ab91-3538c6bbcb29"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("5ae35f75-2b89-4ae3-bb85-c3e4b85f7627"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("5b5be629-2886-4c70-8864-ad4fa650df0a"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("6103a7fc-8362-4daf-9d43-ec8c9b39813e"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("74a9aaf6-32d6-431f-a1e7-68d041dc1f1f"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("75eaf43e-b878-4d95-b668-d6b419100f8f"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("85dbfe62-ca8c-472c-a33c-3f2dd43fe3d9"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("88874de1-34c6-40b5-895b-b8c68e0455bb"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("92fc160b-46ce-4c83-82c0-e047cd886eda"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("9715e820-19ca-48fc-b4a4-5e5c6d193bc1"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("9a2da925-5c65-4d18-a60d-371d8f712b9d"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("a74ad063-a576-4834-bf3b-f7fba194dd81"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("a7e4303b-40bc-492b-8cfd-951db9403628"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("b1b3907e-503c-408d-911b-32d7f6450694"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("c0a62684-d85a-4b8a-bbb7-8d7d55b3c049"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("c3038f9f-7742-4b1e-9287-f540e208b586"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("d234f890-4b27-45d8-9fa7-9c8b014b5f4b"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("d3e796c4-54db-4cad-9d15-ebc3d7759dcf"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("d65f958d-a3ab-45f9-9b34-99c362376eb5"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("e63e87c3-9ab2-4d21-9b0b-435ce7ca3206"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("ed1aae97-4614-4a27-822d-d3d0dec4d26a"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("ed8b89d9-aa36-4fa2-bc23-5e5cdf8fd85e"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("efe3a53a-92a7-452e-a541-793782a805c2"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("f9720e30-bc8f-49aa-a31a-d51ef69422a3"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("ffb61799-f008-4dee-9645-b6ba162224d2"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("ffd40f99-f1c4-4e6e-b2b8-5cd9d6c6fccc"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("119e8afe-263c-4219-9d33-67825b221dd5"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("15156413-ca2d-4b3a-8c1e-e7019ca2ca35"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("1c6b105b-cca1-42ec-9fdc-8ca03b1ef978"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("22743885-cf89-4009-8ca6-01049a2dba36"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("2c43fd62-d1d1-4100-a04e-7f08b0046809"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("34481ce3-583e-4ad3-9411-dbe319f7ba3e"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("441badea-bd50-4bf1-908a-b5ca06235d75"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("468c162a-ea3f-4aa8-84c0-69c04ce0c883"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("70cf0c58-b435-4b3e-91e5-d1b2ccb217ba"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("70cf0c58-b435-4b3e-91e5-d1b2ccb217bf"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("9674aef9-f1af-46f5-8457-f920cfdb1600"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("994bbf11-10bf-411f-b395-27c3561ade9b"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("cc6f542c-7572-4bc0-b1d7-cedf08b37342"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("dc712dc0-9a6b-4b35-8c42-e2870deb804c"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("eac1e712-1f6c-4b20-bf47-fdb593c69b36"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("1072eee8-2707-49e4-8131-83457b8edce8"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("1c8d8a4f-23f3-4c6c-bb10-948c6e14dc09"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("31038a00-a731-4e91-b1e1-2de9e9479a56"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("3d1cf108-2efd-4dcc-bb67-13b054e72a18"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("55a37615-fab7-49d9-a191-40eaf5f308a2"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("7f7eb8ad-18aa-49f7-9f0d-5f272cb26cb1"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("84bf146b-86c5-4b51-8829-226a3dd475c1"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("8b3c633c-eb6b-4165-b073-f15142089e07"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("cebff353-c600-4ed9-ac4d-e6d6765fc6f0"));

            migrationBuilder.DeleteData(
                table: "mtMenu",
                keyColumn: "Id",
                keyValue: new Guid("d4b81ede-36b6-4561-b59a-a15d874c28cf"));

            migrationBuilder.UpdateData(
                table: "Location",
                keyColumn: "LID",
                keyValue: new Guid("2c055101-2271-44e0-95fe-bcf2c59a459a"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 6, 4, 13, 59, 22, 683, DateTimeKind.Local).AddTicks(6110), new DateTime(2025, 6, 4, 13, 59, 22, 683, DateTimeKind.Local).AddTicks(6110) });
        }
    }
}
