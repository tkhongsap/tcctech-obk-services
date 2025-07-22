using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TCCTOBK.OperationBackend.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class SeedActionTypeComplex : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Location",
                keyColumn: "LID",
                keyValue: new Guid("2c055101-2271-44e0-95fe-bcf2c59a459a"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(9749), new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(9753) });

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("4199e4de-bdf8-48f8-a8a8-a5b31756a748"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 8, 17, 41, 7, 380, DateTimeKind.Local).AddTicks(5653), new DateTime(2024, 7, 8, 17, 41, 7, 381, DateTimeKind.Local).AddTicks(1370) });

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("caa4ebec-15c8-4d6b-9985-6d6b66f94e63"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 8, 17, 41, 7, 381, DateTimeKind.Local).AddTicks(1908), new DateTime(2024, 7, 8, 17, 41, 7, 381, DateTimeKind.Local).AddTicks(1912) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc2"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(48), new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(157) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc3"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(198), new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(199) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc4"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(202), new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(219) });

            migrationBuilder.InsertData(
                table: "mtActionType",
                columns: new[] { "Id", "Action", "CreatedBy", "CreatedByName", "CreatedDate", "UpdatedBy", "UpdatedByName", "UpdatedDate" },
                values: new object[] { new Guid("e8eb7171-de01-4a85-a955-711b211eecc5"), "complex", "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(221), "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(222) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("2aa84ed4-a495-47c8-913f-fa5928c1b4b8"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(2140), new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(2145) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("3ff4f468-53ef-48a3-8781-61a8a053fa99"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(2165), new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(2166) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("564d0272-92c8-4108-82b2-0f98882058d4"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(2169), new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(2170) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(2174), new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(2175) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("c1cb273c-570a-42f5-b563-66bac08911cc"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(2177), new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(2178) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc1"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(2213), new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(2214) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("1a157bf0-4748-4589-91cc-1450e0c06596"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(3723), new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(3725) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(3731), new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(3732) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("3fa85f64-5717-4562-b3fc-2c963f66afa6"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(3728), new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(3728) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(3693), new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(3698) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(3720), new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(3721) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("3ff4f468-53ef-48a3-8781-61a8a053fa99"), new Guid("1a157bf0-4748-4589-91cc-1450e0c06596") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(7508), new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(7513) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("564d0272-92c8-4108-82b2-0f98882058d4"), new Guid("1a157bf0-4748-4589-91cc-1450e0c06596") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(7532), new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(7533) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"), new Guid("1a157bf0-4748-4589-91cc-1450e0c06596") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(7557), new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(7558) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("564d0272-92c8-4108-82b2-0f98882058d4"), new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(7561), new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(7562) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"), new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(7569), new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(7572) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("e8eb7171-de01-4a85-a955-711b211eecc1"), new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(7579), new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(7580) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("c1cb273c-570a-42f5-b563-66bac08911cc"), new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(7699), new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(7701) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("2aa84ed4-a495-47c8-913f-fa5928c1b4b8"), new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(7584), new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(7585) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("564d0272-92c8-4108-82b2-0f98882058d4"), new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(7588), new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(7589) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"), new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(7592), new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(7593) });

            migrationBuilder.UpdateData(
                table: "trTask",
                keyColumn: "Id",
                keyValue: new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(5494), new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(5499) });

            migrationBuilder.UpdateData(
                table: "trTask",
                keyColumn: "Id",
                keyValue: new Guid("4422cc3c-0ea5-4d73-a31e-a42485a81003"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(5544), new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(5546) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("1a157bf0-4748-4589-91cc-1450e0c06596"), new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(6375), new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(6379) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5"), new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(6397), new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(6398) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911"), new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(6400), new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(6402) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496"), new Guid("4422cc3c-0ea5-4d73-a31e-a42485a81003") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(6404), new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(6405) });

            migrationBuilder.InsertData(
                table: "trAction",
                columns: new[] { "Id", "ActionType", "CreatedBy", "CreatedByName", "CreatedDate", "Description", "MetaData", "Name", "UpdatedBy", "UpdatedByName", "UpdatedDate" },
                values: new object[] { new Guid("c1cb273c-570a-42f5-b563-66bac08911cd"), new Guid("e8eb7171-de01-4a85-a955-711b211eecc5"), "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(2218), "Check Distress Alert", null, "Distress Alert", "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(2219) });

            migrationBuilder.InsertData(
                table: "trSubtaskAction",
                columns: new[] { "Action", "Subtask", "CreatedBy", "CreatedByName", "CreatedDate", "MetaData", "Reading", "Remarks", "StatusId", "UpdatedBy", "UpdatedByName", "UpdatedDate" },
                values: new object[] { new Guid("c1cb273c-570a-42f5-b563-66bac08911cd"), new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496"), "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(7704), null, null, null, 0, "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(7705) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("c1cb273c-570a-42f5-b563-66bac08911cd"), new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496") });

            migrationBuilder.DeleteData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("c1cb273c-570a-42f5-b563-66bac08911cd"));

            migrationBuilder.DeleteData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc5"));

            migrationBuilder.UpdateData(
                table: "Location",
                keyColumn: "LID",
                keyValue: new Guid("2c055101-2271-44e0-95fe-bcf2c59a459a"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 15, 2, 48, 61, DateTimeKind.Local).AddTicks(2628), new DateTime(2024, 6, 8, 15, 2, 48, 61, DateTimeKind.Local).AddTicks(2632) });

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("4199e4de-bdf8-48f8-a8a8-a5b31756a748"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 8, 15, 2, 48, 55, DateTimeKind.Local).AddTicks(6020), new DateTime(2024, 7, 8, 15, 2, 48, 56, DateTimeKind.Local).AddTicks(1127) });

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("caa4ebec-15c8-4d6b-9985-6d6b66f94e63"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 8, 15, 2, 48, 56, DateTimeKind.Local).AddTicks(1620), new DateTime(2024, 7, 8, 15, 2, 48, 56, DateTimeKind.Local).AddTicks(1623) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc2"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 15, 2, 48, 60, DateTimeKind.Local).AddTicks(3521), new DateTime(2024, 6, 8, 15, 2, 48, 60, DateTimeKind.Local).AddTicks(3615) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc3"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 15, 2, 48, 60, DateTimeKind.Local).AddTicks(3645), new DateTime(2024, 6, 8, 15, 2, 48, 60, DateTimeKind.Local).AddTicks(3646) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc4"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 15, 2, 48, 60, DateTimeKind.Local).AddTicks(3649), new DateTime(2024, 6, 8, 15, 2, 48, 60, DateTimeKind.Local).AddTicks(3662) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("2aa84ed4-a495-47c8-913f-fa5928c1b4b8"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 15, 2, 48, 60, DateTimeKind.Local).AddTicks(5870), new DateTime(2024, 6, 8, 15, 2, 48, 60, DateTimeKind.Local).AddTicks(5877) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("3ff4f468-53ef-48a3-8781-61a8a053fa99"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 15, 2, 48, 60, DateTimeKind.Local).AddTicks(5899), new DateTime(2024, 6, 8, 15, 2, 48, 60, DateTimeKind.Local).AddTicks(5900) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("564d0272-92c8-4108-82b2-0f98882058d4"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 15, 2, 48, 60, DateTimeKind.Local).AddTicks(5903), new DateTime(2024, 6, 8, 15, 2, 48, 60, DateTimeKind.Local).AddTicks(5904) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 15, 2, 48, 60, DateTimeKind.Local).AddTicks(5907), new DateTime(2024, 6, 8, 15, 2, 48, 60, DateTimeKind.Local).AddTicks(5908) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("c1cb273c-570a-42f5-b563-66bac08911cc"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 15, 2, 48, 60, DateTimeKind.Local).AddTicks(5911), new DateTime(2024, 6, 8, 15, 2, 48, 60, DateTimeKind.Local).AddTicks(5912) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc1"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 15, 2, 48, 60, DateTimeKind.Local).AddTicks(5922), new DateTime(2024, 6, 8, 15, 2, 48, 60, DateTimeKind.Local).AddTicks(5923) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("1a157bf0-4748-4589-91cc-1450e0c06596"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 15, 2, 48, 60, DateTimeKind.Local).AddTicks(7430), new DateTime(2024, 6, 8, 15, 2, 48, 60, DateTimeKind.Local).AddTicks(7431) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 15, 2, 48, 60, DateTimeKind.Local).AddTicks(7436), new DateTime(2024, 6, 8, 15, 2, 48, 60, DateTimeKind.Local).AddTicks(7437) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("3fa85f64-5717-4562-b3fc-2c963f66afa6"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 15, 2, 48, 60, DateTimeKind.Local).AddTicks(7433), new DateTime(2024, 6, 8, 15, 2, 48, 60, DateTimeKind.Local).AddTicks(7434) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 15, 2, 48, 60, DateTimeKind.Local).AddTicks(7402), new DateTime(2024, 6, 8, 15, 2, 48, 60, DateTimeKind.Local).AddTicks(7407) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 15, 2, 48, 60, DateTimeKind.Local).AddTicks(7426), new DateTime(2024, 6, 8, 15, 2, 48, 60, DateTimeKind.Local).AddTicks(7427) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("3ff4f468-53ef-48a3-8781-61a8a053fa99"), new Guid("1a157bf0-4748-4589-91cc-1450e0c06596") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 15, 2, 48, 61, DateTimeKind.Local).AddTicks(1028), new DateTime(2024, 6, 8, 15, 2, 48, 61, DateTimeKind.Local).AddTicks(1033) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("564d0272-92c8-4108-82b2-0f98882058d4"), new Guid("1a157bf0-4748-4589-91cc-1450e0c06596") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 15, 2, 48, 61, DateTimeKind.Local).AddTicks(1049), new DateTime(2024, 6, 8, 15, 2, 48, 61, DateTimeKind.Local).AddTicks(1050) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"), new Guid("1a157bf0-4748-4589-91cc-1450e0c06596") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 15, 2, 48, 61, DateTimeKind.Local).AddTicks(1053), new DateTime(2024, 6, 8, 15, 2, 48, 61, DateTimeKind.Local).AddTicks(1054) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("564d0272-92c8-4108-82b2-0f98882058d4"), new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 15, 2, 48, 61, DateTimeKind.Local).AddTicks(1057), new DateTime(2024, 6, 8, 15, 2, 48, 61, DateTimeKind.Local).AddTicks(1058) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"), new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 15, 2, 48, 61, DateTimeKind.Local).AddTicks(1060), new DateTime(2024, 6, 8, 15, 2, 48, 61, DateTimeKind.Local).AddTicks(1061) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("e8eb7171-de01-4a85-a955-711b211eecc1"), new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 15, 2, 48, 61, DateTimeKind.Local).AddTicks(1066), new DateTime(2024, 6, 8, 15, 2, 48, 61, DateTimeKind.Local).AddTicks(1067) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("c1cb273c-570a-42f5-b563-66bac08911cc"), new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 15, 2, 48, 61, DateTimeKind.Local).AddTicks(1080), new DateTime(2024, 6, 8, 15, 2, 48, 61, DateTimeKind.Local).AddTicks(1081) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("2aa84ed4-a495-47c8-913f-fa5928c1b4b8"), new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 15, 2, 48, 61, DateTimeKind.Local).AddTicks(1069), new DateTime(2024, 6, 8, 15, 2, 48, 61, DateTimeKind.Local).AddTicks(1070) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("564d0272-92c8-4108-82b2-0f98882058d4"), new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 15, 2, 48, 61, DateTimeKind.Local).AddTicks(1072), new DateTime(2024, 6, 8, 15, 2, 48, 61, DateTimeKind.Local).AddTicks(1073) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"), new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 15, 2, 48, 61, DateTimeKind.Local).AddTicks(1076), new DateTime(2024, 6, 8, 15, 2, 48, 61, DateTimeKind.Local).AddTicks(1076) });

            migrationBuilder.UpdateData(
                table: "trTask",
                keyColumn: "Id",
                keyValue: new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 15, 2, 48, 60, DateTimeKind.Local).AddTicks(9262), new DateTime(2024, 6, 8, 15, 2, 48, 60, DateTimeKind.Local).AddTicks(9266) });

            migrationBuilder.UpdateData(
                table: "trTask",
                keyColumn: "Id",
                keyValue: new Guid("4422cc3c-0ea5-4d73-a31e-a42485a81003"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 15, 2, 48, 60, DateTimeKind.Local).AddTicks(9286), new DateTime(2024, 6, 8, 15, 2, 48, 60, DateTimeKind.Local).AddTicks(9286) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("1a157bf0-4748-4589-91cc-1450e0c06596"), new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 15, 2, 48, 61, DateTimeKind.Local).AddTicks(4), new DateTime(2024, 6, 8, 15, 2, 48, 61, DateTimeKind.Local).AddTicks(8) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5"), new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 15, 2, 48, 61, DateTimeKind.Local).AddTicks(42), new DateTime(2024, 6, 8, 15, 2, 48, 61, DateTimeKind.Local).AddTicks(43) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911"), new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 15, 2, 48, 61, DateTimeKind.Local).AddTicks(46), new DateTime(2024, 6, 8, 15, 2, 48, 61, DateTimeKind.Local).AddTicks(47) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496"), new Guid("4422cc3c-0ea5-4d73-a31e-a42485a81003") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 15, 2, 48, 61, DateTimeKind.Local).AddTicks(49), new DateTime(2024, 6, 8, 15, 2, 48, 61, DateTimeKind.Local).AddTicks(50) });
        }
    }
}
