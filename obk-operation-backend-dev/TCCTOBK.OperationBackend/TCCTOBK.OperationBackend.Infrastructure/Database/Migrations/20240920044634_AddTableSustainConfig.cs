using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TCCTOBK.OperationBackend.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class AddTableSustainConfig : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "trSustainabilityConfig",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Type = table.Column<int>(type: "integer", nullable: false),
                    ValueInt = table.Column<int>(type: "integer", nullable: true),
                    ValueString = table.Column<string>(type: "character varying", maxLength: 250, nullable: true),
                    CreatedBy = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    CreatedByName = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "timestamp without time zone", maxLength: 100, nullable: false),
                    UpdatedBy = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    UpdatedByName = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "timestamp without time zone", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_trSustainabilityConfig", x => x.Id);
                });

            migrationBuilder.UpdateData(
                table: "Location",
                keyColumn: "LID",
                keyValue: new Guid("2c055101-2271-44e0-95fe-bcf2c59a459a"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 9, 20, 11, 46, 33, 692, DateTimeKind.Local).AddTicks(1933), new DateTime(2024, 9, 20, 11, 46, 33, 692, DateTimeKind.Local).AddTicks(1936) });

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("4199e4de-bdf8-48f8-a8a8-a5b31756a748"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 9, 20, 11, 46, 33, 687, DateTimeKind.Local).AddTicks(2856), new DateTime(2024, 9, 20, 11, 46, 33, 687, DateTimeKind.Local).AddTicks(7598) });

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("caa4ebec-15c8-4d6b-9985-6d6b66f94e63"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 9, 20, 11, 46, 33, 687, DateTimeKind.Local).AddTicks(7973), new DateTime(2024, 9, 20, 11, 46, 33, 687, DateTimeKind.Local).AddTicks(7976) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc2"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 20, 11, 46, 33, 691, DateTimeKind.Local).AddTicks(5945), new DateTime(2024, 8, 20, 11, 46, 33, 691, DateTimeKind.Local).AddTicks(6019) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc3"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 20, 11, 46, 33, 691, DateTimeKind.Local).AddTicks(6043), new DateTime(2024, 8, 20, 11, 46, 33, 691, DateTimeKind.Local).AddTicks(6045) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc4"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 20, 11, 46, 33, 691, DateTimeKind.Local).AddTicks(6048), new DateTime(2024, 8, 20, 11, 46, 33, 691, DateTimeKind.Local).AddTicks(6049) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc5"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 20, 11, 46, 33, 691, DateTimeKind.Local).AddTicks(6052), new DateTime(2024, 8, 20, 11, 46, 33, 691, DateTimeKind.Local).AddTicks(6053) });

            migrationBuilder.UpdateData(
                table: "mtShiftManPowerRequest",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedDate", "StartDateTime", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 20, 11, 46, 33, 693, DateTimeKind.Local).AddTicks(5515), new DateTime(2024, 8, 20, 11, 46, 33, 693, DateTimeKind.Local).AddTicks(5335), new DateTime(2024, 8, 20, 11, 46, 33, 693, DateTimeKind.Local).AddTicks(5518) });

            migrationBuilder.UpdateData(
                table: "mtShiftManPowerRequest",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedDate", "StartDateTime", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 20, 11, 46, 33, 693, DateTimeKind.Local).AddTicks(5528), new DateTime(2024, 8, 20, 11, 46, 33, 693, DateTimeKind.Local).AddTicks(5526), new DateTime(2024, 8, 20, 11, 46, 33, 693, DateTimeKind.Local).AddTicks(5529) });

            migrationBuilder.UpdateData(
                table: "mtShiftManPowerRequest",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedDate", "StartDateTime", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 20, 11, 46, 33, 693, DateTimeKind.Local).AddTicks(5532), new DateTime(2024, 8, 20, 11, 46, 33, 693, DateTimeKind.Local).AddTicks(5531), new DateTime(2024, 8, 20, 11, 46, 33, 693, DateTimeKind.Local).AddTicks(5532) });

            migrationBuilder.UpdateData(
                table: "mtShiftManPowerRequest",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedDate", "StartDateTime", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 20, 11, 46, 33, 693, DateTimeKind.Local).AddTicks(5535), new DateTime(2024, 8, 20, 11, 46, 33, 693, DateTimeKind.Local).AddTicks(5534), new DateTime(2024, 8, 20, 11, 46, 33, 693, DateTimeKind.Local).AddTicks(5537) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("2aa84ed4-a495-47c8-913f-fa5928c1b4b8"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 20, 11, 46, 33, 691, DateTimeKind.Local).AddTicks(7169), new DateTime(2024, 8, 20, 11, 46, 33, 691, DateTimeKind.Local).AddTicks(7171) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("3ff4f468-53ef-48a3-8781-61a8a053fa99"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 20, 11, 46, 33, 691, DateTimeKind.Local).AddTicks(7192), new DateTime(2024, 8, 20, 11, 46, 33, 691, DateTimeKind.Local).AddTicks(7193) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("564d0272-92c8-4108-82b2-0f98882058d4"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 20, 11, 46, 33, 691, DateTimeKind.Local).AddTicks(7197), new DateTime(2024, 8, 20, 11, 46, 33, 691, DateTimeKind.Local).AddTicks(7199) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 20, 11, 46, 33, 691, DateTimeKind.Local).AddTicks(7204), new DateTime(2024, 8, 20, 11, 46, 33, 691, DateTimeKind.Local).AddTicks(7205) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("c1cb273c-570a-42f5-b563-66bac08911cc"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 20, 11, 46, 33, 691, DateTimeKind.Local).AddTicks(7208), new DateTime(2024, 8, 20, 11, 46, 33, 691, DateTimeKind.Local).AddTicks(7209) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("c1cb273c-570a-42f5-b563-66bac08911cd"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 20, 11, 46, 33, 691, DateTimeKind.Local).AddTicks(7221), new DateTime(2024, 8, 20, 11, 46, 33, 691, DateTimeKind.Local).AddTicks(7222) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc1"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 20, 11, 46, 33, 691, DateTimeKind.Local).AddTicks(7217), new DateTime(2024, 8, 20, 11, 46, 33, 691, DateTimeKind.Local).AddTicks(7218) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("18a79217-9fa7-460d-bccc-e74285b07531"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 9, 20, 11, 46, 33, 694, DateTimeKind.Local).AddTicks(1229), new DateTime(2024, 9, 20, 11, 46, 33, 694, DateTimeKind.Local).AddTicks(1230) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("f2cf879b-34f3-41da-9445-ee3bc590f224"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 9, 20, 11, 46, 33, 694, DateTimeKind.Local).AddTicks(1233), new DateTime(2024, 9, 20, 11, 46, 33, 694, DateTimeKind.Local).AddTicks(1233) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("fcddbf6b-88b8-4fae-ade7-63150ce1f1ec"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 9, 20, 11, 46, 33, 694, DateTimeKind.Local).AddTicks(1221), new DateTime(2024, 9, 20, 11, 46, 33, 694, DateTimeKind.Local).AddTicks(1225) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("1a157bf0-4748-4589-91cc-1450e0c06596"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 20, 11, 46, 33, 691, DateTimeKind.Local).AddTicks(8319), new DateTime(2024, 8, 20, 11, 46, 33, 691, DateTimeKind.Local).AddTicks(8321) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 20, 11, 46, 33, 691, DateTimeKind.Local).AddTicks(8330), new DateTime(2024, 8, 20, 11, 46, 33, 691, DateTimeKind.Local).AddTicks(8332) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("3fa85f64-5717-4562-b3fc-2c963f66afa6"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 20, 11, 46, 33, 691, DateTimeKind.Local).AddTicks(8325), new DateTime(2024, 8, 20, 11, 46, 33, 691, DateTimeKind.Local).AddTicks(8327) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 20, 11, 46, 33, 691, DateTimeKind.Local).AddTicks(8278), new DateTime(2024, 8, 20, 11, 46, 33, 691, DateTimeKind.Local).AddTicks(8281) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 20, 11, 46, 33, 691, DateTimeKind.Local).AddTicks(8313), new DateTime(2024, 8, 20, 11, 46, 33, 691, DateTimeKind.Local).AddTicks(8314) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("3ff4f468-53ef-48a3-8781-61a8a053fa99"), new Guid("1a157bf0-4748-4589-91cc-1450e0c06596") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 20, 11, 46, 33, 692, DateTimeKind.Local).AddTicks(577), new DateTime(2024, 8, 20, 11, 46, 33, 692, DateTimeKind.Local).AddTicks(579) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("564d0272-92c8-4108-82b2-0f98882058d4"), new Guid("1a157bf0-4748-4589-91cc-1450e0c06596") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 20, 11, 46, 33, 692, DateTimeKind.Local).AddTicks(590), new DateTime(2024, 8, 20, 11, 46, 33, 692, DateTimeKind.Local).AddTicks(591) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"), new Guid("1a157bf0-4748-4589-91cc-1450e0c06596") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 20, 11, 46, 33, 692, DateTimeKind.Local).AddTicks(595), new DateTime(2024, 8, 20, 11, 46, 33, 692, DateTimeKind.Local).AddTicks(596) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("564d0272-92c8-4108-82b2-0f98882058d4"), new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 20, 11, 46, 33, 692, DateTimeKind.Local).AddTicks(600), new DateTime(2024, 8, 20, 11, 46, 33, 692, DateTimeKind.Local).AddTicks(601) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"), new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 20, 11, 46, 33, 692, DateTimeKind.Local).AddTicks(604), new DateTime(2024, 8, 20, 11, 46, 33, 692, DateTimeKind.Local).AddTicks(605) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("e8eb7171-de01-4a85-a955-711b211eecc1"), new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 20, 11, 46, 33, 692, DateTimeKind.Local).AddTicks(624), new DateTime(2024, 8, 20, 11, 46, 33, 692, DateTimeKind.Local).AddTicks(625) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("c1cb273c-570a-42f5-b563-66bac08911cc"), new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 20, 11, 46, 33, 692, DateTimeKind.Local).AddTicks(646), new DateTime(2024, 8, 20, 11, 46, 33, 692, DateTimeKind.Local).AddTicks(647) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("c1cb273c-570a-42f5-b563-66bac08911cd"), new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 20, 11, 46, 33, 692, DateTimeKind.Local).AddTicks(650), new DateTime(2024, 8, 20, 11, 46, 33, 692, DateTimeKind.Local).AddTicks(651) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("2aa84ed4-a495-47c8-913f-fa5928c1b4b8"), new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 20, 11, 46, 33, 692, DateTimeKind.Local).AddTicks(629), new DateTime(2024, 8, 20, 11, 46, 33, 692, DateTimeKind.Local).AddTicks(630) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("564d0272-92c8-4108-82b2-0f98882058d4"), new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 20, 11, 46, 33, 692, DateTimeKind.Local).AddTicks(635), new DateTime(2024, 8, 20, 11, 46, 33, 692, DateTimeKind.Local).AddTicks(637) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"), new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 20, 11, 46, 33, 692, DateTimeKind.Local).AddTicks(640), new DateTime(2024, 8, 20, 11, 46, 33, 692, DateTimeKind.Local).AddTicks(641) });

            migrationBuilder.UpdateData(
                table: "trTask",
                keyColumn: "Id",
                keyValue: new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 20, 11, 46, 33, 691, DateTimeKind.Local).AddTicks(9351), new DateTime(2024, 8, 20, 11, 46, 33, 691, DateTimeKind.Local).AddTicks(9354) });

            migrationBuilder.UpdateData(
                table: "trTask",
                keyColumn: "Id",
                keyValue: new Guid("4422cc3c-0ea5-4d73-a31e-a42485a81003"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 20, 11, 46, 33, 691, DateTimeKind.Local).AddTicks(9371), new DateTime(2024, 8, 20, 11, 46, 33, 691, DateTimeKind.Local).AddTicks(9373) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("1a157bf0-4748-4589-91cc-1450e0c06596"), new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 20, 11, 46, 33, 691, DateTimeKind.Local).AddTicks(9867), new DateTime(2024, 8, 20, 11, 46, 33, 691, DateTimeKind.Local).AddTicks(9869) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5"), new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 20, 11, 46, 33, 691, DateTimeKind.Local).AddTicks(9879), new DateTime(2024, 8, 20, 11, 46, 33, 691, DateTimeKind.Local).AddTicks(9901) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911"), new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 20, 11, 46, 33, 691, DateTimeKind.Local).AddTicks(9904), new DateTime(2024, 8, 20, 11, 46, 33, 691, DateTimeKind.Local).AddTicks(9905) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496"), new Guid("4422cc3c-0ea5-4d73-a31e-a42485a81003") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 20, 11, 46, 33, 691, DateTimeKind.Local).AddTicks(9908), new DateTime(2024, 8, 20, 11, 46, 33, 691, DateTimeKind.Local).AddTicks(9909) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "trSustainabilityConfig");

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
    }
}
