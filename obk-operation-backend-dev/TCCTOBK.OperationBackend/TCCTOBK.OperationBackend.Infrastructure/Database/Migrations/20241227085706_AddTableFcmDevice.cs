using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace TCCTOBK.OperationBackend.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class AddTableFcmDevice : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc4"));

            migrationBuilder.DeleteData(
                table: "mtShift",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "mtShift",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "mtShiftManPowerRequest",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "mtShiftManPowerRequest",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "mtShiftManPowerRequest",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "mtShiftManPowerRequest",
                keyColumn: "Id",
                keyValue: 4);

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
                keyValues: new object[] { new Guid("c1cb273c-570a-42f5-b563-66bac08911cd"), new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496") });

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
                keyValue: new Guid("c1cb273c-570a-42f5-b563-66bac08911cd"));

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

            migrationBuilder.DeleteData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc5"));

            migrationBuilder.CreateTable(
                name: "FCMDevice",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    DeviceId = table.Column<string>(type: "text", nullable: false),
                    FcmToken = table.Column<string>(type: "text", nullable: false),
                    Platform = table.Column<string>(type: "text", nullable: false),
                    AppVersion = table.Column<string>(type: "text", nullable: false),
                    MemberId = table.Column<Guid>(type: "uuid", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedBy = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    CreatedByName = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "timestamp without time zone", maxLength: 100, nullable: false),
                    UpdatedBy = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    UpdatedByName = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "timestamp without time zone", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FCMDevice", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FCMDevice_taMember_MemberId",
                        column: x => x.MemberId,
                        principalTable: "taMember",
                        principalColumn: "MID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("4199e4de-bdf8-48f8-a8a8-a5b31756a748"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 12, 27, 15, 57, 5, 725, DateTimeKind.Local).AddTicks(5960), new DateTime(2024, 12, 27, 15, 57, 5, 739, DateTimeKind.Local).AddTicks(7150) });

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("caa4ebec-15c8-4d6b-9985-6d6b66f94e63"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 12, 27, 15, 57, 5, 739, DateTimeKind.Local).AddTicks(7410), new DateTime(2024, 12, 27, 15, 57, 5, 739, DateTimeKind.Local).AddTicks(7410) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("18a79217-9fa7-460d-bccc-e74285b07531"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 12, 27, 15, 57, 5, 740, DateTimeKind.Local).AddTicks(8940), new DateTime(2024, 12, 27, 15, 57, 5, 740, DateTimeKind.Local).AddTicks(8940) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("bd69a88e-d6c1-42a1-8a3a-628843459909"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 12, 27, 15, 57, 5, 740, DateTimeKind.Local).AddTicks(8950), new DateTime(2024, 12, 27, 15, 57, 5, 740, DateTimeKind.Local).AddTicks(8950) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("c01c5086-cfa5-44ca-89d7-baa2c1accea6"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 12, 27, 15, 57, 5, 740, DateTimeKind.Local).AddTicks(8950), new DateTime(2024, 12, 27, 15, 57, 5, 740, DateTimeKind.Local).AddTicks(8950) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("d6016437-8b0f-4b0e-8175-5a11ffc480f5"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 12, 27, 15, 57, 5, 740, DateTimeKind.Local).AddTicks(8950), new DateTime(2024, 12, 27, 15, 57, 5, 740, DateTimeKind.Local).AddTicks(8950) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("f2cf879b-34f3-41da-9445-ee3bc590f224"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 12, 27, 15, 57, 5, 740, DateTimeKind.Local).AddTicks(8940), new DateTime(2024, 12, 27, 15, 57, 5, 740, DateTimeKind.Local).AddTicks(8940) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("fcddbf6b-88b8-4fae-ade7-63150ce1f1ec"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 12, 27, 15, 57, 5, 740, DateTimeKind.Local).AddTicks(8930), new DateTime(2024, 12, 27, 15, 57, 5, 740, DateTimeKind.Local).AddTicks(8940) });

            migrationBuilder.CreateIndex(
                name: "IX_FCMDevice_MemberId",
                table: "FCMDevice",
                column: "MemberId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FCMDevice");

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

            migrationBuilder.InsertData(
                table: "mtActionType",
                columns: new[] { "Id", "Action", "CreatedBy", "CreatedByName", "CreatedDate", "UpdatedBy", "UpdatedByName", "UpdatedDate" },
                values: new object[,]
                {
                    { new Guid("e8eb7171-de01-4a85-a955-711b211eecc2"), "qr", "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(5900), "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(5920) },
                    { new Guid("e8eb7171-de01-4a85-a955-711b211eecc3"), "confirm", "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(5930), "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(5930) },
                    { new Guid("e8eb7171-de01-4a85-a955-711b211eecc4"), "photo", "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(5930), "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(5930) },
                    { new Guid("e8eb7171-de01-4a85-a955-711b211eecc5"), "complex", "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(5940), "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(5940) }
                });

            migrationBuilder.InsertData(
                table: "mtShift",
                columns: new[] { "Id", "AllowCheckInEnd", "AllowCheckInStart", "CheckoutTimeEnd", "EndTime", "Name", "StartTime", "isOverNight" },
                values: new object[,]
                {
                    { 1, new TimeSpan(0, 7, 15, 0, 0), new TimeSpan(0, 6, 0, 0, 0), new TimeSpan(0, 21, 0, 0, 0), new TimeSpan(0, 19, 0, 0, 0), "socDay", new TimeSpan(0, 7, 0, 0, 0), 0 },
                    { 2, new TimeSpan(0, 19, 15, 0, 0), new TimeSpan(0, 18, 0, 0, 0), new TimeSpan(0, 9, 0, 0, 0), new TimeSpan(0, 7, 0, 0, 0), "socNight", new TimeSpan(0, 19, 0, 0, 0), 1 }
                });

            migrationBuilder.InsertData(
                table: "mtShiftManPowerRequest",
                columns: new[] { "Id", "BaseLocation", "Company", "CreatedBy", "CreatedByName", "CreatedDate", "Demand", "EndDateTime", "Role", "Shift", "StartDateTime", "UpdatedBy", "UpdatedByName", "UpdatedDate" },
                values: new object[,]
                {
                    { 1, "ONE Power", "G4S", "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 11, 23, 14, 57, 41, 486, DateTimeKind.Local).AddTicks(3930), 1, null, "Security Supervisor", "socNight", new DateTime(2024, 11, 23, 14, 57, 41, 486, DateTimeKind.Local).AddTicks(3800), "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 11, 23, 14, 57, 41, 486, DateTimeKind.Local).AddTicks(3930) },
                    { 2, "ONE Power", "G4S", "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 11, 23, 14, 57, 41, 486, DateTimeKind.Local).AddTicks(3940), 1, null, "Security Supervisor", "socDay", new DateTime(2024, 11, 23, 14, 57, 41, 486, DateTimeKind.Local).AddTicks(3940), "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 11, 23, 14, 57, 41, 486, DateTimeKind.Local).AddTicks(3940) },
                    { 3, "ONE Power", "G4S", "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 11, 23, 14, 57, 41, 486, DateTimeKind.Local).AddTicks(3950), 3, null, "Security Officer", "socNight", new DateTime(2024, 11, 23, 14, 57, 41, 486, DateTimeKind.Local).AddTicks(3940), "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 11, 23, 14, 57, 41, 486, DateTimeKind.Local).AddTicks(3950) },
                    { 4, "ONE Power", "G4S", "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 11, 23, 14, 57, 41, 486, DateTimeKind.Local).AddTicks(3950), 5, null, "Security Officer", "socDay", new DateTime(2024, 11, 23, 14, 57, 41, 486, DateTimeKind.Local).AddTicks(3950), "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 11, 23, 14, 57, 41, 486, DateTimeKind.Local).AddTicks(3950) }
                });

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

            migrationBuilder.InsertData(
                table: "trSubtask",
                columns: new[] { "Id", "CreatedBy", "CreatedByName", "CreatedDate", "Name", "Remarks", "StatusId", "UpdatedBy", "UpdatedByName", "UpdatedDate" },
                values: new object[,]
                {
                    { new Guid("1a157bf0-4748-4589-91cc-1450e0c06596"), "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(7250), "L-10, Fire Exit Door 2 (Passenger Elevator)", null, 0, "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(7250) },
                    { new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5"), "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(7260), "L-10, Fire Exit Door 1 (Passenger Elevator)", null, 0, "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(7260) },
                    { new Guid("3fa85f64-5717-4562-b3fc-2c963f66afa6"), "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(7260), "L-10, Fire Exit Door 4 (Passenger Elevator)", null, 0, "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(7260) },
                    { new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496"), "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(7240), "Distress Alert", null, 0, "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(7240) },
                    { new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911"), "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(7250), "L-10, Fire Exit Door 3 (Passenger Elevator)", null, 0, "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(7250) }
                });

            migrationBuilder.InsertData(
                table: "trTask",
                columns: new[] { "Id", "AcknowledgeDate", "CancelReason", "CompleteDate", "CreatedBy", "CreatedByName", "CreatedDate", "EndDate", "IsLate", "LocationId", "MemberId", "Name", "StartDate", "StatusId", "UpdatedBy", "UpdatedByName", "UpdatedDate" },
                values: new object[,]
                {
                    { new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b"), null, null, null, "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(7900), null, null, new Guid("2c055101-2271-44e0-95fe-bcf2c59a459a"), new Guid("00000000-0000-0000-0000-000000000000"), "Illegal Parking", null, 0, "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(7900) },
                    { new Guid("4422cc3c-0ea5-4d73-a31e-a42485a81003"), null, null, null, "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(7910), null, null, new Guid("2c055101-2271-44e0-95fe-bcf2c59a459a"), new Guid("00000000-0000-0000-0000-000000000000"), "Distress Alert", null, 0, "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(7910) }
                });

            migrationBuilder.InsertData(
                table: "trAction",
                columns: new[] { "Id", "ActionType", "CreatedBy", "CreatedByName", "CreatedDate", "Description", "IsRequired", "MetaData", "Name", "UpdatedBy", "UpdatedByName", "UpdatedDate" },
                values: new object[,]
                {
                    { new Guid("2aa84ed4-a495-47c8-913f-fa5928c1b4b8"), new Guid("e8eb7171-de01-4a85-a955-711b211eecc2"), "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(6640), "L-10, Fire Exit Door 3 (Passenger Elevator)", 0, "{\"QrId\":\"Test1\"}", "Scan QR Code", "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(6640) },
                    { new Guid("3ff4f468-53ef-48a3-8781-61a8a053fa99"), new Guid("e8eb7171-de01-4a85-a955-711b211eecc2"), "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(6650), "L-10, Fire Exit Door 2 (Passenger Elevator)", 0, "{\"QrId\":\"Test2\"}", "Scan QR Code", "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(6650) },
                    { new Guid("564d0272-92c8-4108-82b2-0f98882058d4"), new Guid("e8eb7171-de01-4a85-a955-711b211eecc3"), "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(6650), "Inspect fire exits and make sure all the doors are closed", 0, null, "Inspect Fire doors", "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(6660) },
                    { new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"), new Guid("e8eb7171-de01-4a85-a955-711b211eecc3"), "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(6660), "Inspect fire exits and make sure all the doors are closed", 0, null, "Inspect Fire doors", "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(6660) },
                    { new Guid("c1cb273c-570a-42f5-b563-66bac08911cc"), new Guid("e8eb7171-de01-4a85-a955-711b211eecc3"), "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(6660), "Check Distress Alert", 0, null, "Distress Alert", "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(6660) },
                    { new Guid("c1cb273c-570a-42f5-b563-66bac08911cd"), new Guid("e8eb7171-de01-4a85-a955-711b211eecc5"), "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(6670), "Check Distress Alert", 0, null, "Distress Alert", "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(6670) },
                    { new Guid("e8eb7171-de01-4a85-a955-711b211eecc1"), new Guid("e8eb7171-de01-4a85-a955-711b211eecc2"), "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(6660), "L-10, Fire Exit Door 1 (Passenger Elevator)", 0, "{\"QrId\":\"Test3\"}", "Scan QR Code", "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(6670) }
                });

            migrationBuilder.InsertData(
                table: "trTaskSubtask",
                columns: new[] { "Subtask", "Task", "CreatedBy", "CreatedByName", "CreatedDate", "Seq", "UpdatedBy", "UpdatedByName", "UpdatedDate" },
                values: new object[,]
                {
                    { new Guid("1a157bf0-4748-4589-91cc-1450e0c06596"), new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b"), "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(8260), 0, "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(8260) },
                    { new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5"), new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b"), "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(8270), 0, "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(8270) },
                    { new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911"), new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b"), "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(8270), 0, "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(8270) },
                    { new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496"), new Guid("4422cc3c-0ea5-4d73-a31e-a42485a81003"), "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(8270), 0, "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(8270) }
                });

            migrationBuilder.InsertData(
                table: "trSubtaskAction",
                columns: new[] { "Action", "Subtask", "CreatedBy", "CreatedByName", "CreatedDate", "MetaData", "Reading", "Remarks", "Seq", "StatusId", "UpdatedBy", "UpdatedByName", "UpdatedDate" },
                values: new object[,]
                {
                    { new Guid("3ff4f468-53ef-48a3-8781-61a8a053fa99"), new Guid("1a157bf0-4748-4589-91cc-1450e0c06596"), "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(8740), null, null, null, 0, 0, "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(8740) },
                    { new Guid("564d0272-92c8-4108-82b2-0f98882058d4"), new Guid("1a157bf0-4748-4589-91cc-1450e0c06596"), "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(8750), null, null, null, 0, 0, "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(8750) },
                    { new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"), new Guid("1a157bf0-4748-4589-91cc-1450e0c06596"), "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(8750), null, null, null, 0, 0, "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(8750) },
                    { new Guid("564d0272-92c8-4108-82b2-0f98882058d4"), new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5"), "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(8760), null, null, null, 0, 0, "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(8760) },
                    { new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"), new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5"), "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(8760), null, null, null, 0, 0, "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(8760) },
                    { new Guid("e8eb7171-de01-4a85-a955-711b211eecc1"), new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5"), "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(8760), null, null, null, 0, 0, "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(8760) },
                    { new Guid("c1cb273c-570a-42f5-b563-66bac08911cc"), new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496"), "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(8800), null, null, null, 0, 0, "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(8800) },
                    { new Guid("c1cb273c-570a-42f5-b563-66bac08911cd"), new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496"), "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(8800), null, null, null, 0, 0, "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(8800) },
                    { new Guid("2aa84ed4-a495-47c8-913f-fa5928c1b4b8"), new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911"), "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(8770), null, null, null, 0, 0, "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(8770) },
                    { new Guid("564d0272-92c8-4108-82b2-0f98882058d4"), new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911"), "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(8770), null, null, null, 0, 0, "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(8770) },
                    { new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"), new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911"), "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(8770), null, null, null, 0, 0, "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 11, 23, 14, 57, 41, 485, DateTimeKind.Local).AddTicks(8770) }
                });
        }
    }
}
