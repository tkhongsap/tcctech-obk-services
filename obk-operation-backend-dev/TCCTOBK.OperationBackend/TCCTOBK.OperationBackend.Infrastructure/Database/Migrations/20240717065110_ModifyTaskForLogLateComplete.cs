using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TCCTOBK.OperationBackend.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class ModifyTaskForLogLateComplete : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "CompleteDate",
                table: "trTask",
                type: "timestamp without time zone",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsLate",
                table: "trTask",
                type: "boolean",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "Location",
                keyColumn: "LID",
                keyValue: new Guid("2c055101-2271-44e0-95fe-bcf2c59a459a"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 17, 13, 51, 8, 286, DateTimeKind.Local).AddTicks(8218), new DateTime(2024, 6, 17, 13, 51, 8, 286, DateTimeKind.Local).AddTicks(8226) });

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("4199e4de-bdf8-48f8-a8a8-a5b31756a748"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 17, 13, 51, 8, 279, DateTimeKind.Local).AddTicks(2100), new DateTime(2024, 7, 17, 13, 51, 8, 279, DateTimeKind.Local).AddTicks(7499) });

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("caa4ebec-15c8-4d6b-9985-6d6b66f94e63"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 17, 13, 51, 8, 279, DateTimeKind.Local).AddTicks(8375), new DateTime(2024, 7, 17, 13, 51, 8, 279, DateTimeKind.Local).AddTicks(8380) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc2"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 17, 13, 51, 8, 285, DateTimeKind.Local).AddTicks(407), new DateTime(2024, 6, 17, 13, 51, 8, 285, DateTimeKind.Local).AddTicks(538) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc3"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 17, 13, 51, 8, 285, DateTimeKind.Local).AddTicks(589), new DateTime(2024, 6, 17, 13, 51, 8, 285, DateTimeKind.Local).AddTicks(591) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc4"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 17, 13, 51, 8, 285, DateTimeKind.Local).AddTicks(596), new DateTime(2024, 6, 17, 13, 51, 8, 285, DateTimeKind.Local).AddTicks(598) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc5"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 17, 13, 51, 8, 285, DateTimeKind.Local).AddTicks(601), new DateTime(2024, 6, 17, 13, 51, 8, 285, DateTimeKind.Local).AddTicks(603) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("2aa84ed4-a495-47c8-913f-fa5928c1b4b8"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 17, 13, 51, 8, 285, DateTimeKind.Local).AddTicks(3222), new DateTime(2024, 6, 17, 13, 51, 8, 285, DateTimeKind.Local).AddTicks(3231) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("3ff4f468-53ef-48a3-8781-61a8a053fa99"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 17, 13, 51, 8, 285, DateTimeKind.Local).AddTicks(3267), new DateTime(2024, 6, 17, 13, 51, 8, 285, DateTimeKind.Local).AddTicks(3270) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("564d0272-92c8-4108-82b2-0f98882058d4"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 17, 13, 51, 8, 285, DateTimeKind.Local).AddTicks(3276), new DateTime(2024, 6, 17, 13, 51, 8, 285, DateTimeKind.Local).AddTicks(3277) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 17, 13, 51, 8, 285, DateTimeKind.Local).AddTicks(3320), new DateTime(2024, 6, 17, 13, 51, 8, 285, DateTimeKind.Local).AddTicks(3322) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("c1cb273c-570a-42f5-b563-66bac08911cc"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 17, 13, 51, 8, 285, DateTimeKind.Local).AddTicks(3327), new DateTime(2024, 6, 17, 13, 51, 8, 285, DateTimeKind.Local).AddTicks(3329) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("c1cb273c-570a-42f5-b563-66bac08911cd"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 17, 13, 51, 8, 285, DateTimeKind.Local).AddTicks(3350), new DateTime(2024, 6, 17, 13, 51, 8, 285, DateTimeKind.Local).AddTicks(3351) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc1"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 17, 13, 51, 8, 285, DateTimeKind.Local).AddTicks(3343), new DateTime(2024, 6, 17, 13, 51, 8, 285, DateTimeKind.Local).AddTicks(3344) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("18a79217-9fa7-460d-bccc-e74285b07531"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 17, 13, 51, 8, 288, DateTimeKind.Local).AddTicks(1501), new DateTime(2024, 7, 17, 13, 51, 8, 288, DateTimeKind.Local).AddTicks(1503) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("f2cf879b-34f3-41da-9445-ee3bc590f224"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 17, 13, 51, 8, 288, DateTimeKind.Local).AddTicks(1506), new DateTime(2024, 7, 17, 13, 51, 8, 288, DateTimeKind.Local).AddTicks(1507) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("fcddbf6b-88b8-4fae-ade7-63150ce1f1ec"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 17, 13, 51, 8, 288, DateTimeKind.Local).AddTicks(1479), new DateTime(2024, 7, 17, 13, 51, 8, 288, DateTimeKind.Local).AddTicks(1488) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("1a157bf0-4748-4589-91cc-1450e0c06596"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 17, 13, 51, 8, 285, DateTimeKind.Local).AddTicks(5818), new DateTime(2024, 6, 17, 13, 51, 8, 285, DateTimeKind.Local).AddTicks(5820) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 17, 13, 51, 8, 285, DateTimeKind.Local).AddTicks(5851), new DateTime(2024, 6, 17, 13, 51, 8, 285, DateTimeKind.Local).AddTicks(5852) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("3fa85f64-5717-4562-b3fc-2c963f66afa6"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 17, 13, 51, 8, 285, DateTimeKind.Local).AddTicks(5846), new DateTime(2024, 6, 17, 13, 51, 8, 285, DateTimeKind.Local).AddTicks(5848) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 17, 13, 51, 8, 285, DateTimeKind.Local).AddTicks(5780), new DateTime(2024, 6, 17, 13, 51, 8, 285, DateTimeKind.Local).AddTicks(5785) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 17, 13, 51, 8, 285, DateTimeKind.Local).AddTicks(5814), new DateTime(2024, 6, 17, 13, 51, 8, 285, DateTimeKind.Local).AddTicks(5815) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("3ff4f468-53ef-48a3-8781-61a8a053fa99"), new Guid("1a157bf0-4748-4589-91cc-1450e0c06596") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 17, 13, 51, 8, 286, DateTimeKind.Local).AddTicks(4443), new DateTime(2024, 6, 17, 13, 51, 8, 286, DateTimeKind.Local).AddTicks(4454) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("564d0272-92c8-4108-82b2-0f98882058d4"), new Guid("1a157bf0-4748-4589-91cc-1450e0c06596") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 17, 13, 51, 8, 286, DateTimeKind.Local).AddTicks(4508), new DateTime(2024, 6, 17, 13, 51, 8, 286, DateTimeKind.Local).AddTicks(4511) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"), new Guid("1a157bf0-4748-4589-91cc-1450e0c06596") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 17, 13, 51, 8, 286, DateTimeKind.Local).AddTicks(4517), new DateTime(2024, 6, 17, 13, 51, 8, 286, DateTimeKind.Local).AddTicks(4519) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("564d0272-92c8-4108-82b2-0f98882058d4"), new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 17, 13, 51, 8, 286, DateTimeKind.Local).AddTicks(4523), new DateTime(2024, 6, 17, 13, 51, 8, 286, DateTimeKind.Local).AddTicks(4525) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"), new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 17, 13, 51, 8, 286, DateTimeKind.Local).AddTicks(4530), new DateTime(2024, 6, 17, 13, 51, 8, 286, DateTimeKind.Local).AddTicks(4532) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("e8eb7171-de01-4a85-a955-711b211eecc1"), new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 17, 13, 51, 8, 286, DateTimeKind.Local).AddTicks(4545), new DateTime(2024, 6, 17, 13, 51, 8, 286, DateTimeKind.Local).AddTicks(4547) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("c1cb273c-570a-42f5-b563-66bac08911cc"), new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 17, 13, 51, 8, 286, DateTimeKind.Local).AddTicks(4574), new DateTime(2024, 6, 17, 13, 51, 8, 286, DateTimeKind.Local).AddTicks(4576) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("c1cb273c-570a-42f5-b563-66bac08911cd"), new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 17, 13, 51, 8, 286, DateTimeKind.Local).AddTicks(4581), new DateTime(2024, 6, 17, 13, 51, 8, 286, DateTimeKind.Local).AddTicks(4582) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("2aa84ed4-a495-47c8-913f-fa5928c1b4b8"), new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 17, 13, 51, 8, 286, DateTimeKind.Local).AddTicks(4553), new DateTime(2024, 6, 17, 13, 51, 8, 286, DateTimeKind.Local).AddTicks(4554) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("564d0272-92c8-4108-82b2-0f98882058d4"), new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 17, 13, 51, 8, 286, DateTimeKind.Local).AddTicks(4559), new DateTime(2024, 6, 17, 13, 51, 8, 286, DateTimeKind.Local).AddTicks(4561) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"), new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 17, 13, 51, 8, 286, DateTimeKind.Local).AddTicks(4565), new DateTime(2024, 6, 17, 13, 51, 8, 286, DateTimeKind.Local).AddTicks(4567) });

            migrationBuilder.UpdateData(
                table: "trTask",
                keyColumn: "Id",
                keyValue: new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b"),
                columns: new[] { "CompleteDate", "CreatedDate", "IsLate", "UpdatedDate" },
                values: new object[] { null, new DateTime(2024, 6, 17, 13, 51, 8, 285, DateTimeKind.Local).AddTicks(8531), null, new DateTime(2024, 6, 17, 13, 51, 8, 285, DateTimeKind.Local).AddTicks(8537) });

            migrationBuilder.UpdateData(
                table: "trTask",
                keyColumn: "Id",
                keyValue: new Guid("4422cc3c-0ea5-4d73-a31e-a42485a81003"),
                columns: new[] { "CompleteDate", "CreatedDate", "IsLate", "UpdatedDate" },
                values: new object[] { null, new DateTime(2024, 6, 17, 13, 51, 8, 285, DateTimeKind.Local).AddTicks(8567), null, new DateTime(2024, 6, 17, 13, 51, 8, 285, DateTimeKind.Local).AddTicks(8569) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("1a157bf0-4748-4589-91cc-1450e0c06596"), new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 17, 13, 51, 8, 286, DateTimeKind.Local).AddTicks(137), new DateTime(2024, 6, 17, 13, 51, 8, 286, DateTimeKind.Local).AddTicks(148) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5"), new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 17, 13, 51, 8, 286, DateTimeKind.Local).AddTicks(320), new DateTime(2024, 6, 17, 13, 51, 8, 286, DateTimeKind.Local).AddTicks(323) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911"), new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 17, 13, 51, 8, 286, DateTimeKind.Local).AddTicks(328), new DateTime(2024, 6, 17, 13, 51, 8, 286, DateTimeKind.Local).AddTicks(330) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496"), new Guid("4422cc3c-0ea5-4d73-a31e-a42485a81003") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 17, 13, 51, 8, 286, DateTimeKind.Local).AddTicks(358), new DateTime(2024, 6, 17, 13, 51, 8, 286, DateTimeKind.Local).AddTicks(360) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CompleteDate",
                table: "trTask");

            migrationBuilder.DropColumn(
                name: "IsLate",
                table: "trTask");

            migrationBuilder.UpdateData(
                table: "Location",
                keyColumn: "LID",
                keyValue: new Guid("2c055101-2271-44e0-95fe-bcf2c59a459a"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 15, 12, 30, 17, 434, DateTimeKind.Local).AddTicks(4738), new DateTime(2024, 6, 15, 12, 30, 17, 434, DateTimeKind.Local).AddTicks(4742) });

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("4199e4de-bdf8-48f8-a8a8-a5b31756a748"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 15, 12, 30, 17, 426, DateTimeKind.Local).AddTicks(7655), new DateTime(2024, 7, 15, 12, 30, 17, 427, DateTimeKind.Local).AddTicks(6516) });

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("caa4ebec-15c8-4d6b-9985-6d6b66f94e63"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 15, 12, 30, 17, 427, DateTimeKind.Local).AddTicks(7292), new DateTime(2024, 7, 15, 12, 30, 17, 427, DateTimeKind.Local).AddTicks(7295) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc2"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 15, 12, 30, 17, 433, DateTimeKind.Local).AddTicks(4160), new DateTime(2024, 6, 15, 12, 30, 17, 433, DateTimeKind.Local).AddTicks(4262) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc3"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 15, 12, 30, 17, 433, DateTimeKind.Local).AddTicks(4314), new DateTime(2024, 6, 15, 12, 30, 17, 433, DateTimeKind.Local).AddTicks(4315) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc4"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 15, 12, 30, 17, 433, DateTimeKind.Local).AddTicks(4318), new DateTime(2024, 6, 15, 12, 30, 17, 433, DateTimeKind.Local).AddTicks(4319) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc5"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 15, 12, 30, 17, 433, DateTimeKind.Local).AddTicks(4321), new DateTime(2024, 6, 15, 12, 30, 17, 433, DateTimeKind.Local).AddTicks(4322) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("2aa84ed4-a495-47c8-913f-fa5928c1b4b8"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 15, 12, 30, 17, 433, DateTimeKind.Local).AddTicks(6845), new DateTime(2024, 6, 15, 12, 30, 17, 433, DateTimeKind.Local).AddTicks(6849) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("3ff4f468-53ef-48a3-8781-61a8a053fa99"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 15, 12, 30, 17, 433, DateTimeKind.Local).AddTicks(6868), new DateTime(2024, 6, 15, 12, 30, 17, 433, DateTimeKind.Local).AddTicks(6869) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("564d0272-92c8-4108-82b2-0f98882058d4"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 15, 12, 30, 17, 433, DateTimeKind.Local).AddTicks(6872), new DateTime(2024, 6, 15, 12, 30, 17, 433, DateTimeKind.Local).AddTicks(6873) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 15, 12, 30, 17, 433, DateTimeKind.Local).AddTicks(6876), new DateTime(2024, 6, 15, 12, 30, 17, 433, DateTimeKind.Local).AddTicks(6877) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("c1cb273c-570a-42f5-b563-66bac08911cc"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 15, 12, 30, 17, 433, DateTimeKind.Local).AddTicks(6900), new DateTime(2024, 6, 15, 12, 30, 17, 433, DateTimeKind.Local).AddTicks(6901) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("c1cb273c-570a-42f5-b563-66bac08911cd"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 15, 12, 30, 17, 433, DateTimeKind.Local).AddTicks(6916), new DateTime(2024, 6, 15, 12, 30, 17, 433, DateTimeKind.Local).AddTicks(6917) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc1"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 15, 12, 30, 17, 433, DateTimeKind.Local).AddTicks(6912), new DateTime(2024, 6, 15, 12, 30, 17, 433, DateTimeKind.Local).AddTicks(6913) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("18a79217-9fa7-460d-bccc-e74285b07531"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 15, 12, 30, 17, 435, DateTimeKind.Local).AddTicks(5981), new DateTime(2024, 7, 15, 12, 30, 17, 435, DateTimeKind.Local).AddTicks(5982) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("f2cf879b-34f3-41da-9445-ee3bc590f224"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 15, 12, 30, 17, 435, DateTimeKind.Local).AddTicks(5984), new DateTime(2024, 7, 15, 12, 30, 17, 435, DateTimeKind.Local).AddTicks(5985) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("fcddbf6b-88b8-4fae-ade7-63150ce1f1ec"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 15, 12, 30, 17, 435, DateTimeKind.Local).AddTicks(5959), new DateTime(2024, 7, 15, 12, 30, 17, 435, DateTimeKind.Local).AddTicks(5969) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("1a157bf0-4748-4589-91cc-1450e0c06596"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 15, 12, 30, 17, 433, DateTimeKind.Local).AddTicks(8241), new DateTime(2024, 6, 15, 12, 30, 17, 433, DateTimeKind.Local).AddTicks(8242) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 15, 12, 30, 17, 433, DateTimeKind.Local).AddTicks(8247), new DateTime(2024, 6, 15, 12, 30, 17, 433, DateTimeKind.Local).AddTicks(8266) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("3fa85f64-5717-4562-b3fc-2c963f66afa6"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 15, 12, 30, 17, 433, DateTimeKind.Local).AddTicks(8243), new DateTime(2024, 6, 15, 12, 30, 17, 433, DateTimeKind.Local).AddTicks(8244) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 15, 12, 30, 17, 433, DateTimeKind.Local).AddTicks(8216), new DateTime(2024, 6, 15, 12, 30, 17, 433, DateTimeKind.Local).AddTicks(8219) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 15, 12, 30, 17, 433, DateTimeKind.Local).AddTicks(8238), new DateTime(2024, 6, 15, 12, 30, 17, 433, DateTimeKind.Local).AddTicks(8238) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("3ff4f468-53ef-48a3-8781-61a8a053fa99"), new Guid("1a157bf0-4748-4589-91cc-1450e0c06596") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 15, 12, 30, 17, 434, DateTimeKind.Local).AddTicks(2641), new DateTime(2024, 6, 15, 12, 30, 17, 434, DateTimeKind.Local).AddTicks(2665) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("564d0272-92c8-4108-82b2-0f98882058d4"), new Guid("1a157bf0-4748-4589-91cc-1450e0c06596") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 15, 12, 30, 17, 434, DateTimeKind.Local).AddTicks(2692), new DateTime(2024, 6, 15, 12, 30, 17, 434, DateTimeKind.Local).AddTicks(2693) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"), new Guid("1a157bf0-4748-4589-91cc-1450e0c06596") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 15, 12, 30, 17, 434, DateTimeKind.Local).AddTicks(2696), new DateTime(2024, 6, 15, 12, 30, 17, 434, DateTimeKind.Local).AddTicks(2696) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("564d0272-92c8-4108-82b2-0f98882058d4"), new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 15, 12, 30, 17, 434, DateTimeKind.Local).AddTicks(2699), new DateTime(2024, 6, 15, 12, 30, 17, 434, DateTimeKind.Local).AddTicks(2700) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"), new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 15, 12, 30, 17, 434, DateTimeKind.Local).AddTicks(2703), new DateTime(2024, 6, 15, 12, 30, 17, 434, DateTimeKind.Local).AddTicks(2704) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("e8eb7171-de01-4a85-a955-711b211eecc1"), new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 15, 12, 30, 17, 434, DateTimeKind.Local).AddTicks(2711), new DateTime(2024, 6, 15, 12, 30, 17, 434, DateTimeKind.Local).AddTicks(2712) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("c1cb273c-570a-42f5-b563-66bac08911cc"), new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 15, 12, 30, 17, 434, DateTimeKind.Local).AddTicks(2727), new DateTime(2024, 6, 15, 12, 30, 17, 434, DateTimeKind.Local).AddTicks(2728) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("c1cb273c-570a-42f5-b563-66bac08911cd"), new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 15, 12, 30, 17, 434, DateTimeKind.Local).AddTicks(2731), new DateTime(2024, 6, 15, 12, 30, 17, 434, DateTimeKind.Local).AddTicks(2732) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("2aa84ed4-a495-47c8-913f-fa5928c1b4b8"), new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 15, 12, 30, 17, 434, DateTimeKind.Local).AddTicks(2715), new DateTime(2024, 6, 15, 12, 30, 17, 434, DateTimeKind.Local).AddTicks(2716) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("564d0272-92c8-4108-82b2-0f98882058d4"), new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 15, 12, 30, 17, 434, DateTimeKind.Local).AddTicks(2718), new DateTime(2024, 6, 15, 12, 30, 17, 434, DateTimeKind.Local).AddTicks(2719) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"), new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 15, 12, 30, 17, 434, DateTimeKind.Local).AddTicks(2722), new DateTime(2024, 6, 15, 12, 30, 17, 434, DateTimeKind.Local).AddTicks(2723) });

            migrationBuilder.UpdateData(
                table: "trTask",
                keyColumn: "Id",
                keyValue: new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 15, 12, 30, 17, 434, DateTimeKind.Local).AddTicks(154), new DateTime(2024, 6, 15, 12, 30, 17, 434, DateTimeKind.Local).AddTicks(158) });

            migrationBuilder.UpdateData(
                table: "trTask",
                keyColumn: "Id",
                keyValue: new Guid("4422cc3c-0ea5-4d73-a31e-a42485a81003"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 15, 12, 30, 17, 434, DateTimeKind.Local).AddTicks(181), new DateTime(2024, 6, 15, 12, 30, 17, 434, DateTimeKind.Local).AddTicks(182) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("1a157bf0-4748-4589-91cc-1450e0c06596"), new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 15, 12, 30, 17, 434, DateTimeKind.Local).AddTicks(1052), new DateTime(2024, 6, 15, 12, 30, 17, 434, DateTimeKind.Local).AddTicks(1056) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5"), new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 15, 12, 30, 17, 434, DateTimeKind.Local).AddTicks(1123), new DateTime(2024, 6, 15, 12, 30, 17, 434, DateTimeKind.Local).AddTicks(1125) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911"), new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 15, 12, 30, 17, 434, DateTimeKind.Local).AddTicks(1127), new DateTime(2024, 6, 15, 12, 30, 17, 434, DateTimeKind.Local).AddTicks(1128) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496"), new Guid("4422cc3c-0ea5-4d73-a31e-a42485a81003") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 15, 12, 30, 17, 434, DateTimeKind.Local).AddTicks(1131), new DateTime(2024, 6, 15, 12, 30, 17, 434, DateTimeKind.Local).AddTicks(1132) });
        }
    }
}
