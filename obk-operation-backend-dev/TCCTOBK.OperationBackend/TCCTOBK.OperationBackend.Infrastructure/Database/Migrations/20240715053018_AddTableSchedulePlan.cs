using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TCCTOBK.OperationBackend.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class AddTableSchedulePlan : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_trActivityProcedure",
                table: "trActivityProcedure");

            migrationBuilder.AlterColumn<string>(
                name: "Code",
                table: "trActivityProcedure",
                type: "character varying",
                maxLength: 500,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AddPrimaryKey(
                name: "PK_trActivityProcedure",
                table: "trActivityProcedure",
                column: "Code");

            migrationBuilder.CreateTable(
                name: "trSchedulePlan",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Route = table.Column<string>(type: "character varying", maxLength: 500, nullable: false),
                    StartTime = table.Column<TimeSpan>(type: "TIME", maxLength: 100, nullable: false),
                    EndTime = table.Column<TimeSpan>(type: "TIME", maxLength: 100, nullable: false),
                    Frequency = table.Column<string>(type: "jsonb", nullable: false),
                    MemberId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedBy = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    CreatedByName = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "timestamp without time zone", maxLength: 100, nullable: false),
                    UpdatedBy = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    UpdatedByName = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "timestamp without time zone", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_trSchedulePlan", x => x.Id);
                    table.ForeignKey(
                        name: "FK_trSchedulePlan_trActivityProcedure_Route",
                        column: x => x.Route,
                        principalTable: "trActivityProcedure",
                        principalColumn: "Code",
                        onDelete: ReferentialAction.Cascade);
                });

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

            migrationBuilder.CreateIndex(
                name: "IX_trActivityProcedure_LocationId",
                table: "trActivityProcedure",
                column: "LocationId");

            migrationBuilder.CreateIndex(
                name: "IX_trSchedulePlan_MemberId",
                table: "trSchedulePlan",
                column: "MemberId");

            migrationBuilder.CreateIndex(
                name: "IX_trSchedulePlan_Route",
                table: "trSchedulePlan",
                column: "Route");

            migrationBuilder.AddForeignKey(
                name: "FK_trActivityProcedure_Location_LocationId",
                table: "trActivityProcedure",
                column: "LocationId",
                principalTable: "Location",
                principalColumn: "LID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_trActivityProcedure_Location_LocationId",
                table: "trActivityProcedure");

            migrationBuilder.DropTable(
                name: "trSchedulePlan");

            migrationBuilder.DropPrimaryKey(
                name: "PK_trActivityProcedure",
                table: "trActivityProcedure");

            migrationBuilder.DropIndex(
                name: "IX_trActivityProcedure_LocationId",
                table: "trActivityProcedure");

            migrationBuilder.AlterColumn<string>(
                name: "Code",
                table: "trActivityProcedure",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying",
                oldMaxLength: 500);

            migrationBuilder.AddPrimaryKey(
                name: "PK_trActivityProcedure",
                table: "trActivityProcedure",
                column: "Id");

            migrationBuilder.UpdateData(
                table: "Location",
                keyColumn: "LID",
                keyValue: new Guid("2c055101-2271-44e0-95fe-bcf2c59a459a"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 14, 23, 53, 15, 597, DateTimeKind.Local).AddTicks(2510), new DateTime(2024, 6, 14, 23, 53, 15, 597, DateTimeKind.Local).AddTicks(2520) });

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("4199e4de-bdf8-48f8-a8a8-a5b31756a748"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 14, 23, 53, 15, 570, DateTimeKind.Local).AddTicks(8520), new DateTime(2024, 7, 14, 23, 53, 15, 590, DateTimeKind.Local).AddTicks(4530) });

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("caa4ebec-15c8-4d6b-9985-6d6b66f94e63"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 14, 23, 53, 15, 590, DateTimeKind.Local).AddTicks(5250), new DateTime(2024, 7, 14, 23, 53, 15, 590, DateTimeKind.Local).AddTicks(5260) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc2"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 14, 23, 53, 15, 595, DateTimeKind.Local).AddTicks(7790), new DateTime(2024, 6, 14, 23, 53, 15, 595, DateTimeKind.Local).AddTicks(7920) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc3"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 14, 23, 53, 15, 595, DateTimeKind.Local).AddTicks(7970), new DateTime(2024, 6, 14, 23, 53, 15, 595, DateTimeKind.Local).AddTicks(7970) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc4"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 14, 23, 53, 15, 595, DateTimeKind.Local).AddTicks(7980), new DateTime(2024, 6, 14, 23, 53, 15, 595, DateTimeKind.Local).AddTicks(7980) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc5"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 14, 23, 53, 15, 595, DateTimeKind.Local).AddTicks(8110), new DateTime(2024, 6, 14, 23, 53, 15, 595, DateTimeKind.Local).AddTicks(8110) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("2aa84ed4-a495-47c8-913f-fa5928c1b4b8"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 14, 23, 53, 15, 596, DateTimeKind.Local).AddTicks(1730), new DateTime(2024, 6, 14, 23, 53, 15, 596, DateTimeKind.Local).AddTicks(1750) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("3ff4f468-53ef-48a3-8781-61a8a053fa99"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 14, 23, 53, 15, 596, DateTimeKind.Local).AddTicks(1790), new DateTime(2024, 6, 14, 23, 53, 15, 596, DateTimeKind.Local).AddTicks(1790) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("564d0272-92c8-4108-82b2-0f98882058d4"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 14, 23, 53, 15, 596, DateTimeKind.Local).AddTicks(1790), new DateTime(2024, 6, 14, 23, 53, 15, 596, DateTimeKind.Local).AddTicks(1800) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 14, 23, 53, 15, 596, DateTimeKind.Local).AddTicks(1800), new DateTime(2024, 6, 14, 23, 53, 15, 596, DateTimeKind.Local).AddTicks(1830) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("c1cb273c-570a-42f5-b563-66bac08911cc"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 14, 23, 53, 15, 596, DateTimeKind.Local).AddTicks(1830), new DateTime(2024, 6, 14, 23, 53, 15, 596, DateTimeKind.Local).AddTicks(1840) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("c1cb273c-570a-42f5-b563-66bac08911cd"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 14, 23, 53, 15, 596, DateTimeKind.Local).AddTicks(1860), new DateTime(2024, 6, 14, 23, 53, 15, 596, DateTimeKind.Local).AddTicks(1860) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc1"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 14, 23, 53, 15, 596, DateTimeKind.Local).AddTicks(1860), new DateTime(2024, 6, 14, 23, 53, 15, 596, DateTimeKind.Local).AddTicks(1860) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("18a79217-9fa7-460d-bccc-e74285b07531"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 14, 23, 53, 15, 598, DateTimeKind.Local).AddTicks(5920), new DateTime(2024, 7, 14, 23, 53, 15, 598, DateTimeKind.Local).AddTicks(5920) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("f2cf879b-34f3-41da-9445-ee3bc590f224"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 14, 23, 53, 15, 598, DateTimeKind.Local).AddTicks(5930), new DateTime(2024, 7, 14, 23, 53, 15, 598, DateTimeKind.Local).AddTicks(5930) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("fcddbf6b-88b8-4fae-ade7-63150ce1f1ec"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 14, 23, 53, 15, 598, DateTimeKind.Local).AddTicks(5800), new DateTime(2024, 7, 14, 23, 53, 15, 598, DateTimeKind.Local).AddTicks(5820) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("1a157bf0-4748-4589-91cc-1450e0c06596"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 14, 23, 53, 15, 596, DateTimeKind.Local).AddTicks(3930), new DateTime(2024, 6, 14, 23, 53, 15, 596, DateTimeKind.Local).AddTicks(3930) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 14, 23, 53, 15, 596, DateTimeKind.Local).AddTicks(3930), new DateTime(2024, 6, 14, 23, 53, 15, 596, DateTimeKind.Local).AddTicks(3940) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("3fa85f64-5717-4562-b3fc-2c963f66afa6"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 14, 23, 53, 15, 596, DateTimeKind.Local).AddTicks(3930), new DateTime(2024, 6, 14, 23, 53, 15, 596, DateTimeKind.Local).AddTicks(3930) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 14, 23, 53, 15, 596, DateTimeKind.Local).AddTicks(3880), new DateTime(2024, 6, 14, 23, 53, 15, 596, DateTimeKind.Local).AddTicks(3890) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 14, 23, 53, 15, 596, DateTimeKind.Local).AddTicks(3920), new DateTime(2024, 6, 14, 23, 53, 15, 596, DateTimeKind.Local).AddTicks(3920) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("3ff4f468-53ef-48a3-8781-61a8a053fa99"), new Guid("1a157bf0-4748-4589-91cc-1450e0c06596") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 14, 23, 53, 15, 596, DateTimeKind.Local).AddTicks(9450), new DateTime(2024, 6, 14, 23, 53, 15, 596, DateTimeKind.Local).AddTicks(9460) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("564d0272-92c8-4108-82b2-0f98882058d4"), new Guid("1a157bf0-4748-4589-91cc-1450e0c06596") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 14, 23, 53, 15, 596, DateTimeKind.Local).AddTicks(9480), new DateTime(2024, 6, 14, 23, 53, 15, 596, DateTimeKind.Local).AddTicks(9480) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"), new Guid("1a157bf0-4748-4589-91cc-1450e0c06596") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 14, 23, 53, 15, 596, DateTimeKind.Local).AddTicks(9490), new DateTime(2024, 6, 14, 23, 53, 15, 596, DateTimeKind.Local).AddTicks(9520) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("564d0272-92c8-4108-82b2-0f98882058d4"), new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 14, 23, 53, 15, 596, DateTimeKind.Local).AddTicks(9520), new DateTime(2024, 6, 14, 23, 53, 15, 596, DateTimeKind.Local).AddTicks(9530) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"), new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 14, 23, 53, 15, 596, DateTimeKind.Local).AddTicks(9530), new DateTime(2024, 6, 14, 23, 53, 15, 596, DateTimeKind.Local).AddTicks(9530) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("e8eb7171-de01-4a85-a955-711b211eecc1"), new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 14, 23, 53, 15, 596, DateTimeKind.Local).AddTicks(9540), new DateTime(2024, 6, 14, 23, 53, 15, 596, DateTimeKind.Local).AddTicks(9540) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("c1cb273c-570a-42f5-b563-66bac08911cc"), new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 14, 23, 53, 15, 596, DateTimeKind.Local).AddTicks(9560), new DateTime(2024, 6, 14, 23, 53, 15, 596, DateTimeKind.Local).AddTicks(9560) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("c1cb273c-570a-42f5-b563-66bac08911cd"), new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 14, 23, 53, 15, 596, DateTimeKind.Local).AddTicks(9570), new DateTime(2024, 6, 14, 23, 53, 15, 596, DateTimeKind.Local).AddTicks(9570) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("2aa84ed4-a495-47c8-913f-fa5928c1b4b8"), new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 14, 23, 53, 15, 596, DateTimeKind.Local).AddTicks(9540), new DateTime(2024, 6, 14, 23, 53, 15, 596, DateTimeKind.Local).AddTicks(9550) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("564d0272-92c8-4108-82b2-0f98882058d4"), new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 14, 23, 53, 15, 596, DateTimeKind.Local).AddTicks(9550), new DateTime(2024, 6, 14, 23, 53, 15, 596, DateTimeKind.Local).AddTicks(9550) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"), new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 14, 23, 53, 15, 596, DateTimeKind.Local).AddTicks(9550), new DateTime(2024, 6, 14, 23, 53, 15, 596, DateTimeKind.Local).AddTicks(9560) });

            migrationBuilder.UpdateData(
                table: "trTask",
                keyColumn: "Id",
                keyValue: new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 14, 23, 53, 15, 596, DateTimeKind.Local).AddTicks(6140), new DateTime(2024, 6, 14, 23, 53, 15, 596, DateTimeKind.Local).AddTicks(6150) });

            migrationBuilder.UpdateData(
                table: "trTask",
                keyColumn: "Id",
                keyValue: new Guid("4422cc3c-0ea5-4d73-a31e-a42485a81003"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 14, 23, 53, 15, 596, DateTimeKind.Local).AddTicks(6180), new DateTime(2024, 6, 14, 23, 53, 15, 596, DateTimeKind.Local).AddTicks(6180) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("1a157bf0-4748-4589-91cc-1450e0c06596"), new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 14, 23, 53, 15, 596, DateTimeKind.Local).AddTicks(7470), new DateTime(2024, 6, 14, 23, 53, 15, 596, DateTimeKind.Local).AddTicks(7470) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5"), new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 14, 23, 53, 15, 596, DateTimeKind.Local).AddTicks(7500), new DateTime(2024, 6, 14, 23, 53, 15, 596, DateTimeKind.Local).AddTicks(7500) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911"), new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 14, 23, 53, 15, 596, DateTimeKind.Local).AddTicks(7500), new DateTime(2024, 6, 14, 23, 53, 15, 596, DateTimeKind.Local).AddTicks(7500) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496"), new Guid("4422cc3c-0ea5-4d73-a31e-a42485a81003") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 14, 23, 53, 15, 596, DateTimeKind.Local).AddTicks(7510), new DateTime(2024, 6, 14, 23, 53, 15, 596, DateTimeKind.Local).AddTicks(7510) });
        }
    }
}
