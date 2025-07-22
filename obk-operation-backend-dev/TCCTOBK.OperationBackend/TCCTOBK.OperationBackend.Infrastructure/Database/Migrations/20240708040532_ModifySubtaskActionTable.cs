using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace TCCTOBK.OperationBackend.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class ModifySubtaskActionTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "MetaData",
                table: "trSubtaskAction",
                type: "json",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Reading",
                table: "trSubtaskAction",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Remarks",
                table: "trSubtaskAction",
                type: "text",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("4199e4de-bdf8-48f8-a8a8-a5b31756a748"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 8, 11, 5, 31, 715, DateTimeKind.Local).AddTicks(5094), new DateTime(2024, 7, 8, 11, 5, 31, 716, DateTimeKind.Local).AddTicks(279) });

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("caa4ebec-15c8-4d6b-9985-6d6b66f94e63"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 8, 11, 5, 31, 716, DateTimeKind.Local).AddTicks(813), new DateTime(2024, 7, 8, 11, 5, 31, 716, DateTimeKind.Local).AddTicks(816) });

            migrationBuilder.InsertData(
                table: "mtActionType",
                columns: new[] { "Id", "Action", "CreatedBy", "CreatedByName", "CreatedDate", "UpdatedBy", "UpdatedByName", "UpdatedDate" },
                values: new object[,]
                {
                    { new Guid("e8eb7171-de01-4a85-a955-711b211eecc2"), "qr", "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 6, 8, 11, 5, 31, 719, DateTimeKind.Local).AddTicks(5555), "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 6, 8, 11, 5, 31, 719, DateTimeKind.Local).AddTicks(5630) },
                    { new Guid("e8eb7171-de01-4a85-a955-711b211eecc3"), "confirm", "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 6, 8, 11, 5, 31, 719, DateTimeKind.Local).AddTicks(5655), "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 6, 8, 11, 5, 31, 719, DateTimeKind.Local).AddTicks(5656) },
                    { new Guid("e8eb7171-de01-4a85-a955-711b211eecc4"), "photo", "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 6, 8, 11, 5, 31, 719, DateTimeKind.Local).AddTicks(5659), "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 6, 8, 11, 5, 31, 719, DateTimeKind.Local).AddTicks(5660) }
                });

            migrationBuilder.InsertData(
                table: "trSubtask",
                columns: new[] { "Id", "CreatedBy", "CreatedByName", "CreatedDate", "Name", "StatusId", "UpdatedBy", "UpdatedByName", "UpdatedDate" },
                values: new object[,]
                {
                    { new Guid("1a157bf0-4748-4589-91cc-1450e0c06596"), "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 6, 8, 11, 5, 31, 719, DateTimeKind.Local).AddTicks(9029), "L-10, Fire Exit Door 2 (Passenger Elevator)", 0, "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 6, 8, 11, 5, 31, 719, DateTimeKind.Local).AddTicks(9030) },
                    { new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5"), "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 6, 8, 11, 5, 31, 719, DateTimeKind.Local).AddTicks(9037), "L-10, Fire Exit Door 1 (Passenger Elevator)", 0, "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 6, 8, 11, 5, 31, 719, DateTimeKind.Local).AddTicks(9038) },
                    { new Guid("3fa85f64-5717-4562-b3fc-2c963f66afa6"), "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 6, 8, 11, 5, 31, 719, DateTimeKind.Local).AddTicks(9033), "L-10, Fire Exit Door 4 (Passenger Elevator)", 0, "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 6, 8, 11, 5, 31, 719, DateTimeKind.Local).AddTicks(9034) },
                    { new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496"), "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 6, 8, 11, 5, 31, 719, DateTimeKind.Local).AddTicks(8981), "Distress Alert", 0, "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 6, 8, 11, 5, 31, 719, DateTimeKind.Local).AddTicks(8985) },
                    { new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911"), "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 6, 8, 11, 5, 31, 719, DateTimeKind.Local).AddTicks(9005), "L-10, Fire Exit Door 3 (Passenger Elevator)", 0, "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 6, 8, 11, 5, 31, 719, DateTimeKind.Local).AddTicks(9026) }
                });

            migrationBuilder.InsertData(
                table: "trTask",
                columns: new[] { "Id", "CreatedBy", "CreatedByName", "CreatedDate", "EndDate", "LocationId", "MemberId", "Name", "StartDate", "StatusId", "UpdatedBy", "UpdatedByName", "UpdatedDate" },
                values: new object[,]
                {
                    { new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b"), "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 6, 8, 11, 5, 31, 720, DateTimeKind.Local).AddTicks(512), null, new Guid("00000000-0000-0000-0000-000000000000"), new Guid("00000000-0000-0000-0000-000000000000"), "Illegal Parking", null, 0, "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 6, 8, 11, 5, 31, 720, DateTimeKind.Local).AddTicks(516) },
                    { new Guid("4422cc3c-0ea5-4d73-a31e-a42485a81003"), "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 6, 8, 11, 5, 31, 720, DateTimeKind.Local).AddTicks(537), null, new Guid("00000000-0000-0000-0000-000000000000"), new Guid("00000000-0000-0000-0000-000000000000"), "Distress Alert", null, 0, "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 6, 8, 11, 5, 31, 720, DateTimeKind.Local).AddTicks(538) }
                });

            migrationBuilder.InsertData(
                table: "trAction",
                columns: new[] { "Id", "ActionType", "CreatedBy", "CreatedByName", "CreatedDate", "Description", "MetaData", "Name", "UpdatedBy", "UpdatedByName", "UpdatedDate" },
                values: new object[,]
                {
                    { new Guid("2aa84ed4-a495-47c8-913f-fa5928c1b4b8"), new Guid("e8eb7171-de01-4a85-a955-711b211eecc2"), "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 6, 8, 11, 5, 31, 719, DateTimeKind.Local).AddTicks(7511), "L-10, Fire Exit Door 3 (Passenger Elevator)", null, "Scan QR Code", "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 6, 8, 11, 5, 31, 719, DateTimeKind.Local).AddTicks(7538) },
                    { new Guid("3ff4f468-53ef-48a3-8781-61a8a053fa99"), new Guid("e8eb7171-de01-4a85-a955-711b211eecc2"), "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 6, 8, 11, 5, 31, 719, DateTimeKind.Local).AddTicks(7559), "L-10, Fire Exit Door 2 (Passenger Elevator)", null, "Scan QR Code", "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 6, 8, 11, 5, 31, 719, DateTimeKind.Local).AddTicks(7560) },
                    { new Guid("564d0272-92c8-4108-82b2-0f98882058d4"), new Guid("e8eb7171-de01-4a85-a955-711b211eecc3"), "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 6, 8, 11, 5, 31, 719, DateTimeKind.Local).AddTicks(7563), "Inspect fire exits and make sure all the doors are closed", null, "Inspect Fire doors", "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 6, 8, 11, 5, 31, 719, DateTimeKind.Local).AddTicks(7564) },
                    { new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"), new Guid("e8eb7171-de01-4a85-a955-711b211eecc3"), "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 6, 8, 11, 5, 31, 719, DateTimeKind.Local).AddTicks(7567), "Inspect fire exits and make sure all the doors are closed", null, "Inspect Fire doors", "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 6, 8, 11, 5, 31, 719, DateTimeKind.Local).AddTicks(7568) },
                    { new Guid("c1cb273c-570a-42f5-b563-66bac08911cc"), new Guid("e8eb7171-de01-4a85-a955-711b211eecc3"), "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 6, 8, 11, 5, 31, 719, DateTimeKind.Local).AddTicks(7571), "Check Distress Alert", null, "Distress Alert", "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 6, 8, 11, 5, 31, 719, DateTimeKind.Local).AddTicks(7572) },
                    { new Guid("e8eb7171-de01-4a85-a955-711b211eecc1"), new Guid("e8eb7171-de01-4a85-a955-711b211eecc2"), "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 6, 8, 11, 5, 31, 719, DateTimeKind.Local).AddTicks(7579), "L-10, Fire Exit Door 1 (Passenger Elevator)", null, "Scan QR Code", "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 6, 8, 11, 5, 31, 719, DateTimeKind.Local).AddTicks(7580) }
                });

            migrationBuilder.InsertData(
                table: "trTaskSubtask",
                columns: new[] { "Subtask", "Task", "CreatedBy", "CreatedByName", "CreatedDate", "UpdatedBy", "UpdatedByName", "UpdatedDate" },
                values: new object[,]
                {
                    { new Guid("1a157bf0-4748-4589-91cc-1450e0c06596"), new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b"), "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 6, 8, 11, 5, 31, 720, DateTimeKind.Local).AddTicks(1389), "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 6, 8, 11, 5, 31, 720, DateTimeKind.Local).AddTicks(1394) },
                    { new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5"), new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b"), "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 6, 8, 11, 5, 31, 720, DateTimeKind.Local).AddTicks(1412), "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 6, 8, 11, 5, 31, 720, DateTimeKind.Local).AddTicks(1413) },
                    { new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911"), new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b"), "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 6, 8, 11, 5, 31, 720, DateTimeKind.Local).AddTicks(1435), "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 6, 8, 11, 5, 31, 720, DateTimeKind.Local).AddTicks(1436) },
                    { new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496"), new Guid("4422cc3c-0ea5-4d73-a31e-a42485a81003"), "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 6, 8, 11, 5, 31, 720, DateTimeKind.Local).AddTicks(1439), "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 6, 8, 11, 5, 31, 720, DateTimeKind.Local).AddTicks(1440) }
                });

            migrationBuilder.InsertData(
                table: "trSubtaskAction",
                columns: new[] { "Action", "Subtask", "CreatedBy", "CreatedByName", "CreatedDate", "MetaData", "Reading", "Remarks", "StatusId", "UpdatedBy", "UpdatedByName", "UpdatedDate" },
                values: new object[,]
                {
                    { new Guid("3ff4f468-53ef-48a3-8781-61a8a053fa99"), new Guid("1a157bf0-4748-4589-91cc-1450e0c06596"), "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 6, 8, 11, 5, 31, 720, DateTimeKind.Local).AddTicks(2548), null, null, null, 0, "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 6, 8, 11, 5, 31, 720, DateTimeKind.Local).AddTicks(2552) },
                    { new Guid("564d0272-92c8-4108-82b2-0f98882058d4"), new Guid("1a157bf0-4748-4589-91cc-1450e0c06596"), "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 6, 8, 11, 5, 31, 720, DateTimeKind.Local).AddTicks(2570), null, null, null, 0, "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 6, 8, 11, 5, 31, 720, DateTimeKind.Local).AddTicks(2571) },
                    { new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"), new Guid("1a157bf0-4748-4589-91cc-1450e0c06596"), "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 6, 8, 11, 5, 31, 720, DateTimeKind.Local).AddTicks(2574), null, null, null, 0, "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 6, 8, 11, 5, 31, 720, DateTimeKind.Local).AddTicks(2576) },
                    { new Guid("564d0272-92c8-4108-82b2-0f98882058d4"), new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5"), "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 6, 8, 11, 5, 31, 720, DateTimeKind.Local).AddTicks(2578), null, null, null, 0, "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 6, 8, 11, 5, 31, 720, DateTimeKind.Local).AddTicks(2579) },
                    { new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"), new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5"), "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 6, 8, 11, 5, 31, 720, DateTimeKind.Local).AddTicks(2582), null, null, null, 0, "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 6, 8, 11, 5, 31, 720, DateTimeKind.Local).AddTicks(2583) },
                    { new Guid("e8eb7171-de01-4a85-a955-711b211eecc1"), new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5"), "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 6, 8, 11, 5, 31, 720, DateTimeKind.Local).AddTicks(2589), null, null, null, 0, "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 6, 8, 11, 5, 31, 720, DateTimeKind.Local).AddTicks(2590) },
                    { new Guid("c1cb273c-570a-42f5-b563-66bac08911cc"), new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496"), "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 6, 8, 11, 5, 31, 720, DateTimeKind.Local).AddTicks(2605), null, null, null, 0, "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 6, 8, 11, 5, 31, 720, DateTimeKind.Local).AddTicks(2606) },
                    { new Guid("2aa84ed4-a495-47c8-913f-fa5928c1b4b8"), new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911"), "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 6, 8, 11, 5, 31, 720, DateTimeKind.Local).AddTicks(2593), null, null, null, 0, "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 6, 8, 11, 5, 31, 720, DateTimeKind.Local).AddTicks(2594) },
                    { new Guid("564d0272-92c8-4108-82b2-0f98882058d4"), new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911"), "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 6, 8, 11, 5, 31, 720, DateTimeKind.Local).AddTicks(2596), null, null, null, 0, "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 6, 8, 11, 5, 31, 720, DateTimeKind.Local).AddTicks(2597) },
                    { new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"), new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911"), "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 6, 8, 11, 5, 31, 720, DateTimeKind.Local).AddTicks(2600), null, null, null, 0, "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 6, 8, 11, 5, 31, 720, DateTimeKind.Local).AddTicks(2601) }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc4"));

            migrationBuilder.DeleteData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("3fa85f64-5717-4562-b3fc-2c963f66afa6"));

            migrationBuilder.DeleteData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("3ff4f468-53ef-48a3-8781-61a8a053fa99"), new Guid("1a157bf0-4748-4589-91cc-1450e0c06596") });

            migrationBuilder.DeleteData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("564d0272-92c8-4108-82b2-0f98882058d4"), new Guid("1a157bf0-4748-4589-91cc-1450e0c06596") });

            migrationBuilder.DeleteData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"), new Guid("1a157bf0-4748-4589-91cc-1450e0c06596") });

            migrationBuilder.DeleteData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("564d0272-92c8-4108-82b2-0f98882058d4"), new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5") });

            migrationBuilder.DeleteData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"), new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5") });

            migrationBuilder.DeleteData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("e8eb7171-de01-4a85-a955-711b211eecc1"), new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5") });

            migrationBuilder.DeleteData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("c1cb273c-570a-42f5-b563-66bac08911cc"), new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496") });

            migrationBuilder.DeleteData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("2aa84ed4-a495-47c8-913f-fa5928c1b4b8"), new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911") });

            migrationBuilder.DeleteData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("564d0272-92c8-4108-82b2-0f98882058d4"), new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911") });

            migrationBuilder.DeleteData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"), new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911") });

            migrationBuilder.DeleteData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("1a157bf0-4748-4589-91cc-1450e0c06596"), new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b") });

            migrationBuilder.DeleteData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5"), new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b") });

            migrationBuilder.DeleteData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911"), new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b") });

            migrationBuilder.DeleteData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496"), new Guid("4422cc3c-0ea5-4d73-a31e-a42485a81003") });

            migrationBuilder.DeleteData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("2aa84ed4-a495-47c8-913f-fa5928c1b4b8"));

            migrationBuilder.DeleteData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("3ff4f468-53ef-48a3-8781-61a8a053fa99"));

            migrationBuilder.DeleteData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("564d0272-92c8-4108-82b2-0f98882058d4"));

            migrationBuilder.DeleteData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"));

            migrationBuilder.DeleteData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("c1cb273c-570a-42f5-b563-66bac08911cc"));

            migrationBuilder.DeleteData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc1"));

            migrationBuilder.DeleteData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("1a157bf0-4748-4589-91cc-1450e0c06596"));

            migrationBuilder.DeleteData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5"));

            migrationBuilder.DeleteData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496"));

            migrationBuilder.DeleteData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911"));

            migrationBuilder.DeleteData(
                table: "trTask",
                keyColumn: "Id",
                keyValue: new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b"));

            migrationBuilder.DeleteData(
                table: "trTask",
                keyColumn: "Id",
                keyValue: new Guid("4422cc3c-0ea5-4d73-a31e-a42485a81003"));

            migrationBuilder.DeleteData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc2"));

            migrationBuilder.DeleteData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc3"));

            migrationBuilder.DropColumn(
                name: "MetaData",
                table: "trSubtaskAction");

            migrationBuilder.DropColumn(
                name: "Reading",
                table: "trSubtaskAction");

            migrationBuilder.DropColumn(
                name: "Remarks",
                table: "trSubtaskAction");

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("4199e4de-bdf8-48f8-a8a8-a5b31756a748"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 26, 17, 5, 12, 591, DateTimeKind.Local).AddTicks(8461), new DateTime(2024, 6, 26, 17, 5, 12, 592, DateTimeKind.Local).AddTicks(5613) });

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("caa4ebec-15c8-4d6b-9985-6d6b66f94e63"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 26, 17, 5, 12, 592, DateTimeKind.Local).AddTicks(6022), new DateTime(2024, 6, 26, 17, 5, 12, 592, DateTimeKind.Local).AddTicks(6024) });
        }
    }
}
