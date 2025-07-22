using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace TCCTOBK.OperationBackend.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class TableShiftAttendantAndManPower : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "mtShift",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "character varying", maxLength: 255, nullable: false),
                    StartTime = table.Column<TimeSpan>(type: "interval", nullable: false),
                    EndTime = table.Column<TimeSpan>(type: "interval", nullable: false),
                    AllowCheckInStart = table.Column<TimeSpan>(type: "interval", nullable: false),
                    AllowCheckInEnd = table.Column<TimeSpan>(type: "interval", nullable: false),
                    CheckoutTimeEnd = table.Column<TimeSpan>(type: "interval", nullable: false),
                    isOverNight = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_mtShift", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "mtShiftManPowerRequest",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Shift = table.Column<string>(type: "character varying", maxLength: 255, nullable: false),
                    BaseLocation = table.Column<string>(type: "character varying", maxLength: 255, nullable: false),
                    Company = table.Column<string>(type: "character varying", maxLength: 255, nullable: false),
                    Role = table.Column<string>(type: "character varying", maxLength: 255, nullable: false),
                    Demand = table.Column<int>(type: "integer", nullable: false),
                    StartDateTime = table.Column<DateTime>(type: "timestamp without time zone", maxLength: 100, nullable: true),
                    EndDateTime = table.Column<DateTime>(type: "timestamp without time zone", maxLength: 100, nullable: true),
                    CreatedBy = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    CreatedByName = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "timestamp without time zone", maxLength: 100, nullable: false),
                    UpdatedBy = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    UpdatedByName = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "timestamp without time zone", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_mtShiftManPowerRequest", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "trAttendance",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Shift = table.Column<string>(type: "character varying", maxLength: 255, nullable: false),
                    UserId = table.Column<string>(type: "character varying", maxLength: 255, nullable: false),
                    Firstname = table.Column<string>(type: "character varying", maxLength: 255, nullable: false),
                    Lastname = table.Column<string>(type: "character varying", maxLength: 255, nullable: false),
                    Company = table.Column<string>(type: "character varying", maxLength: 255, nullable: false),
                    Role = table.Column<string>(type: "character varying", maxLength: 255, nullable: false),
                    BaseLocation = table.Column<string>(type: "character varying", maxLength: 255, nullable: false),
                    DeviceKey = table.Column<string>(type: "character varying", maxLength: 255, nullable: false),
                    DeviceName = table.Column<string>(type: "character varying", maxLength: 255, nullable: false),
                    IndentifyType = table.Column<string>(type: "character varying", maxLength: 255, nullable: false),
                    IdentifyDate = table.Column<string>(type: "text", nullable: false),
                    CheckInDateTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CheckOutDateTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    MetaData = table.Column<string>(type: "json", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_trAttendance", x => x.Id);
                });

            migrationBuilder.UpdateData(
                table: "Location",
                keyColumn: "LID",
                keyValue: new Guid("2c055101-2271-44e0-95fe-bcf2c59a459a"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(9377), new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(9381) });

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
                    { 1, "CI", "G4S", "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 6, 27, 22, 22, 54, 840, DateTimeKind.Local).AddTicks(9522), 90, null, "Security Guard", "socNight", new DateTime(2024, 6, 27, 22, 22, 54, 840, DateTimeKind.Local).AddTicks(9200), "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 6, 27, 22, 22, 54, 840, DateTimeKind.Local).AddTicks(9526) },
                    { 2, "CI", "G4S", "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 6, 27, 22, 22, 54, 840, DateTimeKind.Local).AddTicks(9542), 120, null, "Security Guard", "socDay", new DateTime(2024, 6, 27, 22, 22, 54, 840, DateTimeKind.Local).AddTicks(9541), "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 6, 27, 22, 22, 54, 840, DateTimeKind.Local).AddTicks(9543) },
                    { 3, "ONE Power", "G4S", "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 6, 27, 22, 22, 54, 840, DateTimeKind.Local).AddTicks(9545), 20, null, "Security Guard", "socNight", new DateTime(2024, 6, 27, 22, 22, 54, 840, DateTimeKind.Local).AddTicks(9544), "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 6, 27, 22, 22, 54, 840, DateTimeKind.Local).AddTicks(9546) },
                    { 4, "ONE Power", "G4S", "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 6, 27, 22, 22, 54, 840, DateTimeKind.Local).AddTicks(9549), 30, null, "Security Guard", "socDay", new DateTime(2024, 6, 27, 22, 22, 54, 840, DateTimeKind.Local).AddTicks(9548), "00000000-0000-0000-0000-000000000000", "system", new DateTime(2024, 6, 27, 22, 22, 54, 840, DateTimeKind.Local).AddTicks(9549) }
                });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("2aa84ed4-a495-47c8-913f-fa5928c1b4b8"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(3360), new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(3365) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("3ff4f468-53ef-48a3-8781-61a8a053fa99"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(3382), new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(3383) });

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
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(3423), new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(3424) });

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "mtShift");

            migrationBuilder.DropTable(
                name: "mtShiftManPowerRequest");

            migrationBuilder.DropTable(
                name: "trAttendance");

            migrationBuilder.UpdateData(
                table: "Location",
                keyColumn: "LID",
                keyValue: new Guid("2c055101-2271-44e0-95fe-bcf2c59a459a"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(7363), new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(7367) });

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("4199e4de-bdf8-48f8-a8a8-a5b31756a748"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 25, 16, 10, 17, 868, DateTimeKind.Local).AddTicks(9855), new DateTime(2024, 7, 25, 16, 10, 17, 869, DateTimeKind.Local).AddTicks(4725) });

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("caa4ebec-15c8-4d6b-9985-6d6b66f94e63"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 25, 16, 10, 17, 869, DateTimeKind.Local).AddTicks(5200), new DateTime(2024, 7, 25, 16, 10, 17, 869, DateTimeKind.Local).AddTicks(5203) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc2"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 25, 16, 10, 17, 872, DateTimeKind.Local).AddTicks(9440), new DateTime(2024, 6, 25, 16, 10, 17, 872, DateTimeKind.Local).AddTicks(9517) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc3"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 25, 16, 10, 17, 872, DateTimeKind.Local).AddTicks(9539), new DateTime(2024, 6, 25, 16, 10, 17, 872, DateTimeKind.Local).AddTicks(9540) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc4"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 25, 16, 10, 17, 872, DateTimeKind.Local).AddTicks(9542), new DateTime(2024, 6, 25, 16, 10, 17, 872, DateTimeKind.Local).AddTicks(9543) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc5"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 25, 16, 10, 17, 872, DateTimeKind.Local).AddTicks(9545), new DateTime(2024, 6, 25, 16, 10, 17, 872, DateTimeKind.Local).AddTicks(9546) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("2aa84ed4-a495-47c8-913f-fa5928c1b4b8"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(1072), new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(1077) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("3ff4f468-53ef-48a3-8781-61a8a053fa99"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(1094), new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(1095) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("564d0272-92c8-4108-82b2-0f98882058d4"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(1098), new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(1099) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(1121), new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(1122) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("c1cb273c-570a-42f5-b563-66bac08911cc"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(1125), new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(1126) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("c1cb273c-570a-42f5-b563-66bac08911cd"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(1136), new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(1137) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc1"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(1133), new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(1134) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("18a79217-9fa7-460d-bccc-e74285b07531"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 25, 16, 10, 17, 874, DateTimeKind.Local).AddTicks(5720), new DateTime(2024, 7, 25, 16, 10, 17, 874, DateTimeKind.Local).AddTicks(5720) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("f2cf879b-34f3-41da-9445-ee3bc590f224"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 25, 16, 10, 17, 874, DateTimeKind.Local).AddTicks(5723), new DateTime(2024, 7, 25, 16, 10, 17, 874, DateTimeKind.Local).AddTicks(5723) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("fcddbf6b-88b8-4fae-ade7-63150ce1f1ec"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 25, 16, 10, 17, 874, DateTimeKind.Local).AddTicks(5709), new DateTime(2024, 7, 25, 16, 10, 17, 874, DateTimeKind.Local).AddTicks(5712) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("1a157bf0-4748-4589-91cc-1450e0c06596"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(2563), new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(2564) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(2580), new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(2581) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("3fa85f64-5717-4562-b3fc-2c963f66afa6"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(2577), new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(2578) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(2485), new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(2489) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(2558), new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(2560) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("3ff4f468-53ef-48a3-8781-61a8a053fa99"), new Guid("1a157bf0-4748-4589-91cc-1450e0c06596") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(5771), new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(5774) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("564d0272-92c8-4108-82b2-0f98882058d4"), new Guid("1a157bf0-4748-4589-91cc-1450e0c06596") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(5789), new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(5790) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"), new Guid("1a157bf0-4748-4589-91cc-1450e0c06596") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(5793), new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(5794) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("564d0272-92c8-4108-82b2-0f98882058d4"), new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(5796), new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(5797) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"), new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(5800), new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(5800) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("e8eb7171-de01-4a85-a955-711b211eecc1"), new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(5806), new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(5807) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("c1cb273c-570a-42f5-b563-66bac08911cc"), new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(5822), new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(5823) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("c1cb273c-570a-42f5-b563-66bac08911cd"), new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(5825), new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(5826) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("2aa84ed4-a495-47c8-913f-fa5928c1b4b8"), new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(5809), new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(5810) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("564d0272-92c8-4108-82b2-0f98882058d4"), new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(5813), new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(5814) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"), new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(5817), new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(5818) });

            migrationBuilder.UpdateData(
                table: "trTask",
                keyColumn: "Id",
                keyValue: new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(4011), new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(4015) });

            migrationBuilder.UpdateData(
                table: "trTask",
                keyColumn: "Id",
                keyValue: new Guid("4422cc3c-0ea5-4d73-a31e-a42485a81003"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(4032), new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(4033) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("1a157bf0-4748-4589-91cc-1450e0c06596"), new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(4754), new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(4757) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5"), new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(4772), new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(4773) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911"), new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(4775), new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(4776) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496"), new Guid("4422cc3c-0ea5-4d73-a31e-a42485a81003") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(4778), new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(4797) });
        }
    }
}
