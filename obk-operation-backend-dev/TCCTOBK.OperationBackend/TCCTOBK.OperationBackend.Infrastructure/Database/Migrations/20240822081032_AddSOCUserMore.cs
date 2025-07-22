using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TCCTOBK.OperationBackend.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class AddSOCUserMore : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "DataJson",
                table: "SOCUser",
                type: "character varying",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "KeyCloakUserId",
                table: "SOCUser",
                type: "text",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "Location",
                keyColumn: "LID",
                keyValue: new Guid("2c055101-2271-44e0-95fe-bcf2c59a459a"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 22, 15, 10, 31, 680, DateTimeKind.Local).AddTicks(4780), new DateTime(2024, 8, 22, 15, 10, 31, 680, DateTimeKind.Local).AddTicks(4780) });

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("4199e4de-bdf8-48f8-a8a8-a5b31756a748"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 22, 15, 10, 31, 670, DateTimeKind.Local).AddTicks(610), new DateTime(2024, 8, 22, 15, 10, 31, 677, DateTimeKind.Local).AddTicks(4640) });

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("caa4ebec-15c8-4d6b-9985-6d6b66f94e63"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 22, 15, 10, 31, 677, DateTimeKind.Local).AddTicks(4860), new DateTime(2024, 8, 22, 15, 10, 31, 677, DateTimeKind.Local).AddTicks(4870) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc2"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 22, 15, 10, 31, 680, DateTimeKind.Local).AddTicks(1030), new DateTime(2024, 7, 22, 15, 10, 31, 680, DateTimeKind.Local).AddTicks(1050) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc3"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 22, 15, 10, 31, 680, DateTimeKind.Local).AddTicks(1060), new DateTime(2024, 7, 22, 15, 10, 31, 680, DateTimeKind.Local).AddTicks(1060) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc4"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 22, 15, 10, 31, 680, DateTimeKind.Local).AddTicks(1060), new DateTime(2024, 7, 22, 15, 10, 31, 680, DateTimeKind.Local).AddTicks(1060) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc5"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 22, 15, 10, 31, 680, DateTimeKind.Local).AddTicks(1070), new DateTime(2024, 7, 22, 15, 10, 31, 680, DateTimeKind.Local).AddTicks(1070) });

            migrationBuilder.UpdateData(
                table: "mtShiftManPowerRequest",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedDate", "StartDateTime", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 22, 15, 10, 31, 680, DateTimeKind.Local).AddTicks(8870), new DateTime(2024, 7, 22, 15, 10, 31, 680, DateTimeKind.Local).AddTicks(8740), new DateTime(2024, 7, 22, 15, 10, 31, 680, DateTimeKind.Local).AddTicks(8870) });

            migrationBuilder.UpdateData(
                table: "mtShiftManPowerRequest",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedDate", "StartDateTime", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 22, 15, 10, 31, 680, DateTimeKind.Local).AddTicks(8900), new DateTime(2024, 7, 22, 15, 10, 31, 680, DateTimeKind.Local).AddTicks(8890), new DateTime(2024, 7, 22, 15, 10, 31, 680, DateTimeKind.Local).AddTicks(8900) });

            migrationBuilder.UpdateData(
                table: "mtShiftManPowerRequest",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedDate", "StartDateTime", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 22, 15, 10, 31, 680, DateTimeKind.Local).AddTicks(8900), new DateTime(2024, 7, 22, 15, 10, 31, 680, DateTimeKind.Local).AddTicks(8900), new DateTime(2024, 7, 22, 15, 10, 31, 680, DateTimeKind.Local).AddTicks(8900) });

            migrationBuilder.UpdateData(
                table: "mtShiftManPowerRequest",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedDate", "StartDateTime", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 22, 15, 10, 31, 680, DateTimeKind.Local).AddTicks(8900), new DateTime(2024, 7, 22, 15, 10, 31, 680, DateTimeKind.Local).AddTicks(8900), new DateTime(2024, 7, 22, 15, 10, 31, 680, DateTimeKind.Local).AddTicks(8900) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("2aa84ed4-a495-47c8-913f-fa5928c1b4b8"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 22, 15, 10, 31, 680, DateTimeKind.Local).AddTicks(1740), new DateTime(2024, 7, 22, 15, 10, 31, 680, DateTimeKind.Local).AddTicks(1750) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("3ff4f468-53ef-48a3-8781-61a8a053fa99"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 22, 15, 10, 31, 680, DateTimeKind.Local).AddTicks(1750), new DateTime(2024, 7, 22, 15, 10, 31, 680, DateTimeKind.Local).AddTicks(1750) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("564d0272-92c8-4108-82b2-0f98882058d4"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 22, 15, 10, 31, 680, DateTimeKind.Local).AddTicks(1760), new DateTime(2024, 7, 22, 15, 10, 31, 680, DateTimeKind.Local).AddTicks(1760) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 22, 15, 10, 31, 680, DateTimeKind.Local).AddTicks(1760), new DateTime(2024, 7, 22, 15, 10, 31, 680, DateTimeKind.Local).AddTicks(1760) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("c1cb273c-570a-42f5-b563-66bac08911cc"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 22, 15, 10, 31, 680, DateTimeKind.Local).AddTicks(1760), new DateTime(2024, 7, 22, 15, 10, 31, 680, DateTimeKind.Local).AddTicks(1760) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("c1cb273c-570a-42f5-b563-66bac08911cd"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 22, 15, 10, 31, 680, DateTimeKind.Local).AddTicks(1770), new DateTime(2024, 7, 22, 15, 10, 31, 680, DateTimeKind.Local).AddTicks(1770) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc1"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 22, 15, 10, 31, 680, DateTimeKind.Local).AddTicks(1770), new DateTime(2024, 7, 22, 15, 10, 31, 680, DateTimeKind.Local).AddTicks(1770) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("18a79217-9fa7-460d-bccc-e74285b07531"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 22, 15, 10, 31, 681, DateTimeKind.Local).AddTicks(3230), new DateTime(2024, 8, 22, 15, 10, 31, 681, DateTimeKind.Local).AddTicks(3230) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("f2cf879b-34f3-41da-9445-ee3bc590f224"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 22, 15, 10, 31, 681, DateTimeKind.Local).AddTicks(3230), new DateTime(2024, 8, 22, 15, 10, 31, 681, DateTimeKind.Local).AddTicks(3230) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("fcddbf6b-88b8-4fae-ade7-63150ce1f1ec"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 22, 15, 10, 31, 681, DateTimeKind.Local).AddTicks(3220), new DateTime(2024, 8, 22, 15, 10, 31, 681, DateTimeKind.Local).AddTicks(3220) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("1a157bf0-4748-4589-91cc-1450e0c06596"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 22, 15, 10, 31, 680, DateTimeKind.Local).AddTicks(2430), new DateTime(2024, 7, 22, 15, 10, 31, 680, DateTimeKind.Local).AddTicks(2430) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 22, 15, 10, 31, 680, DateTimeKind.Local).AddTicks(2430), new DateTime(2024, 7, 22, 15, 10, 31, 680, DateTimeKind.Local).AddTicks(2430) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("3fa85f64-5717-4562-b3fc-2c963f66afa6"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 22, 15, 10, 31, 680, DateTimeKind.Local).AddTicks(2430), new DateTime(2024, 7, 22, 15, 10, 31, 680, DateTimeKind.Local).AddTicks(2430) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 22, 15, 10, 31, 680, DateTimeKind.Local).AddTicks(2410), new DateTime(2024, 7, 22, 15, 10, 31, 680, DateTimeKind.Local).AddTicks(2410) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 22, 15, 10, 31, 680, DateTimeKind.Local).AddTicks(2420), new DateTime(2024, 7, 22, 15, 10, 31, 680, DateTimeKind.Local).AddTicks(2420) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("3ff4f468-53ef-48a3-8781-61a8a053fa99"), new Guid("1a157bf0-4748-4589-91cc-1450e0c06596") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 22, 15, 10, 31, 680, DateTimeKind.Local).AddTicks(3880), new DateTime(2024, 7, 22, 15, 10, 31, 680, DateTimeKind.Local).AddTicks(3880) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("564d0272-92c8-4108-82b2-0f98882058d4"), new Guid("1a157bf0-4748-4589-91cc-1450e0c06596") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 22, 15, 10, 31, 680, DateTimeKind.Local).AddTicks(3890), new DateTime(2024, 7, 22, 15, 10, 31, 680, DateTimeKind.Local).AddTicks(3890) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"), new Guid("1a157bf0-4748-4589-91cc-1450e0c06596") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 22, 15, 10, 31, 680, DateTimeKind.Local).AddTicks(3890), new DateTime(2024, 7, 22, 15, 10, 31, 680, DateTimeKind.Local).AddTicks(3890) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("564d0272-92c8-4108-82b2-0f98882058d4"), new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 22, 15, 10, 31, 680, DateTimeKind.Local).AddTicks(3890), new DateTime(2024, 7, 22, 15, 10, 31, 680, DateTimeKind.Local).AddTicks(3890) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"), new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 22, 15, 10, 31, 680, DateTimeKind.Local).AddTicks(3900), new DateTime(2024, 7, 22, 15, 10, 31, 680, DateTimeKind.Local).AddTicks(3900) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("e8eb7171-de01-4a85-a955-711b211eecc1"), new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 22, 15, 10, 31, 680, DateTimeKind.Local).AddTicks(3900), new DateTime(2024, 7, 22, 15, 10, 31, 680, DateTimeKind.Local).AddTicks(3900) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("c1cb273c-570a-42f5-b563-66bac08911cc"), new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 22, 15, 10, 31, 680, DateTimeKind.Local).AddTicks(3910), new DateTime(2024, 7, 22, 15, 10, 31, 680, DateTimeKind.Local).AddTicks(3910) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("c1cb273c-570a-42f5-b563-66bac08911cd"), new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 22, 15, 10, 31, 680, DateTimeKind.Local).AddTicks(3910), new DateTime(2024, 7, 22, 15, 10, 31, 680, DateTimeKind.Local).AddTicks(3910) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("2aa84ed4-a495-47c8-913f-fa5928c1b4b8"), new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 22, 15, 10, 31, 680, DateTimeKind.Local).AddTicks(3900), new DateTime(2024, 7, 22, 15, 10, 31, 680, DateTimeKind.Local).AddTicks(3900) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("564d0272-92c8-4108-82b2-0f98882058d4"), new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 22, 15, 10, 31, 680, DateTimeKind.Local).AddTicks(3910), new DateTime(2024, 7, 22, 15, 10, 31, 680, DateTimeKind.Local).AddTicks(3910) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"), new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 22, 15, 10, 31, 680, DateTimeKind.Local).AddTicks(3910), new DateTime(2024, 7, 22, 15, 10, 31, 680, DateTimeKind.Local).AddTicks(3910) });

            migrationBuilder.UpdateData(
                table: "trTask",
                keyColumn: "Id",
                keyValue: new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 22, 15, 10, 31, 680, DateTimeKind.Local).AddTicks(3060), new DateTime(2024, 7, 22, 15, 10, 31, 680, DateTimeKind.Local).AddTicks(3060) });

            migrationBuilder.UpdateData(
                table: "trTask",
                keyColumn: "Id",
                keyValue: new Guid("4422cc3c-0ea5-4d73-a31e-a42485a81003"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 22, 15, 10, 31, 680, DateTimeKind.Local).AddTicks(3070), new DateTime(2024, 7, 22, 15, 10, 31, 680, DateTimeKind.Local).AddTicks(3070) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("1a157bf0-4748-4589-91cc-1450e0c06596"), new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 22, 15, 10, 31, 680, DateTimeKind.Local).AddTicks(3410), new DateTime(2024, 7, 22, 15, 10, 31, 680, DateTimeKind.Local).AddTicks(3410) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5"), new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 22, 15, 10, 31, 680, DateTimeKind.Local).AddTicks(3420), new DateTime(2024, 7, 22, 15, 10, 31, 680, DateTimeKind.Local).AddTicks(3420) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911"), new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 22, 15, 10, 31, 680, DateTimeKind.Local).AddTicks(3420), new DateTime(2024, 7, 22, 15, 10, 31, 680, DateTimeKind.Local).AddTicks(3420) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496"), new Guid("4422cc3c-0ea5-4d73-a31e-a42485a81003") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 22, 15, 10, 31, 680, DateTimeKind.Local).AddTicks(3420), new DateTime(2024, 7, 22, 15, 10, 31, 680, DateTimeKind.Local).AddTicks(3420) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DataJson",
                table: "SOCUser");

            migrationBuilder.DropColumn(
                name: "KeyCloakUserId",
                table: "SOCUser");

            migrationBuilder.UpdateData(
                table: "Location",
                keyColumn: "LID",
                keyValue: new Guid("2c055101-2271-44e0-95fe-bcf2c59a459a"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 21, 17, 28, 17, 462, DateTimeKind.Local).AddTicks(4905), new DateTime(2024, 8, 21, 17, 28, 17, 462, DateTimeKind.Local).AddTicks(4909) });

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("4199e4de-bdf8-48f8-a8a8-a5b31756a748"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 21, 17, 28, 17, 453, DateTimeKind.Local).AddTicks(7226), new DateTime(2024, 8, 21, 17, 28, 17, 454, DateTimeKind.Local).AddTicks(6618) });

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("caa4ebec-15c8-4d6b-9985-6d6b66f94e63"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 21, 17, 28, 17, 454, DateTimeKind.Local).AddTicks(7644), new DateTime(2024, 8, 21, 17, 28, 17, 454, DateTimeKind.Local).AddTicks(7649) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc2"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 21, 17, 28, 17, 461, DateTimeKind.Local).AddTicks(2738), new DateTime(2024, 7, 21, 17, 28, 17, 461, DateTimeKind.Local).AddTicks(2859) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc3"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 21, 17, 28, 17, 461, DateTimeKind.Local).AddTicks(2897), new DateTime(2024, 7, 21, 17, 28, 17, 461, DateTimeKind.Local).AddTicks(2899) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc4"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 21, 17, 28, 17, 461, DateTimeKind.Local).AddTicks(2902), new DateTime(2024, 7, 21, 17, 28, 17, 461, DateTimeKind.Local).AddTicks(2904) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc5"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 21, 17, 28, 17, 461, DateTimeKind.Local).AddTicks(2907), new DateTime(2024, 7, 21, 17, 28, 17, 461, DateTimeKind.Local).AddTicks(2908) });

            migrationBuilder.UpdateData(
                table: "mtShiftManPowerRequest",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedDate", "StartDateTime", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 21, 17, 28, 17, 464, DateTimeKind.Local).AddTicks(802), new DateTime(2024, 7, 21, 17, 28, 17, 464, DateTimeKind.Local).AddTicks(308), new DateTime(2024, 7, 21, 17, 28, 17, 464, DateTimeKind.Local).AddTicks(807) });

            migrationBuilder.UpdateData(
                table: "mtShiftManPowerRequest",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedDate", "StartDateTime", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 21, 17, 28, 17, 464, DateTimeKind.Local).AddTicks(831), new DateTime(2024, 7, 21, 17, 28, 17, 464, DateTimeKind.Local).AddTicks(828), new DateTime(2024, 7, 21, 17, 28, 17, 464, DateTimeKind.Local).AddTicks(832) });

            migrationBuilder.UpdateData(
                table: "mtShiftManPowerRequest",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedDate", "StartDateTime", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 21, 17, 28, 17, 464, DateTimeKind.Local).AddTicks(836), new DateTime(2024, 7, 21, 17, 28, 17, 464, DateTimeKind.Local).AddTicks(835), new DateTime(2024, 7, 21, 17, 28, 17, 464, DateTimeKind.Local).AddTicks(838) });

            migrationBuilder.UpdateData(
                table: "mtShiftManPowerRequest",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedDate", "StartDateTime", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 21, 17, 28, 17, 464, DateTimeKind.Local).AddTicks(841), new DateTime(2024, 7, 21, 17, 28, 17, 464, DateTimeKind.Local).AddTicks(840), new DateTime(2024, 7, 21, 17, 28, 17, 464, DateTimeKind.Local).AddTicks(843) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("2aa84ed4-a495-47c8-913f-fa5928c1b4b8"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 21, 17, 28, 17, 461, DateTimeKind.Local).AddTicks(5142), new DateTime(2024, 7, 21, 17, 28, 17, 461, DateTimeKind.Local).AddTicks(5148) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("3ff4f468-53ef-48a3-8781-61a8a053fa99"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 21, 17, 28, 17, 461, DateTimeKind.Local).AddTicks(5173), new DateTime(2024, 7, 21, 17, 28, 17, 461, DateTimeKind.Local).AddTicks(5175) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("564d0272-92c8-4108-82b2-0f98882058d4"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 21, 17, 28, 17, 461, DateTimeKind.Local).AddTicks(5179), new DateTime(2024, 7, 21, 17, 28, 17, 461, DateTimeKind.Local).AddTicks(5211) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 21, 17, 28, 17, 461, DateTimeKind.Local).AddTicks(5215), new DateTime(2024, 7, 21, 17, 28, 17, 461, DateTimeKind.Local).AddTicks(5216) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("c1cb273c-570a-42f5-b563-66bac08911cc"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 21, 17, 28, 17, 461, DateTimeKind.Local).AddTicks(5220), new DateTime(2024, 7, 21, 17, 28, 17, 461, DateTimeKind.Local).AddTicks(5221) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("c1cb273c-570a-42f5-b563-66bac08911cd"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 21, 17, 28, 17, 461, DateTimeKind.Local).AddTicks(5241), new DateTime(2024, 7, 21, 17, 28, 17, 461, DateTimeKind.Local).AddTicks(5243) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc1"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 21, 17, 28, 17, 461, DateTimeKind.Local).AddTicks(5236), new DateTime(2024, 7, 21, 17, 28, 17, 461, DateTimeKind.Local).AddTicks(5237) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("18a79217-9fa7-460d-bccc-e74285b07531"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 21, 17, 28, 17, 465, DateTimeKind.Local).AddTicks(6417), new DateTime(2024, 8, 21, 17, 28, 17, 465, DateTimeKind.Local).AddTicks(6418) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("f2cf879b-34f3-41da-9445-ee3bc590f224"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 21, 17, 28, 17, 465, DateTimeKind.Local).AddTicks(6421), new DateTime(2024, 8, 21, 17, 28, 17, 465, DateTimeKind.Local).AddTicks(6422) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("fcddbf6b-88b8-4fae-ade7-63150ce1f1ec"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 21, 17, 28, 17, 465, DateTimeKind.Local).AddTicks(6399), new DateTime(2024, 8, 21, 17, 28, 17, 465, DateTimeKind.Local).AddTicks(6405) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("1a157bf0-4748-4589-91cc-1450e0c06596"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 21, 17, 28, 17, 461, DateTimeKind.Local).AddTicks(7105), new DateTime(2024, 7, 21, 17, 28, 17, 461, DateTimeKind.Local).AddTicks(7106) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 21, 17, 28, 17, 461, DateTimeKind.Local).AddTicks(7139), new DateTime(2024, 7, 21, 17, 28, 17, 461, DateTimeKind.Local).AddTicks(7141) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("3fa85f64-5717-4562-b3fc-2c963f66afa6"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 21, 17, 28, 17, 461, DateTimeKind.Local).AddTicks(7135), new DateTime(2024, 7, 21, 17, 28, 17, 461, DateTimeKind.Local).AddTicks(7136) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 21, 17, 28, 17, 461, DateTimeKind.Local).AddTicks(7067), new DateTime(2024, 7, 21, 17, 28, 17, 461, DateTimeKind.Local).AddTicks(7073) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 21, 17, 28, 17, 461, DateTimeKind.Local).AddTicks(7099), new DateTime(2024, 7, 21, 17, 28, 17, 461, DateTimeKind.Local).AddTicks(7101) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("3ff4f468-53ef-48a3-8781-61a8a053fa99"), new Guid("1a157bf0-4748-4589-91cc-1450e0c06596") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 21, 17, 28, 17, 462, DateTimeKind.Local).AddTicks(2029), new DateTime(2024, 7, 21, 17, 28, 17, 462, DateTimeKind.Local).AddTicks(2035) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("564d0272-92c8-4108-82b2-0f98882058d4"), new Guid("1a157bf0-4748-4589-91cc-1450e0c06596") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 21, 17, 28, 17, 462, DateTimeKind.Local).AddTicks(2059), new DateTime(2024, 7, 21, 17, 28, 17, 462, DateTimeKind.Local).AddTicks(2060) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"), new Guid("1a157bf0-4748-4589-91cc-1450e0c06596") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 21, 17, 28, 17, 462, DateTimeKind.Local).AddTicks(2129), new DateTime(2024, 7, 21, 17, 28, 17, 462, DateTimeKind.Local).AddTicks(2131) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("564d0272-92c8-4108-82b2-0f98882058d4"), new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 21, 17, 28, 17, 462, DateTimeKind.Local).AddTicks(2135), new DateTime(2024, 7, 21, 17, 28, 17, 462, DateTimeKind.Local).AddTicks(2136) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"), new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 21, 17, 28, 17, 462, DateTimeKind.Local).AddTicks(2139), new DateTime(2024, 7, 21, 17, 28, 17, 462, DateTimeKind.Local).AddTicks(2140) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("e8eb7171-de01-4a85-a955-711b211eecc1"), new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 21, 17, 28, 17, 462, DateTimeKind.Local).AddTicks(2148), new DateTime(2024, 7, 21, 17, 28, 17, 462, DateTimeKind.Local).AddTicks(2150) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("c1cb273c-570a-42f5-b563-66bac08911cc"), new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 21, 17, 28, 17, 462, DateTimeKind.Local).AddTicks(2186), new DateTime(2024, 7, 21, 17, 28, 17, 462, DateTimeKind.Local).AddTicks(2188) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("c1cb273c-570a-42f5-b563-66bac08911cd"), new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 21, 17, 28, 17, 462, DateTimeKind.Local).AddTicks(2191), new DateTime(2024, 7, 21, 17, 28, 17, 462, DateTimeKind.Local).AddTicks(2193) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("2aa84ed4-a495-47c8-913f-fa5928c1b4b8"), new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 21, 17, 28, 17, 462, DateTimeKind.Local).AddTicks(2170), new DateTime(2024, 7, 21, 17, 28, 17, 462, DateTimeKind.Local).AddTicks(2172) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("564d0272-92c8-4108-82b2-0f98882058d4"), new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 21, 17, 28, 17, 462, DateTimeKind.Local).AddTicks(2175), new DateTime(2024, 7, 21, 17, 28, 17, 462, DateTimeKind.Local).AddTicks(2177) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"), new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 21, 17, 28, 17, 462, DateTimeKind.Local).AddTicks(2180), new DateTime(2024, 7, 21, 17, 28, 17, 462, DateTimeKind.Local).AddTicks(2181) });

            migrationBuilder.UpdateData(
                table: "trTask",
                keyColumn: "Id",
                keyValue: new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 21, 17, 28, 17, 461, DateTimeKind.Local).AddTicks(9477), new DateTime(2024, 7, 21, 17, 28, 17, 461, DateTimeKind.Local).AddTicks(9483) });

            migrationBuilder.UpdateData(
                table: "trTask",
                keyColumn: "Id",
                keyValue: new Guid("4422cc3c-0ea5-4d73-a31e-a42485a81003"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 21, 17, 28, 17, 461, DateTimeKind.Local).AddTicks(9511), new DateTime(2024, 7, 21, 17, 28, 17, 461, DateTimeKind.Local).AddTicks(9513) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("1a157bf0-4748-4589-91cc-1450e0c06596"), new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 21, 17, 28, 17, 462, DateTimeKind.Local).AddTicks(578), new DateTime(2024, 7, 21, 17, 28, 17, 462, DateTimeKind.Local).AddTicks(584) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5"), new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 21, 17, 28, 17, 462, DateTimeKind.Local).AddTicks(605), new DateTime(2024, 7, 21, 17, 28, 17, 462, DateTimeKind.Local).AddTicks(607) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911"), new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 21, 17, 28, 17, 462, DateTimeKind.Local).AddTicks(610), new DateTime(2024, 7, 21, 17, 28, 17, 462, DateTimeKind.Local).AddTicks(611) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496"), new Guid("4422cc3c-0ea5-4d73-a31e-a42485a81003") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 21, 17, 28, 17, 462, DateTimeKind.Local).AddTicks(642), new DateTime(2024, 7, 21, 17, 28, 17, 462, DateTimeKind.Local).AddTicks(643) });
        }
    }
}
