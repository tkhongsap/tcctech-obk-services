using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TCCTOBK.OperationBackend.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class FixMigrationMissing : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LocationType",
                table: "Location");

            migrationBuilder.DropColumn(
                name: "ParentLocationId",
                table: "Location");

            migrationBuilder.RenameColumn(
                name: "LocationName",
                table: "Location",
                newName: "Type");

            migrationBuilder.AddColumn<string>(
                name: "BuildingName",
                table: "Location",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "BuildingZoneName",
                table: "Location",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FloorName",
                table: "Location",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SiteName",
                table: "Location",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ZoneName",
                table: "Location",
                type: "text",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "Location",
                keyColumn: "LID",
                keyValue: new Guid("2c055101-2271-44e0-95fe-bcf2c59a459a"),
                columns: new[] { "BuildingName", "BuildingZoneName", "CreatedByName", "CreatedDate", "FloorName", "SiteName", "Type", "UpdatedByName", "UpdatedDate", "ZoneName" },
                values: new object[] { "O2", "O2T1", "System", new DateTime(2024, 8, 9, 14, 13, 19, 763, DateTimeKind.Local).AddTicks(1174), "1B", "OBK", "floor", "System", new DateTime(2024, 8, 9, 14, 13, 19, 763, DateTimeKind.Local).AddTicks(1178), "R1" });

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("4199e4de-bdf8-48f8-a8a8-a5b31756a748"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 9, 14, 13, 19, 757, DateTimeKind.Local).AddTicks(1088), new DateTime(2024, 8, 9, 14, 13, 19, 757, DateTimeKind.Local).AddTicks(6468) });

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("caa4ebec-15c8-4d6b-9985-6d6b66f94e63"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 9, 14, 13, 19, 757, DateTimeKind.Local).AddTicks(7019), new DateTime(2024, 8, 9, 14, 13, 19, 757, DateTimeKind.Local).AddTicks(7022) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc2"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 9, 14, 13, 19, 762, DateTimeKind.Local).AddTicks(984), new DateTime(2024, 7, 9, 14, 13, 19, 762, DateTimeKind.Local).AddTicks(1068) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc3"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 9, 14, 13, 19, 762, DateTimeKind.Local).AddTicks(1094), new DateTime(2024, 7, 9, 14, 13, 19, 762, DateTimeKind.Local).AddTicks(1095) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc4"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 9, 14, 13, 19, 762, DateTimeKind.Local).AddTicks(1098), new DateTime(2024, 7, 9, 14, 13, 19, 762, DateTimeKind.Local).AddTicks(1099) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc5"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 9, 14, 13, 19, 762, DateTimeKind.Local).AddTicks(1102), new DateTime(2024, 7, 9, 14, 13, 19, 762, DateTimeKind.Local).AddTicks(1103) });

            migrationBuilder.UpdateData(
                table: "mtShiftManPowerRequest",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedDate", "StartDateTime", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 9, 14, 13, 19, 764, DateTimeKind.Local).AddTicks(3231), new DateTime(2024, 7, 9, 14, 13, 19, 764, DateTimeKind.Local).AddTicks(2840), new DateTime(2024, 7, 9, 14, 13, 19, 764, DateTimeKind.Local).AddTicks(3235) });

            migrationBuilder.UpdateData(
                table: "mtShiftManPowerRequest",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedDate", "StartDateTime", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 9, 14, 13, 19, 764, DateTimeKind.Local).AddTicks(3256), new DateTime(2024, 7, 9, 14, 13, 19, 764, DateTimeKind.Local).AddTicks(3254), new DateTime(2024, 7, 9, 14, 13, 19, 764, DateTimeKind.Local).AddTicks(3257) });

            migrationBuilder.UpdateData(
                table: "mtShiftManPowerRequest",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedDate", "StartDateTime", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 9, 14, 13, 19, 764, DateTimeKind.Local).AddTicks(3261), new DateTime(2024, 7, 9, 14, 13, 19, 764, DateTimeKind.Local).AddTicks(3259), new DateTime(2024, 7, 9, 14, 13, 19, 764, DateTimeKind.Local).AddTicks(3262) });

            migrationBuilder.UpdateData(
                table: "mtShiftManPowerRequest",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedDate", "StartDateTime", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 9, 14, 13, 19, 764, DateTimeKind.Local).AddTicks(3265), new DateTime(2024, 7, 9, 14, 13, 19, 764, DateTimeKind.Local).AddTicks(3264), new DateTime(2024, 7, 9, 14, 13, 19, 764, DateTimeKind.Local).AddTicks(3266) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("2aa84ed4-a495-47c8-913f-fa5928c1b4b8"),
                columns: new[] { "CreatedDate", "MetaData", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 9, 14, 13, 19, 762, DateTimeKind.Local).AddTicks(2978), "{\"QrId\":\"Test1\"}", new DateTime(2024, 7, 9, 14, 13, 19, 762, DateTimeKind.Local).AddTicks(2983) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("3ff4f468-53ef-48a3-8781-61a8a053fa99"),
                columns: new[] { "CreatedDate", "MetaData", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 9, 14, 13, 19, 762, DateTimeKind.Local).AddTicks(3003), "{\"QrId\":\"Test2\"}", new DateTime(2024, 7, 9, 14, 13, 19, 762, DateTimeKind.Local).AddTicks(3005) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("564d0272-92c8-4108-82b2-0f98882058d4"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 9, 14, 13, 19, 762, DateTimeKind.Local).AddTicks(3009), new DateTime(2024, 7, 9, 14, 13, 19, 762, DateTimeKind.Local).AddTicks(3035) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 9, 14, 13, 19, 762, DateTimeKind.Local).AddTicks(3040), new DateTime(2024, 7, 9, 14, 13, 19, 762, DateTimeKind.Local).AddTicks(3041) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("c1cb273c-570a-42f5-b563-66bac08911cc"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 9, 14, 13, 19, 762, DateTimeKind.Local).AddTicks(3044), new DateTime(2024, 7, 9, 14, 13, 19, 762, DateTimeKind.Local).AddTicks(3045) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("c1cb273c-570a-42f5-b563-66bac08911cd"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 9, 14, 13, 19, 762, DateTimeKind.Local).AddTicks(3059), new DateTime(2024, 7, 9, 14, 13, 19, 762, DateTimeKind.Local).AddTicks(3060) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc1"),
                columns: new[] { "CreatedDate", "MetaData", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 9, 14, 13, 19, 762, DateTimeKind.Local).AddTicks(3054), "{\"QrId\":\"Test3\"}", new DateTime(2024, 7, 9, 14, 13, 19, 762, DateTimeKind.Local).AddTicks(3055) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("18a79217-9fa7-460d-bccc-e74285b07531"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 9, 14, 13, 19, 765, DateTimeKind.Local).AddTicks(2996), new DateTime(2024, 8, 9, 14, 13, 19, 765, DateTimeKind.Local).AddTicks(2996) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("f2cf879b-34f3-41da-9445-ee3bc590f224"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 9, 14, 13, 19, 765, DateTimeKind.Local).AddTicks(2999), new DateTime(2024, 8, 9, 14, 13, 19, 765, DateTimeKind.Local).AddTicks(3000) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("fcddbf6b-88b8-4fae-ade7-63150ce1f1ec"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 9, 14, 13, 19, 765, DateTimeKind.Local).AddTicks(2982), new DateTime(2024, 8, 9, 14, 13, 19, 765, DateTimeKind.Local).AddTicks(2987) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("1a157bf0-4748-4589-91cc-1450e0c06596"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 9, 14, 13, 19, 762, DateTimeKind.Local).AddTicks(4663), new DateTime(2024, 7, 9, 14, 13, 19, 762, DateTimeKind.Local).AddTicks(4664) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 9, 14, 13, 19, 762, DateTimeKind.Local).AddTicks(4696), new DateTime(2024, 7, 9, 14, 13, 19, 762, DateTimeKind.Local).AddTicks(4697) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("3fa85f64-5717-4562-b3fc-2c963f66afa6"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 9, 14, 13, 19, 762, DateTimeKind.Local).AddTicks(4691), new DateTime(2024, 7, 9, 14, 13, 19, 762, DateTimeKind.Local).AddTicks(4692) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 9, 14, 13, 19, 762, DateTimeKind.Local).AddTicks(4632), new DateTime(2024, 7, 9, 14, 13, 19, 762, DateTimeKind.Local).AddTicks(4636) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 9, 14, 13, 19, 762, DateTimeKind.Local).AddTicks(4658), new DateTime(2024, 7, 9, 14, 13, 19, 762, DateTimeKind.Local).AddTicks(4660) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("3ff4f468-53ef-48a3-8781-61a8a053fa99"), new Guid("1a157bf0-4748-4589-91cc-1450e0c06596") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 9, 14, 13, 19, 762, DateTimeKind.Local).AddTicks(8866), new DateTime(2024, 7, 9, 14, 13, 19, 762, DateTimeKind.Local).AddTicks(8869) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("564d0272-92c8-4108-82b2-0f98882058d4"), new Guid("1a157bf0-4748-4589-91cc-1450e0c06596") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 9, 14, 13, 19, 762, DateTimeKind.Local).AddTicks(8889), new DateTime(2024, 7, 9, 14, 13, 19, 762, DateTimeKind.Local).AddTicks(8890) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"), new Guid("1a157bf0-4748-4589-91cc-1450e0c06596") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 9, 14, 13, 19, 762, DateTimeKind.Local).AddTicks(8893), new DateTime(2024, 7, 9, 14, 13, 19, 762, DateTimeKind.Local).AddTicks(8894) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("564d0272-92c8-4108-82b2-0f98882058d4"), new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 9, 14, 13, 19, 762, DateTimeKind.Local).AddTicks(8897), new DateTime(2024, 7, 9, 14, 13, 19, 762, DateTimeKind.Local).AddTicks(8898) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"), new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 9, 14, 13, 19, 762, DateTimeKind.Local).AddTicks(8901), new DateTime(2024, 7, 9, 14, 13, 19, 762, DateTimeKind.Local).AddTicks(8902) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("e8eb7171-de01-4a85-a955-711b211eecc1"), new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 9, 14, 13, 19, 762, DateTimeKind.Local).AddTicks(8908), new DateTime(2024, 7, 9, 14, 13, 19, 762, DateTimeKind.Local).AddTicks(8910) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("c1cb273c-570a-42f5-b563-66bac08911cc"), new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 9, 14, 13, 19, 762, DateTimeKind.Local).AddTicks(8947), new DateTime(2024, 7, 9, 14, 13, 19, 762, DateTimeKind.Local).AddTicks(8948) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("c1cb273c-570a-42f5-b563-66bac08911cd"), new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 9, 14, 13, 19, 762, DateTimeKind.Local).AddTicks(8951), new DateTime(2024, 7, 9, 14, 13, 19, 762, DateTimeKind.Local).AddTicks(8952) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("2aa84ed4-a495-47c8-913f-fa5928c1b4b8"), new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 9, 14, 13, 19, 762, DateTimeKind.Local).AddTicks(8932), new DateTime(2024, 7, 9, 14, 13, 19, 762, DateTimeKind.Local).AddTicks(8933) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("564d0272-92c8-4108-82b2-0f98882058d4"), new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 9, 14, 13, 19, 762, DateTimeKind.Local).AddTicks(8936), new DateTime(2024, 7, 9, 14, 13, 19, 762, DateTimeKind.Local).AddTicks(8938) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"), new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 9, 14, 13, 19, 762, DateTimeKind.Local).AddTicks(8941), new DateTime(2024, 7, 9, 14, 13, 19, 762, DateTimeKind.Local).AddTicks(8942) });

            migrationBuilder.UpdateData(
                table: "trTask",
                keyColumn: "Id",
                keyValue: new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 9, 14, 13, 19, 762, DateTimeKind.Local).AddTicks(6753), new DateTime(2024, 7, 9, 14, 13, 19, 762, DateTimeKind.Local).AddTicks(6757) });

            migrationBuilder.UpdateData(
                table: "trTask",
                keyColumn: "Id",
                keyValue: new Guid("4422cc3c-0ea5-4d73-a31e-a42485a81003"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 9, 14, 13, 19, 762, DateTimeKind.Local).AddTicks(6781), new DateTime(2024, 7, 9, 14, 13, 19, 762, DateTimeKind.Local).AddTicks(6782) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("1a157bf0-4748-4589-91cc-1450e0c06596"), new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 9, 14, 13, 19, 762, DateTimeKind.Local).AddTicks(7665), new DateTime(2024, 7, 9, 14, 13, 19, 762, DateTimeKind.Local).AddTicks(7669) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5"), new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 9, 14, 13, 19, 762, DateTimeKind.Local).AddTicks(7687), new DateTime(2024, 7, 9, 14, 13, 19, 762, DateTimeKind.Local).AddTicks(7688) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911"), new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 9, 14, 13, 19, 762, DateTimeKind.Local).AddTicks(7691), new DateTime(2024, 7, 9, 14, 13, 19, 762, DateTimeKind.Local).AddTicks(7692) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496"), new Guid("4422cc3c-0ea5-4d73-a31e-a42485a81003") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 9, 14, 13, 19, 762, DateTimeKind.Local).AddTicks(7718), new DateTime(2024, 7, 9, 14, 13, 19, 762, DateTimeKind.Local).AddTicks(7719) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BuildingName",
                table: "Location");

            migrationBuilder.DropColumn(
                name: "BuildingZoneName",
                table: "Location");

            migrationBuilder.DropColumn(
                name: "FloorName",
                table: "Location");

            migrationBuilder.DropColumn(
                name: "SiteName",
                table: "Location");

            migrationBuilder.DropColumn(
                name: "ZoneName",
                table: "Location");

            migrationBuilder.RenameColumn(
                name: "Type",
                table: "Location",
                newName: "LocationName");

            migrationBuilder.AddColumn<int>(
                name: "LocationType",
                table: "Location",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<Guid>(
                name: "ParentLocationId",
                table: "Location",
                type: "uuid",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "Location",
                keyColumn: "LID",
                keyValue: new Guid("2c055101-2271-44e0-95fe-bcf2c59a459a"),
                columns: new[] { "CreatedByName", "CreatedDate", "LocationName", "LocationType", "ParentLocationId", "UpdatedByName", "UpdatedDate" },
                values: new object[] { "system", new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(9377), "Location 1", 1, null, "system", new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(9381) });

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("4199e4de-bdf8-48f8-a8a8-a5b31756a748"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 27, 22, 22, 54, 835, DateTimeKind.Local).AddTicks(2255), new DateTime(2024, 7, 27, 22, 22, 54, 835, DateTimeKind.Local).AddTicks(6167) });

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("caa4ebec-15c8-4d6b-9985-6d6b66f94e63"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 27, 22, 22, 54, 835, DateTimeKind.Local).AddTicks(6606), new DateTime(2024, 7, 27, 22, 22, 54, 835, DateTimeKind.Local).AddTicks(6609) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc2"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(1825), new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(1912) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc3"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(1934), new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(1935) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc4"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(1937), new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(1938) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc5"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(1939), new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(1940) });

            migrationBuilder.UpdateData(
                table: "mtShiftManPowerRequest",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedDate", "StartDateTime", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 27, 22, 22, 54, 840, DateTimeKind.Local).AddTicks(9522), new DateTime(2024, 6, 27, 22, 22, 54, 840, DateTimeKind.Local).AddTicks(9200), new DateTime(2024, 6, 27, 22, 22, 54, 840, DateTimeKind.Local).AddTicks(9526) });

            migrationBuilder.UpdateData(
                table: "mtShiftManPowerRequest",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedDate", "StartDateTime", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 27, 22, 22, 54, 840, DateTimeKind.Local).AddTicks(9542), new DateTime(2024, 6, 27, 22, 22, 54, 840, DateTimeKind.Local).AddTicks(9541), new DateTime(2024, 6, 27, 22, 22, 54, 840, DateTimeKind.Local).AddTicks(9543) });

            migrationBuilder.UpdateData(
                table: "mtShiftManPowerRequest",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedDate", "StartDateTime", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 27, 22, 22, 54, 840, DateTimeKind.Local).AddTicks(9545), new DateTime(2024, 6, 27, 22, 22, 54, 840, DateTimeKind.Local).AddTicks(9544), new DateTime(2024, 6, 27, 22, 22, 54, 840, DateTimeKind.Local).AddTicks(9546) });

            migrationBuilder.UpdateData(
                table: "mtShiftManPowerRequest",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedDate", "StartDateTime", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 27, 22, 22, 54, 840, DateTimeKind.Local).AddTicks(9549), new DateTime(2024, 6, 27, 22, 22, 54, 840, DateTimeKind.Local).AddTicks(9548), new DateTime(2024, 6, 27, 22, 22, 54, 840, DateTimeKind.Local).AddTicks(9549) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("2aa84ed4-a495-47c8-913f-fa5928c1b4b8"),
                columns: new[] { "CreatedDate", "MetaData", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(3360), null, new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(3365) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("3ff4f468-53ef-48a3-8781-61a8a053fa99"),
                columns: new[] { "CreatedDate", "MetaData", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(3382), null, new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(3383) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("564d0272-92c8-4108-82b2-0f98882058d4"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(3386), new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(3406) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(3409), new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(3410) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("c1cb273c-570a-42f5-b563-66bac08911cc"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(3412), new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(3413) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("c1cb273c-570a-42f5-b563-66bac08911cd"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(3426), new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(3427) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc1"),
                columns: new[] { "CreatedDate", "MetaData", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(3423), null, new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(3424) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("18a79217-9fa7-460d-bccc-e74285b07531"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 27, 22, 22, 54, 841, DateTimeKind.Local).AddTicks(8009), new DateTime(2024, 7, 27, 22, 22, 54, 841, DateTimeKind.Local).AddTicks(8010) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("f2cf879b-34f3-41da-9445-ee3bc590f224"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 27, 22, 22, 54, 841, DateTimeKind.Local).AddTicks(8012), new DateTime(2024, 7, 27, 22, 22, 54, 841, DateTimeKind.Local).AddTicks(8012) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("fcddbf6b-88b8-4fae-ade7-63150ce1f1ec"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 27, 22, 22, 54, 841, DateTimeKind.Local).AddTicks(7998), new DateTime(2024, 7, 27, 22, 22, 54, 841, DateTimeKind.Local).AddTicks(8002) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("1a157bf0-4748-4589-91cc-1450e0c06596"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(4693), new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(4693) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(4717), new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(4718) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("3fa85f64-5717-4562-b3fc-2c963f66afa6"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(4714), new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(4715) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(4669), new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(4673) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(4689), new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(4690) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("3ff4f468-53ef-48a3-8781-61a8a053fa99"), new Guid("1a157bf0-4748-4589-91cc-1450e0c06596") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(7833), new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(7836) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("564d0272-92c8-4108-82b2-0f98882058d4"), new Guid("1a157bf0-4748-4589-91cc-1450e0c06596") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(7891), new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(7892) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"), new Guid("1a157bf0-4748-4589-91cc-1450e0c06596") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(7895), new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(7895) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("564d0272-92c8-4108-82b2-0f98882058d4"), new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(7898), new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(7899) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"), new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(7901), new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(7902) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("e8eb7171-de01-4a85-a955-711b211eecc1"), new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(7907), new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(7908) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("c1cb273c-570a-42f5-b563-66bac08911cc"), new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(7933), new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(7933) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("c1cb273c-570a-42f5-b563-66bac08911cd"), new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(7936), new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(7937) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("2aa84ed4-a495-47c8-913f-fa5928c1b4b8"), new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(7921), new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(7922) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("564d0272-92c8-4108-82b2-0f98882058d4"), new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(7925), new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(7926) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"), new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(7928), new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(7929) });

            migrationBuilder.UpdateData(
                table: "trTask",
                keyColumn: "Id",
                keyValue: new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(6146), new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(6150) });

            migrationBuilder.UpdateData(
                table: "trTask",
                keyColumn: "Id",
                keyValue: new Guid("4422cc3c-0ea5-4d73-a31e-a42485a81003"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(6167), new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(6168) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("1a157bf0-4748-4589-91cc-1450e0c06596"), new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(6895), new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(6898) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5"), new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(6915), new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(6916) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911"), new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(6918), new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(6919) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496"), new Guid("4422cc3c-0ea5-4d73-a31e-a42485a81003") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(6938), new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(6939) });
        }
    }
}
