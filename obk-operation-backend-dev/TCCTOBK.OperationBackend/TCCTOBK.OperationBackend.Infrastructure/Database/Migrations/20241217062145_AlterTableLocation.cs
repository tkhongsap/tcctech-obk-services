using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TCCTOBK.OperationBackend.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class AlterTableLocation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Location",
                keyColumn: "LID",
                keyValue: new Guid("2c055101-2271-44e0-95fe-bcf2c59a459a"));

            migrationBuilder.AlterColumn<string>(
                name: "Type",
                table: "Location",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AddColumn<string>(
                name: "LocationCode",
                table: "Location",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "ParentLocationId",
                table: "Location",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "RefId",
                table: "Location",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Space",
                table: "Location",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Subspace",
                table: "Location",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TypeId",
                table: "Location",
                type: "integer",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("4199e4de-bdf8-48f8-a8a8-a5b31756a748"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 12, 17, 13, 21, 44, 947, DateTimeKind.Local).AddTicks(4230), new DateTime(2024, 12, 17, 13, 21, 44, 955, DateTimeKind.Local).AddTicks(3610) });

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("caa4ebec-15c8-4d6b-9985-6d6b66f94e63"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 12, 17, 13, 21, 44, 955, DateTimeKind.Local).AddTicks(3830), new DateTime(2024, 12, 17, 13, 21, 44, 955, DateTimeKind.Local).AddTicks(3830) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc2"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 11, 17, 13, 21, 44, 958, DateTimeKind.Local).AddTicks(350), new DateTime(2024, 11, 17, 13, 21, 44, 958, DateTimeKind.Local).AddTicks(370) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc3"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 11, 17, 13, 21, 44, 958, DateTimeKind.Local).AddTicks(380), new DateTime(2024, 11, 17, 13, 21, 44, 958, DateTimeKind.Local).AddTicks(380) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc4"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 11, 17, 13, 21, 44, 958, DateTimeKind.Local).AddTicks(390), new DateTime(2024, 11, 17, 13, 21, 44, 958, DateTimeKind.Local).AddTicks(390) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc5"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 11, 17, 13, 21, 44, 958, DateTimeKind.Local).AddTicks(390), new DateTime(2024, 11, 17, 13, 21, 44, 958, DateTimeKind.Local).AddTicks(390) });

            migrationBuilder.UpdateData(
                table: "mtShiftManPowerRequest",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedDate", "StartDateTime", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 11, 17, 13, 21, 44, 958, DateTimeKind.Local).AddTicks(8240), new DateTime(2024, 11, 17, 13, 21, 44, 958, DateTimeKind.Local).AddTicks(8100), new DateTime(2024, 11, 17, 13, 21, 44, 958, DateTimeKind.Local).AddTicks(8240) });

            migrationBuilder.UpdateData(
                table: "mtShiftManPowerRequest",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedDate", "StartDateTime", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 11, 17, 13, 21, 44, 958, DateTimeKind.Local).AddTicks(8250), new DateTime(2024, 11, 17, 13, 21, 44, 958, DateTimeKind.Local).AddTicks(8250), new DateTime(2024, 11, 17, 13, 21, 44, 958, DateTimeKind.Local).AddTicks(8250) });

            migrationBuilder.UpdateData(
                table: "mtShiftManPowerRequest",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedDate", "StartDateTime", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 11, 17, 13, 21, 44, 958, DateTimeKind.Local).AddTicks(8250), new DateTime(2024, 11, 17, 13, 21, 44, 958, DateTimeKind.Local).AddTicks(8250), new DateTime(2024, 11, 17, 13, 21, 44, 958, DateTimeKind.Local).AddTicks(8260) });

            migrationBuilder.UpdateData(
                table: "mtShiftManPowerRequest",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedDate", "StartDateTime", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 11, 17, 13, 21, 44, 958, DateTimeKind.Local).AddTicks(8260), new DateTime(2024, 11, 17, 13, 21, 44, 958, DateTimeKind.Local).AddTicks(8260), new DateTime(2024, 11, 17, 13, 21, 44, 958, DateTimeKind.Local).AddTicks(8260) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("2aa84ed4-a495-47c8-913f-fa5928c1b4b8"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 11, 17, 13, 21, 44, 958, DateTimeKind.Local).AddTicks(1080), new DateTime(2024, 11, 17, 13, 21, 44, 958, DateTimeKind.Local).AddTicks(1080) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("3ff4f468-53ef-48a3-8781-61a8a053fa99"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 11, 17, 13, 21, 44, 958, DateTimeKind.Local).AddTicks(1090), new DateTime(2024, 11, 17, 13, 21, 44, 958, DateTimeKind.Local).AddTicks(1090) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("564d0272-92c8-4108-82b2-0f98882058d4"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 11, 17, 13, 21, 44, 958, DateTimeKind.Local).AddTicks(1110), new DateTime(2024, 11, 17, 13, 21, 44, 958, DateTimeKind.Local).AddTicks(1110) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 11, 17, 13, 21, 44, 958, DateTimeKind.Local).AddTicks(1120), new DateTime(2024, 11, 17, 13, 21, 44, 958, DateTimeKind.Local).AddTicks(1120) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("c1cb273c-570a-42f5-b563-66bac08911cc"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 11, 17, 13, 21, 44, 958, DateTimeKind.Local).AddTicks(1120), new DateTime(2024, 11, 17, 13, 21, 44, 958, DateTimeKind.Local).AddTicks(1120) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("c1cb273c-570a-42f5-b563-66bac08911cd"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 11, 17, 13, 21, 44, 958, DateTimeKind.Local).AddTicks(1130), new DateTime(2024, 11, 17, 13, 21, 44, 958, DateTimeKind.Local).AddTicks(1130) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc1"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 11, 17, 13, 21, 44, 958, DateTimeKind.Local).AddTicks(1120), new DateTime(2024, 11, 17, 13, 21, 44, 958, DateTimeKind.Local).AddTicks(1120) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("18a79217-9fa7-460d-bccc-e74285b07531"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 12, 17, 13, 21, 44, 959, DateTimeKind.Local).AddTicks(4240), new DateTime(2024, 12, 17, 13, 21, 44, 959, DateTimeKind.Local).AddTicks(4240) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("bd69a88e-d6c1-42a1-8a3a-628843459909"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 12, 17, 13, 21, 44, 959, DateTimeKind.Local).AddTicks(4250), new DateTime(2024, 12, 17, 13, 21, 44, 959, DateTimeKind.Local).AddTicks(4250) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("c01c5086-cfa5-44ca-89d7-baa2c1accea6"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 12, 17, 13, 21, 44, 959, DateTimeKind.Local).AddTicks(4250), new DateTime(2024, 12, 17, 13, 21, 44, 959, DateTimeKind.Local).AddTicks(4250) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("d6016437-8b0f-4b0e-8175-5a11ffc480f5"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 12, 17, 13, 21, 44, 959, DateTimeKind.Local).AddTicks(4240), new DateTime(2024, 12, 17, 13, 21, 44, 959, DateTimeKind.Local).AddTicks(4240) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("f2cf879b-34f3-41da-9445-ee3bc590f224"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 12, 17, 13, 21, 44, 959, DateTimeKind.Local).AddTicks(4240), new DateTime(2024, 12, 17, 13, 21, 44, 959, DateTimeKind.Local).AddTicks(4240) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("fcddbf6b-88b8-4fae-ade7-63150ce1f1ec"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 12, 17, 13, 21, 44, 959, DateTimeKind.Local).AddTicks(4230), new DateTime(2024, 12, 17, 13, 21, 44, 959, DateTimeKind.Local).AddTicks(4230) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("1a157bf0-4748-4589-91cc-1450e0c06596"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 11, 17, 13, 21, 44, 958, DateTimeKind.Local).AddTicks(1770), new DateTime(2024, 11, 17, 13, 21, 44, 958, DateTimeKind.Local).AddTicks(1770) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 11, 17, 13, 21, 44, 958, DateTimeKind.Local).AddTicks(1780), new DateTime(2024, 11, 17, 13, 21, 44, 958, DateTimeKind.Local).AddTicks(1780) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("3fa85f64-5717-4562-b3fc-2c963f66afa6"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 11, 17, 13, 21, 44, 958, DateTimeKind.Local).AddTicks(1770), new DateTime(2024, 11, 17, 13, 21, 44, 958, DateTimeKind.Local).AddTicks(1780) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 11, 17, 13, 21, 44, 958, DateTimeKind.Local).AddTicks(1760), new DateTime(2024, 11, 17, 13, 21, 44, 958, DateTimeKind.Local).AddTicks(1760) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 11, 17, 13, 21, 44, 958, DateTimeKind.Local).AddTicks(1770), new DateTime(2024, 11, 17, 13, 21, 44, 958, DateTimeKind.Local).AddTicks(1770) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("3ff4f468-53ef-48a3-8781-61a8a053fa99"), new Guid("1a157bf0-4748-4589-91cc-1450e0c06596") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 11, 17, 13, 21, 44, 958, DateTimeKind.Local).AddTicks(3220), new DateTime(2024, 11, 17, 13, 21, 44, 958, DateTimeKind.Local).AddTicks(3220) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("564d0272-92c8-4108-82b2-0f98882058d4"), new Guid("1a157bf0-4748-4589-91cc-1450e0c06596") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 11, 17, 13, 21, 44, 958, DateTimeKind.Local).AddTicks(3230), new DateTime(2024, 11, 17, 13, 21, 44, 958, DateTimeKind.Local).AddTicks(3230) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"), new Guid("1a157bf0-4748-4589-91cc-1450e0c06596") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 11, 17, 13, 21, 44, 958, DateTimeKind.Local).AddTicks(3230), new DateTime(2024, 11, 17, 13, 21, 44, 958, DateTimeKind.Local).AddTicks(3230) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("564d0272-92c8-4108-82b2-0f98882058d4"), new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 11, 17, 13, 21, 44, 958, DateTimeKind.Local).AddTicks(3240), new DateTime(2024, 11, 17, 13, 21, 44, 958, DateTimeKind.Local).AddTicks(3240) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"), new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 11, 17, 13, 21, 44, 958, DateTimeKind.Local).AddTicks(3240), new DateTime(2024, 11, 17, 13, 21, 44, 958, DateTimeKind.Local).AddTicks(3240) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("e8eb7171-de01-4a85-a955-711b211eecc1"), new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 11, 17, 13, 21, 44, 958, DateTimeKind.Local).AddTicks(3240), new DateTime(2024, 11, 17, 13, 21, 44, 958, DateTimeKind.Local).AddTicks(3240) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("c1cb273c-570a-42f5-b563-66bac08911cc"), new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 11, 17, 13, 21, 44, 958, DateTimeKind.Local).AddTicks(3250), new DateTime(2024, 11, 17, 13, 21, 44, 958, DateTimeKind.Local).AddTicks(3250) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("c1cb273c-570a-42f5-b563-66bac08911cd"), new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 11, 17, 13, 21, 44, 958, DateTimeKind.Local).AddTicks(3260), new DateTime(2024, 11, 17, 13, 21, 44, 958, DateTimeKind.Local).AddTicks(3260) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("2aa84ed4-a495-47c8-913f-fa5928c1b4b8"), new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 11, 17, 13, 21, 44, 958, DateTimeKind.Local).AddTicks(3240), new DateTime(2024, 11, 17, 13, 21, 44, 958, DateTimeKind.Local).AddTicks(3250) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("564d0272-92c8-4108-82b2-0f98882058d4"), new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 11, 17, 13, 21, 44, 958, DateTimeKind.Local).AddTicks(3250), new DateTime(2024, 11, 17, 13, 21, 44, 958, DateTimeKind.Local).AddTicks(3250) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"), new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 11, 17, 13, 21, 44, 958, DateTimeKind.Local).AddTicks(3250), new DateTime(2024, 11, 17, 13, 21, 44, 958, DateTimeKind.Local).AddTicks(3250) });

            migrationBuilder.UpdateData(
                table: "trTask",
                keyColumn: "Id",
                keyValue: new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 11, 17, 13, 21, 44, 958, DateTimeKind.Local).AddTicks(2410), new DateTime(2024, 11, 17, 13, 21, 44, 958, DateTimeKind.Local).AddTicks(2410) });

            migrationBuilder.UpdateData(
                table: "trTask",
                keyColumn: "Id",
                keyValue: new Guid("4422cc3c-0ea5-4d73-a31e-a42485a81003"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 11, 17, 13, 21, 44, 958, DateTimeKind.Local).AddTicks(2420), new DateTime(2024, 11, 17, 13, 21, 44, 958, DateTimeKind.Local).AddTicks(2420) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("1a157bf0-4748-4589-91cc-1450e0c06596"), new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 11, 17, 13, 21, 44, 958, DateTimeKind.Local).AddTicks(2760), new DateTime(2024, 11, 17, 13, 21, 44, 958, DateTimeKind.Local).AddTicks(2760) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5"), new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 11, 17, 13, 21, 44, 958, DateTimeKind.Local).AddTicks(2760), new DateTime(2024, 11, 17, 13, 21, 44, 958, DateTimeKind.Local).AddTicks(2760) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911"), new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 11, 17, 13, 21, 44, 958, DateTimeKind.Local).AddTicks(2770), new DateTime(2024, 11, 17, 13, 21, 44, 958, DateTimeKind.Local).AddTicks(2770) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496"), new Guid("4422cc3c-0ea5-4d73-a31e-a42485a81003") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 11, 17, 13, 21, 44, 958, DateTimeKind.Local).AddTicks(2770), new DateTime(2024, 11, 17, 13, 21, 44, 958, DateTimeKind.Local).AddTicks(2770) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LocationCode",
                table: "Location");

            migrationBuilder.DropColumn(
                name: "ParentLocationId",
                table: "Location");

            migrationBuilder.DropColumn(
                name: "RefId",
                table: "Location");

            migrationBuilder.DropColumn(
                name: "Space",
                table: "Location");

            migrationBuilder.DropColumn(
                name: "Subspace",
                table: "Location");

            migrationBuilder.DropColumn(
                name: "TypeId",
                table: "Location");

            migrationBuilder.AlterColumn<string>(
                name: "Type",
                table: "Location",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.InsertData(
                table: "Location",
                columns: new[] { "LID", "BuildingName", "BuildingZoneName", "CreatedBy", "CreatedByName", "CreatedDate", "FloorName", "SiteName", "Type", "UpdatedBy", "UpdatedByName", "UpdatedDate", "ZoneName" },
                values: new object[] { new Guid("2c055101-2271-44e0-95fe-bcf2c59a459a"), "O2", "O2T1", "00000000-0000-0000-0000-000000000000", "System", new DateTime(2024, 11, 25, 18, 41, 35, 859, DateTimeKind.Local).AddTicks(1691), "1B", "OBK", "floor", "00000000-0000-0000-0000-000000000000", "System", new DateTime(2024, 11, 25, 18, 41, 35, 859, DateTimeKind.Local).AddTicks(1695), "R1" });

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("4199e4de-bdf8-48f8-a8a8-a5b31756a748"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 11, 25, 18, 41, 35, 853, DateTimeKind.Local).AddTicks(6306), new DateTime(2024, 11, 25, 18, 41, 35, 854, DateTimeKind.Local).AddTicks(945) });

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("caa4ebec-15c8-4d6b-9985-6d6b66f94e63"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 11, 25, 18, 41, 35, 854, DateTimeKind.Local).AddTicks(1587), new DateTime(2024, 11, 25, 18, 41, 35, 854, DateTimeKind.Local).AddTicks(1591) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc2"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 25, 18, 41, 35, 858, DateTimeKind.Local).AddTicks(1194), new DateTime(2024, 10, 25, 18, 41, 35, 858, DateTimeKind.Local).AddTicks(1273) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc3"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 25, 18, 41, 35, 858, DateTimeKind.Local).AddTicks(1298), new DateTime(2024, 10, 25, 18, 41, 35, 858, DateTimeKind.Local).AddTicks(1299) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc4"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 25, 18, 41, 35, 858, DateTimeKind.Local).AddTicks(1302), new DateTime(2024, 10, 25, 18, 41, 35, 858, DateTimeKind.Local).AddTicks(1317) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc5"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 25, 18, 41, 35, 858, DateTimeKind.Local).AddTicks(1320), new DateTime(2024, 10, 25, 18, 41, 35, 858, DateTimeKind.Local).AddTicks(1321) });

            migrationBuilder.UpdateData(
                table: "mtShiftManPowerRequest",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedDate", "StartDateTime", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 25, 18, 41, 35, 860, DateTimeKind.Local).AddTicks(3893), new DateTime(2024, 10, 25, 18, 41, 35, 860, DateTimeKind.Local).AddTicks(3532), new DateTime(2024, 10, 25, 18, 41, 35, 860, DateTimeKind.Local).AddTicks(3897) });

            migrationBuilder.UpdateData(
                table: "mtShiftManPowerRequest",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedDate", "StartDateTime", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 25, 18, 41, 35, 860, DateTimeKind.Local).AddTicks(3918), new DateTime(2024, 10, 25, 18, 41, 35, 860, DateTimeKind.Local).AddTicks(3916), new DateTime(2024, 10, 25, 18, 41, 35, 860, DateTimeKind.Local).AddTicks(3919) });

            migrationBuilder.UpdateData(
                table: "mtShiftManPowerRequest",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedDate", "StartDateTime", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 25, 18, 41, 35, 860, DateTimeKind.Local).AddTicks(3922), new DateTime(2024, 10, 25, 18, 41, 35, 860, DateTimeKind.Local).AddTicks(3921), new DateTime(2024, 10, 25, 18, 41, 35, 860, DateTimeKind.Local).AddTicks(3923) });

            migrationBuilder.UpdateData(
                table: "mtShiftManPowerRequest",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedDate", "StartDateTime", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 25, 18, 41, 35, 860, DateTimeKind.Local).AddTicks(3926), new DateTime(2024, 10, 25, 18, 41, 35, 860, DateTimeKind.Local).AddTicks(3925), new DateTime(2024, 10, 25, 18, 41, 35, 860, DateTimeKind.Local).AddTicks(3927) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("2aa84ed4-a495-47c8-913f-fa5928c1b4b8"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 25, 18, 41, 35, 858, DateTimeKind.Local).AddTicks(2980), new DateTime(2024, 10, 25, 18, 41, 35, 858, DateTimeKind.Local).AddTicks(2984) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("3ff4f468-53ef-48a3-8781-61a8a053fa99"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 25, 18, 41, 35, 858, DateTimeKind.Local).AddTicks(3003), new DateTime(2024, 10, 25, 18, 41, 35, 858, DateTimeKind.Local).AddTicks(3004) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("564d0272-92c8-4108-82b2-0f98882058d4"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 25, 18, 41, 35, 858, DateTimeKind.Local).AddTicks(3007), new DateTime(2024, 10, 25, 18, 41, 35, 858, DateTimeKind.Local).AddTicks(3008) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 25, 18, 41, 35, 858, DateTimeKind.Local).AddTicks(3010), new DateTime(2024, 10, 25, 18, 41, 35, 858, DateTimeKind.Local).AddTicks(3011) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("c1cb273c-570a-42f5-b563-66bac08911cc"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 25, 18, 41, 35, 858, DateTimeKind.Local).AddTicks(3014), new DateTime(2024, 10, 25, 18, 41, 35, 858, DateTimeKind.Local).AddTicks(3015) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("c1cb273c-570a-42f5-b563-66bac08911cd"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 25, 18, 41, 35, 858, DateTimeKind.Local).AddTicks(3048), new DateTime(2024, 10, 25, 18, 41, 35, 858, DateTimeKind.Local).AddTicks(3049) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc1"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 25, 18, 41, 35, 858, DateTimeKind.Local).AddTicks(3043), new DateTime(2024, 10, 25, 18, 41, 35, 858, DateTimeKind.Local).AddTicks(3044) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("18a79217-9fa7-460d-bccc-e74285b07531"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 11, 25, 18, 41, 35, 861, DateTimeKind.Local).AddTicks(5951), new DateTime(2024, 11, 25, 18, 41, 35, 861, DateTimeKind.Local).AddTicks(5952) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("bd69a88e-d6c1-42a1-8a3a-628843459909"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 11, 25, 18, 41, 35, 861, DateTimeKind.Local).AddTicks(5967), new DateTime(2024, 11, 25, 18, 41, 35, 861, DateTimeKind.Local).AddTicks(5967) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("c01c5086-cfa5-44ca-89d7-baa2c1accea6"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 11, 25, 18, 41, 35, 861, DateTimeKind.Local).AddTicks(5964), new DateTime(2024, 11, 25, 18, 41, 35, 861, DateTimeKind.Local).AddTicks(5964) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("d6016437-8b0f-4b0e-8175-5a11ffc480f5"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 11, 25, 18, 41, 35, 861, DateTimeKind.Local).AddTicks(5961), new DateTime(2024, 11, 25, 18, 41, 35, 861, DateTimeKind.Local).AddTicks(5961) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("f2cf879b-34f3-41da-9445-ee3bc590f224"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 11, 25, 18, 41, 35, 861, DateTimeKind.Local).AddTicks(5954), new DateTime(2024, 11, 25, 18, 41, 35, 861, DateTimeKind.Local).AddTicks(5955) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("fcddbf6b-88b8-4fae-ade7-63150ce1f1ec"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 11, 25, 18, 41, 35, 861, DateTimeKind.Local).AddTicks(5937), new DateTime(2024, 11, 25, 18, 41, 35, 861, DateTimeKind.Local).AddTicks(5943) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("1a157bf0-4748-4589-91cc-1450e0c06596"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 25, 18, 41, 35, 858, DateTimeKind.Local).AddTicks(4515), new DateTime(2024, 10, 25, 18, 41, 35, 858, DateTimeKind.Local).AddTicks(4516) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 25, 18, 41, 35, 858, DateTimeKind.Local).AddTicks(4521), new DateTime(2024, 10, 25, 18, 41, 35, 858, DateTimeKind.Local).AddTicks(4522) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("3fa85f64-5717-4562-b3fc-2c963f66afa6"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 25, 18, 41, 35, 858, DateTimeKind.Local).AddTicks(4518), new DateTime(2024, 10, 25, 18, 41, 35, 858, DateTimeKind.Local).AddTicks(4519) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 25, 18, 41, 35, 858, DateTimeKind.Local).AddTicks(4446), new DateTime(2024, 10, 25, 18, 41, 35, 858, DateTimeKind.Local).AddTicks(4451) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 25, 18, 41, 35, 858, DateTimeKind.Local).AddTicks(4510), new DateTime(2024, 10, 25, 18, 41, 35, 858, DateTimeKind.Local).AddTicks(4511) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("3ff4f468-53ef-48a3-8781-61a8a053fa99"), new Guid("1a157bf0-4748-4589-91cc-1450e0c06596") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 25, 18, 41, 35, 858, DateTimeKind.Local).AddTicks(8751), new DateTime(2024, 10, 25, 18, 41, 35, 858, DateTimeKind.Local).AddTicks(8754) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("564d0272-92c8-4108-82b2-0f98882058d4"), new Guid("1a157bf0-4748-4589-91cc-1450e0c06596") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 25, 18, 41, 35, 858, DateTimeKind.Local).AddTicks(8772), new DateTime(2024, 10, 25, 18, 41, 35, 858, DateTimeKind.Local).AddTicks(8773) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"), new Guid("1a157bf0-4748-4589-91cc-1450e0c06596") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 25, 18, 41, 35, 858, DateTimeKind.Local).AddTicks(8791), new DateTime(2024, 10, 25, 18, 41, 35, 858, DateTimeKind.Local).AddTicks(8792) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("564d0272-92c8-4108-82b2-0f98882058d4"), new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 25, 18, 41, 35, 858, DateTimeKind.Local).AddTicks(8795), new DateTime(2024, 10, 25, 18, 41, 35, 858, DateTimeKind.Local).AddTicks(8796) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"), new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 25, 18, 41, 35, 858, DateTimeKind.Local).AddTicks(8799), new DateTime(2024, 10, 25, 18, 41, 35, 858, DateTimeKind.Local).AddTicks(8800) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("e8eb7171-de01-4a85-a955-711b211eecc1"), new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 25, 18, 41, 35, 858, DateTimeKind.Local).AddTicks(8805), new DateTime(2024, 10, 25, 18, 41, 35, 858, DateTimeKind.Local).AddTicks(8806) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("c1cb273c-570a-42f5-b563-66bac08911cc"), new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 25, 18, 41, 35, 858, DateTimeKind.Local).AddTicks(8833), new DateTime(2024, 10, 25, 18, 41, 35, 858, DateTimeKind.Local).AddTicks(8834) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("c1cb273c-570a-42f5-b563-66bac08911cd"), new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 25, 18, 41, 35, 858, DateTimeKind.Local).AddTicks(8838), new DateTime(2024, 10, 25, 18, 41, 35, 858, DateTimeKind.Local).AddTicks(8839) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("2aa84ed4-a495-47c8-913f-fa5928c1b4b8"), new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 25, 18, 41, 35, 858, DateTimeKind.Local).AddTicks(8809), new DateTime(2024, 10, 25, 18, 41, 35, 858, DateTimeKind.Local).AddTicks(8810) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("564d0272-92c8-4108-82b2-0f98882058d4"), new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 25, 18, 41, 35, 858, DateTimeKind.Local).AddTicks(8813), new DateTime(2024, 10, 25, 18, 41, 35, 858, DateTimeKind.Local).AddTicks(8814) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"), new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 25, 18, 41, 35, 858, DateTimeKind.Local).AddTicks(8817), new DateTime(2024, 10, 25, 18, 41, 35, 858, DateTimeKind.Local).AddTicks(8817) });

            migrationBuilder.UpdateData(
                table: "trTask",
                keyColumn: "Id",
                keyValue: new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 25, 18, 41, 35, 858, DateTimeKind.Local).AddTicks(6666), new DateTime(2024, 10, 25, 18, 41, 35, 858, DateTimeKind.Local).AddTicks(6671) });

            migrationBuilder.UpdateData(
                table: "trTask",
                keyColumn: "Id",
                keyValue: new Guid("4422cc3c-0ea5-4d73-a31e-a42485a81003"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 25, 18, 41, 35, 858, DateTimeKind.Local).AddTicks(6716), new DateTime(2024, 10, 25, 18, 41, 35, 858, DateTimeKind.Local).AddTicks(6717) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("1a157bf0-4748-4589-91cc-1450e0c06596"), new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 25, 18, 41, 35, 858, DateTimeKind.Local).AddTicks(7568), new DateTime(2024, 10, 25, 18, 41, 35, 858, DateTimeKind.Local).AddTicks(7572) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5"), new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 25, 18, 41, 35, 858, DateTimeKind.Local).AddTicks(7590), new DateTime(2024, 10, 25, 18, 41, 35, 858, DateTimeKind.Local).AddTicks(7591) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911"), new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 25, 18, 41, 35, 858, DateTimeKind.Local).AddTicks(7593), new DateTime(2024, 10, 25, 18, 41, 35, 858, DateTimeKind.Local).AddTicks(7594) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496"), new Guid("4422cc3c-0ea5-4d73-a31e-a42485a81003") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 25, 18, 41, 35, 858, DateTimeKind.Local).AddTicks(7596), new DateTime(2024, 10, 25, 18, 41, 35, 858, DateTimeKind.Local).AddTicks(7597) });
        }
    }
}
