using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace TCCTOBK.OperationBackend.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class CaseMozart : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "trCases",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ShortDesc = table.Column<string>(type: "text", nullable: true),
                    CaseNo = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    EventTypeId = table.Column<int>(type: "integer", nullable: false),
                    EventTypeCode = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    LocationId = table.Column<int>(type: "integer", nullable: false),
                    LocationCode = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    LocationName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    PriorityLevelId = table.Column<int>(type: "integer", nullable: false),
                    SiteHandler = table.Column<int>(type: "integer", nullable: true),
                    StatusCode = table.Column<int>(type: "integer", nullable: true),
                    Timestamp = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "timestamp without time zone", maxLength: 100, nullable: true),
                    SlaConfigId = table.Column<int>(type: "integer", nullable: true),
                    CaseTypeId = table.Column<int>(type: "integer", nullable: true),
                    CreatedBy = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    SlaFailed = table.Column<bool>(type: "boolean", nullable: true),
                    SlaDate = table.Column<DateTime>(type: "timestamp without time zone", maxLength: 100, nullable: true),
                    Description = table.Column<string>(type: "text", nullable: true),
                    EquipmentTag = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    ExternalRefNo = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    IsCritical = table.Column<bool>(type: "boolean", nullable: true),
                    PriorityText = table.Column<string>(type: "text", nullable: true),
                    SyncStatus = table.Column<int>(type: "integer", nullable: false),
                    SyncUtcTs = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_trCases", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "trCaseMedias",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    CaseId = table.Column<int>(type: "integer", nullable: false),
                    FileName = table.Column<string>(type: "text", nullable: false),
                    Data = table.Column<string>(type: "text", nullable: false),
                    MimeType = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_trCaseMedias", x => x.Id);
                    table.ForeignKey(
                        name: "FK_trCaseMedias_trCases_CaseId",
                        column: x => x.CaseId,
                        principalTable: "trCases",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "trCaseTasks",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: true),
                    CaseId = table.Column<int>(type: "integer", nullable: false),
                    StatusCode = table.Column<int>(type: "integer", nullable: false),
                    Sequence = table.Column<int>(type: "integer", nullable: false),
                    CreatedBy = table.Column<string>(type: "text", nullable: true),
                    CreatedOn = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    ModifiedBy = table.Column<string>(type: "text", nullable: true),
                    ModifiedOn = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    AssignedStaffId = table.Column<int>(type: "integer", nullable: true),
                    AssignedStaffDisplayName = table.Column<string>(type: "text", nullable: true),
                    IsCritical = table.Column<bool>(type: "boolean", nullable: false),
                    TaskCategoryId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_trCaseTasks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_trCaseTasks_trCases_CaseId",
                        column: x => x.CaseId,
                        principalTable: "trCases",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.UpdateData(
                table: "Location",
                keyColumn: "LID",
                keyValue: new Guid("2c055101-2271-44e0-95fe-bcf2c59a459a"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 11, 25, 18, 41, 35, 859, DateTimeKind.Local).AddTicks(1691), new DateTime(2024, 11, 25, 18, 41, 35, 859, DateTimeKind.Local).AddTicks(1695) });

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

            migrationBuilder.CreateIndex(
                name: "IX_trCaseMedias_CaseId",
                table: "trCaseMedias",
                column: "CaseId");

            migrationBuilder.CreateIndex(
                name: "IX_trCaseTasks_CaseId",
                table: "trCaseTasks",
                column: "CaseId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "trCaseMedias");

            migrationBuilder.DropTable(
                name: "trCaseTasks");

            migrationBuilder.DropTable(
                name: "trCases");

            migrationBuilder.UpdateData(
                table: "Location",
                keyColumn: "LID",
                keyValue: new Guid("2c055101-2271-44e0-95fe-bcf2c59a459a"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 11, 15, 11, 37, 38, 172, DateTimeKind.Local).AddTicks(6251), new DateTime(2024, 11, 15, 11, 37, 38, 172, DateTimeKind.Local).AddTicks(6254) });

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("4199e4de-bdf8-48f8-a8a8-a5b31756a748"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 11, 15, 11, 37, 38, 166, DateTimeKind.Local).AddTicks(7701), new DateTime(2024, 11, 15, 11, 37, 38, 167, DateTimeKind.Local).AddTicks(2591) });

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("caa4ebec-15c8-4d6b-9985-6d6b66f94e63"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 11, 15, 11, 37, 38, 167, DateTimeKind.Local).AddTicks(3083), new DateTime(2024, 11, 15, 11, 37, 38, 167, DateTimeKind.Local).AddTicks(3087) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc2"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 15, 11, 37, 38, 171, DateTimeKind.Local).AddTicks(7208), new DateTime(2024, 10, 15, 11, 37, 38, 171, DateTimeKind.Local).AddTicks(7318) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc3"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 15, 11, 37, 38, 171, DateTimeKind.Local).AddTicks(7370), new DateTime(2024, 10, 15, 11, 37, 38, 171, DateTimeKind.Local).AddTicks(7371) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc4"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 15, 11, 37, 38, 171, DateTimeKind.Local).AddTicks(7374), new DateTime(2024, 10, 15, 11, 37, 38, 171, DateTimeKind.Local).AddTicks(7375) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc5"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 15, 11, 37, 38, 171, DateTimeKind.Local).AddTicks(7377), new DateTime(2024, 10, 15, 11, 37, 38, 171, DateTimeKind.Local).AddTicks(7378) });

            migrationBuilder.UpdateData(
                table: "mtShiftManPowerRequest",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedDate", "StartDateTime", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 15, 11, 37, 38, 174, DateTimeKind.Local).AddTicks(2799), new DateTime(2024, 10, 15, 11, 37, 38, 174, DateTimeKind.Local).AddTicks(2435), new DateTime(2024, 10, 15, 11, 37, 38, 174, DateTimeKind.Local).AddTicks(2804) });

            migrationBuilder.UpdateData(
                table: "mtShiftManPowerRequest",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedDate", "StartDateTime", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 15, 11, 37, 38, 174, DateTimeKind.Local).AddTicks(2827), new DateTime(2024, 10, 15, 11, 37, 38, 174, DateTimeKind.Local).AddTicks(2825), new DateTime(2024, 10, 15, 11, 37, 38, 174, DateTimeKind.Local).AddTicks(2828) });

            migrationBuilder.UpdateData(
                table: "mtShiftManPowerRequest",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedDate", "StartDateTime", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 15, 11, 37, 38, 174, DateTimeKind.Local).AddTicks(2831), new DateTime(2024, 10, 15, 11, 37, 38, 174, DateTimeKind.Local).AddTicks(2830), new DateTime(2024, 10, 15, 11, 37, 38, 174, DateTimeKind.Local).AddTicks(2832) });

            migrationBuilder.UpdateData(
                table: "mtShiftManPowerRequest",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedDate", "StartDateTime", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 15, 11, 37, 38, 174, DateTimeKind.Local).AddTicks(2835), new DateTime(2024, 10, 15, 11, 37, 38, 174, DateTimeKind.Local).AddTicks(2834), new DateTime(2024, 10, 15, 11, 37, 38, 174, DateTimeKind.Local).AddTicks(2836) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("2aa84ed4-a495-47c8-913f-fa5928c1b4b8"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 15, 11, 37, 38, 171, DateTimeKind.Local).AddTicks(8998), new DateTime(2024, 10, 15, 11, 37, 38, 171, DateTimeKind.Local).AddTicks(9003) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("3ff4f468-53ef-48a3-8781-61a8a053fa99"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 15, 11, 37, 38, 171, DateTimeKind.Local).AddTicks(9023), new DateTime(2024, 10, 15, 11, 37, 38, 171, DateTimeKind.Local).AddTicks(9024) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("564d0272-92c8-4108-82b2-0f98882058d4"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 15, 11, 37, 38, 171, DateTimeKind.Local).AddTicks(9027), new DateTime(2024, 10, 15, 11, 37, 38, 171, DateTimeKind.Local).AddTicks(9028) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 15, 11, 37, 38, 171, DateTimeKind.Local).AddTicks(9031), new DateTime(2024, 10, 15, 11, 37, 38, 171, DateTimeKind.Local).AddTicks(9032) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("c1cb273c-570a-42f5-b563-66bac08911cc"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 15, 11, 37, 38, 171, DateTimeKind.Local).AddTicks(9054), new DateTime(2024, 10, 15, 11, 37, 38, 171, DateTimeKind.Local).AddTicks(9055) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("c1cb273c-570a-42f5-b563-66bac08911cd"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 15, 11, 37, 38, 171, DateTimeKind.Local).AddTicks(9072), new DateTime(2024, 10, 15, 11, 37, 38, 171, DateTimeKind.Local).AddTicks(9073) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc1"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 15, 11, 37, 38, 171, DateTimeKind.Local).AddTicks(9068), new DateTime(2024, 10, 15, 11, 37, 38, 171, DateTimeKind.Local).AddTicks(9069) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("18a79217-9fa7-460d-bccc-e74285b07531"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 11, 15, 11, 37, 38, 175, DateTimeKind.Local).AddTicks(4267), new DateTime(2024, 11, 15, 11, 37, 38, 175, DateTimeKind.Local).AddTicks(4268) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("bd69a88e-d6c1-42a1-8a3a-628843459909"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 11, 15, 11, 37, 38, 175, DateTimeKind.Local).AddTicks(4282), new DateTime(2024, 11, 15, 11, 37, 38, 175, DateTimeKind.Local).AddTicks(4283) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("c01c5086-cfa5-44ca-89d7-baa2c1accea6"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 11, 15, 11, 37, 38, 175, DateTimeKind.Local).AddTicks(4279), new DateTime(2024, 11, 15, 11, 37, 38, 175, DateTimeKind.Local).AddTicks(4280) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("d6016437-8b0f-4b0e-8175-5a11ffc480f5"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 11, 15, 11, 37, 38, 175, DateTimeKind.Local).AddTicks(4276), new DateTime(2024, 11, 15, 11, 37, 38, 175, DateTimeKind.Local).AddTicks(4277) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("f2cf879b-34f3-41da-9445-ee3bc590f224"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 11, 15, 11, 37, 38, 175, DateTimeKind.Local).AddTicks(4271), new DateTime(2024, 11, 15, 11, 37, 38, 175, DateTimeKind.Local).AddTicks(4272) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("fcddbf6b-88b8-4fae-ade7-63150ce1f1ec"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 11, 15, 11, 37, 38, 175, DateTimeKind.Local).AddTicks(4201), new DateTime(2024, 11, 15, 11, 37, 38, 175, DateTimeKind.Local).AddTicks(4208) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("1a157bf0-4748-4589-91cc-1450e0c06596"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 15, 11, 37, 38, 172, DateTimeKind.Local).AddTicks(573), new DateTime(2024, 10, 15, 11, 37, 38, 172, DateTimeKind.Local).AddTicks(574) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 15, 11, 37, 38, 172, DateTimeKind.Local).AddTicks(580), new DateTime(2024, 10, 15, 11, 37, 38, 172, DateTimeKind.Local).AddTicks(581) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("3fa85f64-5717-4562-b3fc-2c963f66afa6"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 15, 11, 37, 38, 172, DateTimeKind.Local).AddTicks(576), new DateTime(2024, 10, 15, 11, 37, 38, 172, DateTimeKind.Local).AddTicks(577) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 15, 11, 37, 38, 172, DateTimeKind.Local).AddTicks(543), new DateTime(2024, 10, 15, 11, 37, 38, 172, DateTimeKind.Local).AddTicks(548) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 15, 11, 37, 38, 172, DateTimeKind.Local).AddTicks(569), new DateTime(2024, 10, 15, 11, 37, 38, 172, DateTimeKind.Local).AddTicks(571) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("3ff4f468-53ef-48a3-8781-61a8a053fa99"), new Guid("1a157bf0-4748-4589-91cc-1450e0c06596") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 15, 11, 37, 38, 172, DateTimeKind.Local).AddTicks(4083), new DateTime(2024, 10, 15, 11, 37, 38, 172, DateTimeKind.Local).AddTicks(4087) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("564d0272-92c8-4108-82b2-0f98882058d4"), new Guid("1a157bf0-4748-4589-91cc-1450e0c06596") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 15, 11, 37, 38, 172, DateTimeKind.Local).AddTicks(4120), new DateTime(2024, 10, 15, 11, 37, 38, 172, DateTimeKind.Local).AddTicks(4121) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"), new Guid("1a157bf0-4748-4589-91cc-1450e0c06596") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 15, 11, 37, 38, 172, DateTimeKind.Local).AddTicks(4124), new DateTime(2024, 10, 15, 11, 37, 38, 172, DateTimeKind.Local).AddTicks(4125) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("564d0272-92c8-4108-82b2-0f98882058d4"), new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 15, 11, 37, 38, 172, DateTimeKind.Local).AddTicks(4128), new DateTime(2024, 10, 15, 11, 37, 38, 172, DateTimeKind.Local).AddTicks(4129) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"), new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 15, 11, 37, 38, 172, DateTimeKind.Local).AddTicks(4133), new DateTime(2024, 10, 15, 11, 37, 38, 172, DateTimeKind.Local).AddTicks(4134) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("e8eb7171-de01-4a85-a955-711b211eecc1"), new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 15, 11, 37, 38, 172, DateTimeKind.Local).AddTicks(4140), new DateTime(2024, 10, 15, 11, 37, 38, 172, DateTimeKind.Local).AddTicks(4141) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("c1cb273c-570a-42f5-b563-66bac08911cc"), new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 15, 11, 37, 38, 172, DateTimeKind.Local).AddTicks(4168), new DateTime(2024, 10, 15, 11, 37, 38, 172, DateTimeKind.Local).AddTicks(4170) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("c1cb273c-570a-42f5-b563-66bac08911cd"), new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 15, 11, 37, 38, 172, DateTimeKind.Local).AddTicks(4172), new DateTime(2024, 10, 15, 11, 37, 38, 172, DateTimeKind.Local).AddTicks(4173) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("2aa84ed4-a495-47c8-913f-fa5928c1b4b8"), new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 15, 11, 37, 38, 172, DateTimeKind.Local).AddTicks(4144), new DateTime(2024, 10, 15, 11, 37, 38, 172, DateTimeKind.Local).AddTicks(4145) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("564d0272-92c8-4108-82b2-0f98882058d4"), new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 15, 11, 37, 38, 172, DateTimeKind.Local).AddTicks(4148), new DateTime(2024, 10, 15, 11, 37, 38, 172, DateTimeKind.Local).AddTicks(4149) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"), new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 15, 11, 37, 38, 172, DateTimeKind.Local).AddTicks(4163), new DateTime(2024, 10, 15, 11, 37, 38, 172, DateTimeKind.Local).AddTicks(4164) });

            migrationBuilder.UpdateData(
                table: "trTask",
                keyColumn: "Id",
                keyValue: new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 15, 11, 37, 38, 172, DateTimeKind.Local).AddTicks(2122), new DateTime(2024, 10, 15, 11, 37, 38, 172, DateTimeKind.Local).AddTicks(2127) });

            migrationBuilder.UpdateData(
                table: "trTask",
                keyColumn: "Id",
                keyValue: new Guid("4422cc3c-0ea5-4d73-a31e-a42485a81003"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 15, 11, 37, 38, 172, DateTimeKind.Local).AddTicks(2213), new DateTime(2024, 10, 15, 11, 37, 38, 172, DateTimeKind.Local).AddTicks(2214) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("1a157bf0-4748-4589-91cc-1450e0c06596"), new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 15, 11, 37, 38, 172, DateTimeKind.Local).AddTicks(2987), new DateTime(2024, 10, 15, 11, 37, 38, 172, DateTimeKind.Local).AddTicks(2991) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5"), new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 15, 11, 37, 38, 172, DateTimeKind.Local).AddTicks(3008), new DateTime(2024, 10, 15, 11, 37, 38, 172, DateTimeKind.Local).AddTicks(3009) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911"), new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 15, 11, 37, 38, 172, DateTimeKind.Local).AddTicks(3012), new DateTime(2024, 10, 15, 11, 37, 38, 172, DateTimeKind.Local).AddTicks(3013) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496"), new Guid("4422cc3c-0ea5-4d73-a31e-a42485a81003") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 15, 11, 37, 38, 172, DateTimeKind.Local).AddTicks(3015), new DateTime(2024, 10, 15, 11, 37, 38, 172, DateTimeKind.Local).AddTicks(3016) });
        }
    }
}
