using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TCCTOBK.OperationBackend.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class RelationSchedulePlan : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Location",
                keyColumn: "LID",
                keyValue: new Guid("2c055101-2271-44e0-95fe-bcf2c59a459a"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 4, 11, 6, 59, 185, DateTimeKind.Local).AddTicks(1031), new DateTime(2024, 10, 4, 11, 6, 59, 185, DateTimeKind.Local).AddTicks(1035) });

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("4199e4de-bdf8-48f8-a8a8-a5b31756a748"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 4, 11, 6, 59, 179, DateTimeKind.Local).AddTicks(4142), new DateTime(2024, 10, 4, 11, 6, 59, 179, DateTimeKind.Local).AddTicks(9132) });

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("caa4ebec-15c8-4d6b-9985-6d6b66f94e63"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 4, 11, 6, 59, 179, DateTimeKind.Local).AddTicks(9647), new DateTime(2024, 10, 4, 11, 6, 59, 179, DateTimeKind.Local).AddTicks(9650) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc2"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 9, 4, 11, 6, 59, 184, DateTimeKind.Local).AddTicks(1685), new DateTime(2024, 9, 4, 11, 6, 59, 184, DateTimeKind.Local).AddTicks(1765) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc3"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 9, 4, 11, 6, 59, 184, DateTimeKind.Local).AddTicks(1803), new DateTime(2024, 9, 4, 11, 6, 59, 184, DateTimeKind.Local).AddTicks(1805) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc4"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 9, 4, 11, 6, 59, 184, DateTimeKind.Local).AddTicks(1807), new DateTime(2024, 9, 4, 11, 6, 59, 184, DateTimeKind.Local).AddTicks(1808) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc5"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 9, 4, 11, 6, 59, 184, DateTimeKind.Local).AddTicks(1811), new DateTime(2024, 9, 4, 11, 6, 59, 184, DateTimeKind.Local).AddTicks(1812) });

            migrationBuilder.UpdateData(
                table: "mtShiftManPowerRequest",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedDate", "StartDateTime", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 9, 4, 11, 6, 59, 186, DateTimeKind.Local).AddTicks(2127), new DateTime(2024, 9, 4, 11, 6, 59, 186, DateTimeKind.Local).AddTicks(1762), new DateTime(2024, 9, 4, 11, 6, 59, 186, DateTimeKind.Local).AddTicks(2131) });

            migrationBuilder.UpdateData(
                table: "mtShiftManPowerRequest",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedDate", "StartDateTime", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 9, 4, 11, 6, 59, 186, DateTimeKind.Local).AddTicks(2152), new DateTime(2024, 9, 4, 11, 6, 59, 186, DateTimeKind.Local).AddTicks(2150), new DateTime(2024, 9, 4, 11, 6, 59, 186, DateTimeKind.Local).AddTicks(2153) });

            migrationBuilder.UpdateData(
                table: "mtShiftManPowerRequest",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedDate", "StartDateTime", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 9, 4, 11, 6, 59, 186, DateTimeKind.Local).AddTicks(2156), new DateTime(2024, 9, 4, 11, 6, 59, 186, DateTimeKind.Local).AddTicks(2155), new DateTime(2024, 9, 4, 11, 6, 59, 186, DateTimeKind.Local).AddTicks(2157) });

            migrationBuilder.UpdateData(
                table: "mtShiftManPowerRequest",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedDate", "StartDateTime", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 9, 4, 11, 6, 59, 186, DateTimeKind.Local).AddTicks(2160), new DateTime(2024, 9, 4, 11, 6, 59, 186, DateTimeKind.Local).AddTicks(2159), new DateTime(2024, 9, 4, 11, 6, 59, 186, DateTimeKind.Local).AddTicks(2161) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("2aa84ed4-a495-47c8-913f-fa5928c1b4b8"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 9, 4, 11, 6, 59, 184, DateTimeKind.Local).AddTicks(3531), new DateTime(2024, 9, 4, 11, 6, 59, 184, DateTimeKind.Local).AddTicks(3536) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("3ff4f468-53ef-48a3-8781-61a8a053fa99"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 9, 4, 11, 6, 59, 184, DateTimeKind.Local).AddTicks(3556), new DateTime(2024, 9, 4, 11, 6, 59, 184, DateTimeKind.Local).AddTicks(3557) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("564d0272-92c8-4108-82b2-0f98882058d4"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 9, 4, 11, 6, 59, 184, DateTimeKind.Local).AddTicks(3561), new DateTime(2024, 9, 4, 11, 6, 59, 184, DateTimeKind.Local).AddTicks(3562) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 9, 4, 11, 6, 59, 184, DateTimeKind.Local).AddTicks(3565), new DateTime(2024, 9, 4, 11, 6, 59, 184, DateTimeKind.Local).AddTicks(3566) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("c1cb273c-570a-42f5-b563-66bac08911cc"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 9, 4, 11, 6, 59, 184, DateTimeKind.Local).AddTicks(3569), new DateTime(2024, 9, 4, 11, 6, 59, 184, DateTimeKind.Local).AddTicks(3584) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("c1cb273c-570a-42f5-b563-66bac08911cd"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 9, 4, 11, 6, 59, 184, DateTimeKind.Local).AddTicks(3599), new DateTime(2024, 9, 4, 11, 6, 59, 184, DateTimeKind.Local).AddTicks(3600) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc1"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 9, 4, 11, 6, 59, 184, DateTimeKind.Local).AddTicks(3594), new DateTime(2024, 9, 4, 11, 6, 59, 184, DateTimeKind.Local).AddTicks(3595) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("18a79217-9fa7-460d-bccc-e74285b07531"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 4, 11, 6, 59, 187, DateTimeKind.Local).AddTicks(1856), new DateTime(2024, 10, 4, 11, 6, 59, 187, DateTimeKind.Local).AddTicks(1857) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("f2cf879b-34f3-41da-9445-ee3bc590f224"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 4, 11, 6, 59, 187, DateTimeKind.Local).AddTicks(1859), new DateTime(2024, 10, 4, 11, 6, 59, 187, DateTimeKind.Local).AddTicks(1860) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("fcddbf6b-88b8-4fae-ade7-63150ce1f1ec"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 4, 11, 6, 59, 187, DateTimeKind.Local).AddTicks(1843), new DateTime(2024, 10, 4, 11, 6, 59, 187, DateTimeKind.Local).AddTicks(1848) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("1a157bf0-4748-4589-91cc-1450e0c06596"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 9, 4, 11, 6, 59, 184, DateTimeKind.Local).AddTicks(5127), new DateTime(2024, 9, 4, 11, 6, 59, 184, DateTimeKind.Local).AddTicks(5128) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 9, 4, 11, 6, 59, 184, DateTimeKind.Local).AddTicks(5134), new DateTime(2024, 9, 4, 11, 6, 59, 184, DateTimeKind.Local).AddTicks(5135) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("3fa85f64-5717-4562-b3fc-2c963f66afa6"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 9, 4, 11, 6, 59, 184, DateTimeKind.Local).AddTicks(5131), new DateTime(2024, 9, 4, 11, 6, 59, 184, DateTimeKind.Local).AddTicks(5132) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 9, 4, 11, 6, 59, 184, DateTimeKind.Local).AddTicks(5096), new DateTime(2024, 9, 4, 11, 6, 59, 184, DateTimeKind.Local).AddTicks(5102) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 9, 4, 11, 6, 59, 184, DateTimeKind.Local).AddTicks(5123), new DateTime(2024, 9, 4, 11, 6, 59, 184, DateTimeKind.Local).AddTicks(5124) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("3ff4f468-53ef-48a3-8781-61a8a053fa99"), new Guid("1a157bf0-4748-4589-91cc-1450e0c06596") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 9, 4, 11, 6, 59, 184, DateTimeKind.Local).AddTicks(8659), new DateTime(2024, 9, 4, 11, 6, 59, 184, DateTimeKind.Local).AddTicks(8663) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("564d0272-92c8-4108-82b2-0f98882058d4"), new Guid("1a157bf0-4748-4589-91cc-1450e0c06596") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 9, 4, 11, 6, 59, 184, DateTimeKind.Local).AddTicks(8701), new DateTime(2024, 9, 4, 11, 6, 59, 184, DateTimeKind.Local).AddTicks(8702) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"), new Guid("1a157bf0-4748-4589-91cc-1450e0c06596") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 9, 4, 11, 6, 59, 184, DateTimeKind.Local).AddTicks(8808), new DateTime(2024, 9, 4, 11, 6, 59, 184, DateTimeKind.Local).AddTicks(8809) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("564d0272-92c8-4108-82b2-0f98882058d4"), new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 9, 4, 11, 6, 59, 184, DateTimeKind.Local).AddTicks(8812), new DateTime(2024, 9, 4, 11, 6, 59, 184, DateTimeKind.Local).AddTicks(8813) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"), new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 9, 4, 11, 6, 59, 184, DateTimeKind.Local).AddTicks(8816), new DateTime(2024, 9, 4, 11, 6, 59, 184, DateTimeKind.Local).AddTicks(8817) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("e8eb7171-de01-4a85-a955-711b211eecc1"), new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 9, 4, 11, 6, 59, 184, DateTimeKind.Local).AddTicks(8823), new DateTime(2024, 9, 4, 11, 6, 59, 184, DateTimeKind.Local).AddTicks(8824) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("c1cb273c-570a-42f5-b563-66bac08911cc"), new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 9, 4, 11, 6, 59, 184, DateTimeKind.Local).AddTicks(8855), new DateTime(2024, 9, 4, 11, 6, 59, 184, DateTimeKind.Local).AddTicks(8856) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("c1cb273c-570a-42f5-b563-66bac08911cd"), new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 9, 4, 11, 6, 59, 184, DateTimeKind.Local).AddTicks(8858), new DateTime(2024, 9, 4, 11, 6, 59, 184, DateTimeKind.Local).AddTicks(8859) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("2aa84ed4-a495-47c8-913f-fa5928c1b4b8"), new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 9, 4, 11, 6, 59, 184, DateTimeKind.Local).AddTicks(8827), new DateTime(2024, 9, 4, 11, 6, 59, 184, DateTimeKind.Local).AddTicks(8828) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("564d0272-92c8-4108-82b2-0f98882058d4"), new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 9, 4, 11, 6, 59, 184, DateTimeKind.Local).AddTicks(8831), new DateTime(2024, 9, 4, 11, 6, 59, 184, DateTimeKind.Local).AddTicks(8832) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"), new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 9, 4, 11, 6, 59, 184, DateTimeKind.Local).AddTicks(8849), new DateTime(2024, 9, 4, 11, 6, 59, 184, DateTimeKind.Local).AddTicks(8850) });

            migrationBuilder.UpdateData(
                table: "trTask",
                keyColumn: "Id",
                keyValue: new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 9, 4, 11, 6, 59, 184, DateTimeKind.Local).AddTicks(6736), new DateTime(2024, 9, 4, 11, 6, 59, 184, DateTimeKind.Local).AddTicks(6741) });

            migrationBuilder.UpdateData(
                table: "trTask",
                keyColumn: "Id",
                keyValue: new Guid("4422cc3c-0ea5-4d73-a31e-a42485a81003"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 9, 4, 11, 6, 59, 184, DateTimeKind.Local).AddTicks(6761), new DateTime(2024, 9, 4, 11, 6, 59, 184, DateTimeKind.Local).AddTicks(6762) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("1a157bf0-4748-4589-91cc-1450e0c06596"), new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 9, 4, 11, 6, 59, 184, DateTimeKind.Local).AddTicks(7566), new DateTime(2024, 9, 4, 11, 6, 59, 184, DateTimeKind.Local).AddTicks(7569) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5"), new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 9, 4, 11, 6, 59, 184, DateTimeKind.Local).AddTicks(7586), new DateTime(2024, 9, 4, 11, 6, 59, 184, DateTimeKind.Local).AddTicks(7587) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911"), new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 9, 4, 11, 6, 59, 184, DateTimeKind.Local).AddTicks(7590), new DateTime(2024, 9, 4, 11, 6, 59, 184, DateTimeKind.Local).AddTicks(7591) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496"), new Guid("4422cc3c-0ea5-4d73-a31e-a42485a81003") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 9, 4, 11, 6, 59, 184, DateTimeKind.Local).AddTicks(7593), new DateTime(2024, 9, 4, 11, 6, 59, 184, DateTimeKind.Local).AddTicks(7594) });

            migrationBuilder.AddForeignKey(
                name: "FK_trSchedulePlan_SOCUser_MemberId",
                table: "trSchedulePlan",
                column: "MemberId",
                principalTable: "SOCUser",
                principalColumn: "SID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_trSchedulePlan_SOCUser_MemberId",
                table: "trSchedulePlan");

            migrationBuilder.UpdateData(
                table: "Location",
                keyColumn: "LID",
                keyValue: new Guid("2c055101-2271-44e0-95fe-bcf2c59a459a"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 9, 24, 15, 31, 59, 537, DateTimeKind.Local).AddTicks(2056), new DateTime(2024, 9, 24, 15, 31, 59, 537, DateTimeKind.Local).AddTicks(2057) });

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("4199e4de-bdf8-48f8-a8a8-a5b31756a748"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 9, 24, 15, 31, 59, 533, DateTimeKind.Local).AddTicks(9835), new DateTime(2024, 9, 24, 15, 31, 59, 534, DateTimeKind.Local).AddTicks(2855) });

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("caa4ebec-15c8-4d6b-9985-6d6b66f94e63"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 9, 24, 15, 31, 59, 534, DateTimeKind.Local).AddTicks(3043), new DateTime(2024, 9, 24, 15, 31, 59, 534, DateTimeKind.Local).AddTicks(3044) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc2"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 24, 15, 31, 59, 536, DateTimeKind.Local).AddTicks(8473), new DateTime(2024, 8, 24, 15, 31, 59, 536, DateTimeKind.Local).AddTicks(8531) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc3"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 24, 15, 31, 59, 536, DateTimeKind.Local).AddTicks(8552), new DateTime(2024, 8, 24, 15, 31, 59, 536, DateTimeKind.Local).AddTicks(8553) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc4"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 24, 15, 31, 59, 536, DateTimeKind.Local).AddTicks(8584), new DateTime(2024, 8, 24, 15, 31, 59, 536, DateTimeKind.Local).AddTicks(8585) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc5"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 24, 15, 31, 59, 536, DateTimeKind.Local).AddTicks(8587), new DateTime(2024, 8, 24, 15, 31, 59, 536, DateTimeKind.Local).AddTicks(8588) });

            migrationBuilder.UpdateData(
                table: "mtShiftManPowerRequest",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedDate", "StartDateTime", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 24, 15, 31, 59, 538, DateTimeKind.Local).AddTicks(2672), new DateTime(2024, 8, 24, 15, 31, 59, 538, DateTimeKind.Local).AddTicks(2483), new DateTime(2024, 8, 24, 15, 31, 59, 538, DateTimeKind.Local).AddTicks(2674) });

            migrationBuilder.UpdateData(
                table: "mtShiftManPowerRequest",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedDate", "StartDateTime", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 24, 15, 31, 59, 538, DateTimeKind.Local).AddTicks(2682), new DateTime(2024, 8, 24, 15, 31, 59, 538, DateTimeKind.Local).AddTicks(2680), new DateTime(2024, 8, 24, 15, 31, 59, 538, DateTimeKind.Local).AddTicks(2683) });

            migrationBuilder.UpdateData(
                table: "mtShiftManPowerRequest",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedDate", "StartDateTime", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 24, 15, 31, 59, 538, DateTimeKind.Local).AddTicks(2725), new DateTime(2024, 8, 24, 15, 31, 59, 538, DateTimeKind.Local).AddTicks(2724), new DateTime(2024, 8, 24, 15, 31, 59, 538, DateTimeKind.Local).AddTicks(2726) });

            migrationBuilder.UpdateData(
                table: "mtShiftManPowerRequest",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedDate", "StartDateTime", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 24, 15, 31, 59, 538, DateTimeKind.Local).AddTicks(2729), new DateTime(2024, 8, 24, 15, 31, 59, 538, DateTimeKind.Local).AddTicks(2728), new DateTime(2024, 8, 24, 15, 31, 59, 538, DateTimeKind.Local).AddTicks(2730) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("2aa84ed4-a495-47c8-913f-fa5928c1b4b8"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 24, 15, 31, 59, 536, DateTimeKind.Local).AddTicks(9215), new DateTime(2024, 8, 24, 15, 31, 59, 536, DateTimeKind.Local).AddTicks(9216) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("3ff4f468-53ef-48a3-8781-61a8a053fa99"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 24, 15, 31, 59, 536, DateTimeKind.Local).AddTicks(9224), new DateTime(2024, 8, 24, 15, 31, 59, 536, DateTimeKind.Local).AddTicks(9225) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("564d0272-92c8-4108-82b2-0f98882058d4"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 24, 15, 31, 59, 536, DateTimeKind.Local).AddTicks(9228), new DateTime(2024, 8, 24, 15, 31, 59, 536, DateTimeKind.Local).AddTicks(9239) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 24, 15, 31, 59, 536, DateTimeKind.Local).AddTicks(9247), new DateTime(2024, 8, 24, 15, 31, 59, 536, DateTimeKind.Local).AddTicks(9248) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("c1cb273c-570a-42f5-b563-66bac08911cc"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 24, 15, 31, 59, 536, DateTimeKind.Local).AddTicks(9250), new DateTime(2024, 8, 24, 15, 31, 59, 536, DateTimeKind.Local).AddTicks(9251) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("c1cb273c-570a-42f5-b563-66bac08911cd"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 24, 15, 31, 59, 536, DateTimeKind.Local).AddTicks(9260), new DateTime(2024, 8, 24, 15, 31, 59, 536, DateTimeKind.Local).AddTicks(9260) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc1"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 24, 15, 31, 59, 536, DateTimeKind.Local).AddTicks(9257), new DateTime(2024, 8, 24, 15, 31, 59, 536, DateTimeKind.Local).AddTicks(9257) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("18a79217-9fa7-460d-bccc-e74285b07531"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 9, 24, 15, 31, 59, 538, DateTimeKind.Local).AddTicks(8656), new DateTime(2024, 9, 24, 15, 31, 59, 538, DateTimeKind.Local).AddTicks(8657) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("f2cf879b-34f3-41da-9445-ee3bc590f224"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 9, 24, 15, 31, 59, 538, DateTimeKind.Local).AddTicks(8660), new DateTime(2024, 9, 24, 15, 31, 59, 538, DateTimeKind.Local).AddTicks(8660) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("fcddbf6b-88b8-4fae-ade7-63150ce1f1ec"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 9, 24, 15, 31, 59, 538, DateTimeKind.Local).AddTicks(8647), new DateTime(2024, 9, 24, 15, 31, 59, 538, DateTimeKind.Local).AddTicks(8652) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("1a157bf0-4748-4589-91cc-1450e0c06596"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 24, 15, 31, 59, 536, DateTimeKind.Local).AddTicks(9889), new DateTime(2024, 8, 24, 15, 31, 59, 536, DateTimeKind.Local).AddTicks(9890) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 24, 15, 31, 59, 536, DateTimeKind.Local).AddTicks(9905), new DateTime(2024, 8, 24, 15, 31, 59, 536, DateTimeKind.Local).AddTicks(9906) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("3fa85f64-5717-4562-b3fc-2c963f66afa6"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 24, 15, 31, 59, 536, DateTimeKind.Local).AddTicks(9902), new DateTime(2024, 8, 24, 15, 31, 59, 536, DateTimeKind.Local).AddTicks(9903) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 24, 15, 31, 59, 536, DateTimeKind.Local).AddTicks(9877), new DateTime(2024, 8, 24, 15, 31, 59, 536, DateTimeKind.Local).AddTicks(9879) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 24, 15, 31, 59, 536, DateTimeKind.Local).AddTicks(9886), new DateTime(2024, 8, 24, 15, 31, 59, 536, DateTimeKind.Local).AddTicks(9887) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("3ff4f468-53ef-48a3-8781-61a8a053fa99"), new Guid("1a157bf0-4748-4589-91cc-1450e0c06596") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 24, 15, 31, 59, 537, DateTimeKind.Local).AddTicks(1211), new DateTime(2024, 8, 24, 15, 31, 59, 537, DateTimeKind.Local).AddTicks(1212) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("564d0272-92c8-4108-82b2-0f98882058d4"), new Guid("1a157bf0-4748-4589-91cc-1450e0c06596") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 24, 15, 31, 59, 537, DateTimeKind.Local).AddTicks(1218), new DateTime(2024, 8, 24, 15, 31, 59, 537, DateTimeKind.Local).AddTicks(1219) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"), new Guid("1a157bf0-4748-4589-91cc-1450e0c06596") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 24, 15, 31, 59, 537, DateTimeKind.Local).AddTicks(1221), new DateTime(2024, 8, 24, 15, 31, 59, 537, DateTimeKind.Local).AddTicks(1221) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("564d0272-92c8-4108-82b2-0f98882058d4"), new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 24, 15, 31, 59, 537, DateTimeKind.Local).AddTicks(1224), new DateTime(2024, 8, 24, 15, 31, 59, 537, DateTimeKind.Local).AddTicks(1224) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"), new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 24, 15, 31, 59, 537, DateTimeKind.Local).AddTicks(1227), new DateTime(2024, 8, 24, 15, 31, 59, 537, DateTimeKind.Local).AddTicks(1228) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("e8eb7171-de01-4a85-a955-711b211eecc1"), new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 24, 15, 31, 59, 537, DateTimeKind.Local).AddTicks(1231), new DateTime(2024, 8, 24, 15, 31, 59, 537, DateTimeKind.Local).AddTicks(1232) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("c1cb273c-570a-42f5-b563-66bac08911cc"), new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 24, 15, 31, 59, 537, DateTimeKind.Local).AddTicks(1252), new DateTime(2024, 8, 24, 15, 31, 59, 537, DateTimeKind.Local).AddTicks(1253) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("c1cb273c-570a-42f5-b563-66bac08911cd"), new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 24, 15, 31, 59, 537, DateTimeKind.Local).AddTicks(1255), new DateTime(2024, 8, 24, 15, 31, 59, 537, DateTimeKind.Local).AddTicks(1256) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("2aa84ed4-a495-47c8-913f-fa5928c1b4b8"), new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 24, 15, 31, 59, 537, DateTimeKind.Local).AddTicks(1243), new DateTime(2024, 8, 24, 15, 31, 59, 537, DateTimeKind.Local).AddTicks(1243) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("564d0272-92c8-4108-82b2-0f98882058d4"), new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 24, 15, 31, 59, 537, DateTimeKind.Local).AddTicks(1246), new DateTime(2024, 8, 24, 15, 31, 59, 537, DateTimeKind.Local).AddTicks(1247) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"), new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 24, 15, 31, 59, 537, DateTimeKind.Local).AddTicks(1249), new DateTime(2024, 8, 24, 15, 31, 59, 537, DateTimeKind.Local).AddTicks(1250) });

            migrationBuilder.UpdateData(
                table: "trTask",
                keyColumn: "Id",
                keyValue: new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 24, 15, 31, 59, 537, DateTimeKind.Local).AddTicks(524), new DateTime(2024, 8, 24, 15, 31, 59, 537, DateTimeKind.Local).AddTicks(525) });

            migrationBuilder.UpdateData(
                table: "trTask",
                keyColumn: "Id",
                keyValue: new Guid("4422cc3c-0ea5-4d73-a31e-a42485a81003"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 24, 15, 31, 59, 537, DateTimeKind.Local).AddTicks(533), new DateTime(2024, 8, 24, 15, 31, 59, 537, DateTimeKind.Local).AddTicks(534) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("1a157bf0-4748-4589-91cc-1450e0c06596"), new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 24, 15, 31, 59, 537, DateTimeKind.Local).AddTicks(813), new DateTime(2024, 8, 24, 15, 31, 59, 537, DateTimeKind.Local).AddTicks(814) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5"), new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 24, 15, 31, 59, 537, DateTimeKind.Local).AddTicks(820), new DateTime(2024, 8, 24, 15, 31, 59, 537, DateTimeKind.Local).AddTicks(821) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911"), new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 24, 15, 31, 59, 537, DateTimeKind.Local).AddTicks(823), new DateTime(2024, 8, 24, 15, 31, 59, 537, DateTimeKind.Local).AddTicks(824) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496"), new Guid("4422cc3c-0ea5-4d73-a31e-a42485a81003") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 24, 15, 31, 59, 537, DateTimeKind.Local).AddTicks(835), new DateTime(2024, 8, 24, 15, 31, 59, 537, DateTimeKind.Local).AddTicks(836) });
        }
    }
}
