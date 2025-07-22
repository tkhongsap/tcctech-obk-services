using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TCCTOBK.OperationBackend.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class AddCancelReason : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "CheckOut",
                table: "WorkTransaction",
                type: "timestamp without time zone",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CheckIn",
                table: "WorkTransaction",
                type: "timestamp without time zone",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CancelReason",
                table: "trTask",
                type: "character varying",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CheckOutDateTime",
                table: "trAttendance",
                type: "timestamp without time zone",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CheckInDateTime",
                table: "trAttendance",
                type: "timestamp without time zone",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "LastLogoutDateTime",
                table: "taMember",
                type: "timestamp without time zone",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "LastLoginDateTime",
                table: "taMember",
                type: "timestamp without time zone",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldNullable: true);

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("4199e4de-bdf8-48f8-a8a8-a5b31756a748"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 12, 23, 14, 57, 41, 465, DateTimeKind.Local).AddTicks(7480), new DateTime(2024, 12, 23, 14, 57, 41, 482, DateTimeKind.Local).AddTicks(7890) });

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("caa4ebec-15c8-4d6b-9985-6d6b66f94e63"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 12, 23, 14, 57, 41, 482, DateTimeKind.Local).AddTicks(8130), new DateTime(2024, 12, 23, 14, 57, 41, 482, DateTimeKind.Local).AddTicks(8130) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc2"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(5900), new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(5920) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc3"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(5930), new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(5930) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc4"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(5930), new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(5930) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc5"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(5940), new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(5940) });

            migrationBuilder.UpdateData(
                table: "mtShiftManPowerRequest",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedDate", "StartDateTime", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 11, 23, 14, 57, 41, 486, DateTimeKind.Local).AddTicks(3930), new DateTime(2024, 11, 23, 14, 57, 41, 486, DateTimeKind.Local).AddTicks(3800), new DateTime(2024, 11, 23, 14, 57, 41, 486, DateTimeKind.Local).AddTicks(3930) });

            migrationBuilder.UpdateData(
                table: "mtShiftManPowerRequest",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedDate", "StartDateTime", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 11, 23, 14, 57, 41, 486, DateTimeKind.Local).AddTicks(3940), new DateTime(2024, 11, 23, 14, 57, 41, 486, DateTimeKind.Local).AddTicks(3940), new DateTime(2024, 11, 23, 14, 57, 41, 486, DateTimeKind.Local).AddTicks(3940) });

            migrationBuilder.UpdateData(
                table: "mtShiftManPowerRequest",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedDate", "StartDateTime", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 11, 23, 14, 57, 41, 486, DateTimeKind.Local).AddTicks(3950), new DateTime(2024, 11, 23, 14, 57, 41, 486, DateTimeKind.Local).AddTicks(3940), new DateTime(2024, 11, 23, 14, 57, 41, 486, DateTimeKind.Local).AddTicks(3950) });

            migrationBuilder.UpdateData(
                table: "mtShiftManPowerRequest",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedDate", "StartDateTime", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 11, 23, 14, 57, 41, 486, DateTimeKind.Local).AddTicks(3950), new DateTime(2024, 11, 23, 14, 57, 41, 486, DateTimeKind.Local).AddTicks(3950), new DateTime(2024, 11, 23, 14, 57, 41, 486, DateTimeKind.Local).AddTicks(3950) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("2aa84ed4-a495-47c8-913f-fa5928c1b4b8"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(6640), new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(6640) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("3ff4f468-53ef-48a3-8781-61a8a053fa99"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(6650), new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(6650) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("564d0272-92c8-4108-82b2-0f98882058d4"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(6650), new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(6660) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(6660), new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(6660) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("c1cb273c-570a-42f5-b563-66bac08911cc"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(6660), new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(6660) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("c1cb273c-570a-42f5-b563-66bac08911cd"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(6670), new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(6670) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc1"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(6660), new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(6670) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("18a79217-9fa7-460d-bccc-e74285b07531"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 12, 23, 14, 57, 41, 487, DateTimeKind.Local).AddTicks(190), new DateTime(2024, 12, 23, 14, 57, 41, 487, DateTimeKind.Local).AddTicks(190) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("bd69a88e-d6c1-42a1-8a3a-628843459909"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 12, 23, 14, 57, 41, 487, DateTimeKind.Local).AddTicks(200), new DateTime(2024, 12, 23, 14, 57, 41, 487, DateTimeKind.Local).AddTicks(200) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("c01c5086-cfa5-44ca-89d7-baa2c1accea6"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 12, 23, 14, 57, 41, 487, DateTimeKind.Local).AddTicks(190), new DateTime(2024, 12, 23, 14, 57, 41, 487, DateTimeKind.Local).AddTicks(200) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("d6016437-8b0f-4b0e-8175-5a11ffc480f5"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 12, 23, 14, 57, 41, 487, DateTimeKind.Local).AddTicks(190), new DateTime(2024, 12, 23, 14, 57, 41, 487, DateTimeKind.Local).AddTicks(190) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("f2cf879b-34f3-41da-9445-ee3bc590f224"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 12, 23, 14, 57, 41, 487, DateTimeKind.Local).AddTicks(190), new DateTime(2024, 12, 23, 14, 57, 41, 487, DateTimeKind.Local).AddTicks(190) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("fcddbf6b-88b8-4fae-ade7-63150ce1f1ec"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 12, 23, 14, 57, 41, 487, DateTimeKind.Local).AddTicks(180), new DateTime(2024, 12, 23, 14, 57, 41, 487, DateTimeKind.Local).AddTicks(180) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("1a157bf0-4748-4589-91cc-1450e0c06596"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(7250), new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(7250) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(7260), new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(7260) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("3fa85f64-5717-4562-b3fc-2c963f66afa6"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(7260), new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(7260) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(7240), new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(7240) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(7250), new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(7250) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("3ff4f468-53ef-48a3-8781-61a8a053fa99"), new Guid("1a157bf0-4748-4589-91cc-1450e0c06596") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(8740), new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(8740) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("564d0272-92c8-4108-82b2-0f98882058d4"), new Guid("1a157bf0-4748-4589-91cc-1450e0c06596") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(8750), new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(8750) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"), new Guid("1a157bf0-4748-4589-91cc-1450e0c06596") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(8750), new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(8750) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("564d0272-92c8-4108-82b2-0f98882058d4"), new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(8760), new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(8760) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"), new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(8760), new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(8760) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("e8eb7171-de01-4a85-a955-711b211eecc1"), new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(8760), new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(8760) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("c1cb273c-570a-42f5-b563-66bac08911cc"), new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(8800), new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(8800) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("c1cb273c-570a-42f5-b563-66bac08911cd"), new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(8800), new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(8800) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("2aa84ed4-a495-47c8-913f-fa5928c1b4b8"), new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(8770), new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(8770) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("564d0272-92c8-4108-82b2-0f98882058d4"), new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(8770), new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(8770) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"), new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(8770), new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(8770) });

            migrationBuilder.UpdateData(
                table: "trTask",
                keyColumn: "Id",
                keyValue: new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b"),
                columns: new[] { "CancelReason", "CreatedDate", "UpdatedDate" },
                values: new object[] { null, new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(7900), new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(7900) });

            migrationBuilder.UpdateData(
                table: "trTask",
                keyColumn: "Id",
                keyValue: new Guid("4422cc3c-0ea5-4d73-a31e-a42485a81003"),
                columns: new[] { "CancelReason", "CreatedDate", "UpdatedDate" },
                values: new object[] { null, new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(7910), new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(7910) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("1a157bf0-4748-4589-91cc-1450e0c06596"), new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(8260), new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(8260) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5"), new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(8270), new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(8270) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911"), new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(8270), new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(8270) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496"), new Guid("4422cc3c-0ea5-4d73-a31e-a42485a81003") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(8270), new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(8270) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CancelReason",
                table: "trTask");

            migrationBuilder.AlterColumn<DateTime>(
                name: "CheckOut",
                table: "WorkTransaction",
                type: "timestamp with time zone",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "timestamp without time zone",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CheckIn",
                table: "WorkTransaction",
                type: "timestamp with time zone",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "timestamp without time zone",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CheckOutDateTime",
                table: "trAttendance",
                type: "timestamp with time zone",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "timestamp without time zone",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CheckInDateTime",
                table: "trAttendance",
                type: "timestamp with time zone",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "timestamp without time zone",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "LastLogoutDateTime",
                table: "taMember",
                type: "timestamp with time zone",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "timestamp without time zone",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "LastLoginDateTime",
                table: "taMember",
                type: "timestamp with time zone",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "timestamp without time zone",
                oldNullable: true);

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
    }
}
