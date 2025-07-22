using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TCCTOBK.OperationBackend.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class ModifyForeignKeyTaskTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Location",
                columns: new[] { "LID", "CreatedBy", "CreatedByName", "CreatedDate", "LocationName", "LocationType", "ParentLocationId", "UpdatedBy", "UpdatedByName", "UpdatedDate" },
                values: new object[] { new Guid("2c055101-2271-44e0-95fe-bcf2c59a459a"), "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 6, 8, 15, 2, 48, 61, DateTimeKind.Local).AddTicks(2628), "Location 1", 1, null, "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 6, 8, 15, 2, 48, 61, DateTimeKind.Local).AddTicks(2632) });

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
                columns: new[] { "CreatedDate", "LocationId", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 15, 2, 48, 60, DateTimeKind.Local).AddTicks(9262), new Guid("2c055101-2271-44e0-95fe-bcf2c59a459a"), new DateTime(2024, 6, 8, 15, 2, 48, 60, DateTimeKind.Local).AddTicks(9266) });

            migrationBuilder.UpdateData(
                table: "trTask",
                keyColumn: "Id",
                keyValue: new Guid("4422cc3c-0ea5-4d73-a31e-a42485a81003"),
                columns: new[] { "CreatedDate", "LocationId", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 15, 2, 48, 60, DateTimeKind.Local).AddTicks(9286), new Guid("2c055101-2271-44e0-95fe-bcf2c59a459a"), new DateTime(2024, 6, 8, 15, 2, 48, 60, DateTimeKind.Local).AddTicks(9286) });

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

            migrationBuilder.CreateIndex(
                name: "IX_trTask_LocationId",
                table: "trTask",
                column: "LocationId");

            migrationBuilder.AddForeignKey(
                name: "FK_trTask_Location_LocationId",
                table: "trTask",
                column: "LocationId",
                principalTable: "Location",
                principalColumn: "LID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_trTask_Location_LocationId",
                table: "trTask");

            migrationBuilder.DropIndex(
                name: "IX_trTask_LocationId",
                table: "trTask");

            migrationBuilder.DeleteData(
                table: "Location",
                keyColumn: "LID",
                keyValue: new Guid("2c055101-2271-44e0-95fe-bcf2c59a459a"));

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

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc2"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 11, 5, 31, 719, DateTimeKind.Local).AddTicks(5555), new DateTime(2024, 6, 8, 11, 5, 31, 719, DateTimeKind.Local).AddTicks(5630) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc3"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 11, 5, 31, 719, DateTimeKind.Local).AddTicks(5655), new DateTime(2024, 6, 8, 11, 5, 31, 719, DateTimeKind.Local).AddTicks(5656) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc4"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 11, 5, 31, 719, DateTimeKind.Local).AddTicks(5659), new DateTime(2024, 6, 8, 11, 5, 31, 719, DateTimeKind.Local).AddTicks(5660) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("2aa84ed4-a495-47c8-913f-fa5928c1b4b8"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 11, 5, 31, 719, DateTimeKind.Local).AddTicks(7511), new DateTime(2024, 6, 8, 11, 5, 31, 719, DateTimeKind.Local).AddTicks(7538) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("3ff4f468-53ef-48a3-8781-61a8a053fa99"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 11, 5, 31, 719, DateTimeKind.Local).AddTicks(7559), new DateTime(2024, 6, 8, 11, 5, 31, 719, DateTimeKind.Local).AddTicks(7560) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("564d0272-92c8-4108-82b2-0f98882058d4"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 11, 5, 31, 719, DateTimeKind.Local).AddTicks(7563), new DateTime(2024, 6, 8, 11, 5, 31, 719, DateTimeKind.Local).AddTicks(7564) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 11, 5, 31, 719, DateTimeKind.Local).AddTicks(7567), new DateTime(2024, 6, 8, 11, 5, 31, 719, DateTimeKind.Local).AddTicks(7568) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("c1cb273c-570a-42f5-b563-66bac08911cc"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 11, 5, 31, 719, DateTimeKind.Local).AddTicks(7571), new DateTime(2024, 6, 8, 11, 5, 31, 719, DateTimeKind.Local).AddTicks(7572) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc1"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 11, 5, 31, 719, DateTimeKind.Local).AddTicks(7579), new DateTime(2024, 6, 8, 11, 5, 31, 719, DateTimeKind.Local).AddTicks(7580) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("1a157bf0-4748-4589-91cc-1450e0c06596"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 11, 5, 31, 719, DateTimeKind.Local).AddTicks(9029), new DateTime(2024, 6, 8, 11, 5, 31, 719, DateTimeKind.Local).AddTicks(9030) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 11, 5, 31, 719, DateTimeKind.Local).AddTicks(9037), new DateTime(2024, 6, 8, 11, 5, 31, 719, DateTimeKind.Local).AddTicks(9038) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("3fa85f64-5717-4562-b3fc-2c963f66afa6"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 11, 5, 31, 719, DateTimeKind.Local).AddTicks(9033), new DateTime(2024, 6, 8, 11, 5, 31, 719, DateTimeKind.Local).AddTicks(9034) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 11, 5, 31, 719, DateTimeKind.Local).AddTicks(8981), new DateTime(2024, 6, 8, 11, 5, 31, 719, DateTimeKind.Local).AddTicks(8985) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 11, 5, 31, 719, DateTimeKind.Local).AddTicks(9005), new DateTime(2024, 6, 8, 11, 5, 31, 719, DateTimeKind.Local).AddTicks(9026) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("3ff4f468-53ef-48a3-8781-61a8a053fa99"), new Guid("1a157bf0-4748-4589-91cc-1450e0c06596") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 11, 5, 31, 720, DateTimeKind.Local).AddTicks(2548), new DateTime(2024, 6, 8, 11, 5, 31, 720, DateTimeKind.Local).AddTicks(2552) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("564d0272-92c8-4108-82b2-0f98882058d4"), new Guid("1a157bf0-4748-4589-91cc-1450e0c06596") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 11, 5, 31, 720, DateTimeKind.Local).AddTicks(2570), new DateTime(2024, 6, 8, 11, 5, 31, 720, DateTimeKind.Local).AddTicks(2571) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"), new Guid("1a157bf0-4748-4589-91cc-1450e0c06596") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 11, 5, 31, 720, DateTimeKind.Local).AddTicks(2574), new DateTime(2024, 6, 8, 11, 5, 31, 720, DateTimeKind.Local).AddTicks(2576) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("564d0272-92c8-4108-82b2-0f98882058d4"), new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 11, 5, 31, 720, DateTimeKind.Local).AddTicks(2578), new DateTime(2024, 6, 8, 11, 5, 31, 720, DateTimeKind.Local).AddTicks(2579) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"), new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 11, 5, 31, 720, DateTimeKind.Local).AddTicks(2582), new DateTime(2024, 6, 8, 11, 5, 31, 720, DateTimeKind.Local).AddTicks(2583) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("e8eb7171-de01-4a85-a955-711b211eecc1"), new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 11, 5, 31, 720, DateTimeKind.Local).AddTicks(2589), new DateTime(2024, 6, 8, 11, 5, 31, 720, DateTimeKind.Local).AddTicks(2590) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("c1cb273c-570a-42f5-b563-66bac08911cc"), new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 11, 5, 31, 720, DateTimeKind.Local).AddTicks(2605), new DateTime(2024, 6, 8, 11, 5, 31, 720, DateTimeKind.Local).AddTicks(2606) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("2aa84ed4-a495-47c8-913f-fa5928c1b4b8"), new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 11, 5, 31, 720, DateTimeKind.Local).AddTicks(2593), new DateTime(2024, 6, 8, 11, 5, 31, 720, DateTimeKind.Local).AddTicks(2594) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("564d0272-92c8-4108-82b2-0f98882058d4"), new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 11, 5, 31, 720, DateTimeKind.Local).AddTicks(2596), new DateTime(2024, 6, 8, 11, 5, 31, 720, DateTimeKind.Local).AddTicks(2597) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"), new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 11, 5, 31, 720, DateTimeKind.Local).AddTicks(2600), new DateTime(2024, 6, 8, 11, 5, 31, 720, DateTimeKind.Local).AddTicks(2601) });

            migrationBuilder.UpdateData(
                table: "trTask",
                keyColumn: "Id",
                keyValue: new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b"),
                columns: new[] { "CreatedDate", "LocationId", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 11, 5, 31, 720, DateTimeKind.Local).AddTicks(512), new Guid("00000000-0000-0000-0000-000000000000"), new DateTime(2024, 6, 8, 11, 5, 31, 720, DateTimeKind.Local).AddTicks(516) });

            migrationBuilder.UpdateData(
                table: "trTask",
                keyColumn: "Id",
                keyValue: new Guid("4422cc3c-0ea5-4d73-a31e-a42485a81003"),
                columns: new[] { "CreatedDate", "LocationId", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 11, 5, 31, 720, DateTimeKind.Local).AddTicks(537), new Guid("00000000-0000-0000-0000-000000000000"), new DateTime(2024, 6, 8, 11, 5, 31, 720, DateTimeKind.Local).AddTicks(538) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("1a157bf0-4748-4589-91cc-1450e0c06596"), new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 11, 5, 31, 720, DateTimeKind.Local).AddTicks(1389), new DateTime(2024, 6, 8, 11, 5, 31, 720, DateTimeKind.Local).AddTicks(1394) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5"), new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 11, 5, 31, 720, DateTimeKind.Local).AddTicks(1412), new DateTime(2024, 6, 8, 11, 5, 31, 720, DateTimeKind.Local).AddTicks(1413) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911"), new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 11, 5, 31, 720, DateTimeKind.Local).AddTicks(1435), new DateTime(2024, 6, 8, 11, 5, 31, 720, DateTimeKind.Local).AddTicks(1436) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496"), new Guid("4422cc3c-0ea5-4d73-a31e-a42485a81003") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 11, 5, 31, 720, DateTimeKind.Local).AddTicks(1439), new DateTime(2024, 6, 8, 11, 5, 31, 720, DateTimeKind.Local).AddTicks(1440) });
        }
    }
}
