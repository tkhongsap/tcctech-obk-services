using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace TCCTOBK.OperationBackend.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class AddTenantInRoleAndFailAttampt : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "TID",
                table: "trRole",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<int>(
                name: "FailAttempt",
                table: "taMember",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "IsLocked",
                table: "taMember",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateTable(
                name: "trActivityProcedure",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Code = table.Column<string>(type: "text", nullable: false),
                    TaskName = table.Column<string>(type: "text", nullable: false),
                    SubtaskActions = table.Column<string>(type: "text", nullable: false),
                    LocationId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedBy = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    CreatedByName = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "timestamp without time zone", maxLength: 100, nullable: false),
                    UpdatedBy = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    UpdatedByName = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "timestamp without time zone", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_trActivityProcedure", x => x.Id);
                });

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

            migrationBuilder.InsertData(
                table: "trRole",
                columns: new[] { "RID", "CreatedBy", "CreatedByName", "CreatedDate", "Description", "IsActive", "IsDelete", "Name", "TID", "UpdatedBy", "UpdatedByName", "UpdatedDate" },
                values: new object[,]
                {
                    { new Guid("18a79217-9fa7-460d-bccc-e74285b07531"), "00000000-0000-0000-0000-000000000000", "System", new DateTime(2024, 7, 14, 23, 53, 15, 598, DateTimeKind.Local).AddTicks(5920), "Cleaning", true, false, "Cleaning", new Guid("caa4ebec-15c8-4d6b-9985-6d6b66f94e63"), "00000000-0000-0000-0000-000000000000", "System", new DateTime(2024, 7, 14, 23, 53, 15, 598, DateTimeKind.Local).AddTicks(5920) },
                    { new Guid("f2cf879b-34f3-41da-9445-ee3bc590f224"), "00000000-0000-0000-0000-000000000000", "System", new DateTime(2024, 7, 14, 23, 53, 15, 598, DateTimeKind.Local).AddTicks(5930), "Supervisor", true, false, "Supervisor", new Guid("caa4ebec-15c8-4d6b-9985-6d6b66f94e63"), "00000000-0000-0000-0000-000000000000", "System", new DateTime(2024, 7, 14, 23, 53, 15, 598, DateTimeKind.Local).AddTicks(5930) },
                    { new Guid("fcddbf6b-88b8-4fae-ade7-63150ce1f1ec"), "00000000-0000-0000-0000-000000000000", "System", new DateTime(2024, 7, 14, 23, 53, 15, 598, DateTimeKind.Local).AddTicks(5800), "Technician", true, false, "Technician", new Guid("caa4ebec-15c8-4d6b-9985-6d6b66f94e63"), "00000000-0000-0000-0000-000000000000", "System", new DateTime(2024, 7, 14, 23, 53, 15, 598, DateTimeKind.Local).AddTicks(5820) }
                });

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

            migrationBuilder.CreateIndex(
                name: "IX_trRole_TID",
                table: "trRole",
                column: "TID");

            migrationBuilder.AddForeignKey(
                name: "FK_trRole_Tenant_TID",
                table: "trRole",
                column: "TID",
                principalTable: "Tenant",
                principalColumn: "TID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_trRole_Tenant_TID",
                table: "trRole");

            migrationBuilder.DropTable(
                name: "trActivityProcedure");

            migrationBuilder.DropIndex(
                name: "IX_trRole_TID",
                table: "trRole");

            migrationBuilder.DeleteData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("18a79217-9fa7-460d-bccc-e74285b07531"));

            migrationBuilder.DeleteData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("f2cf879b-34f3-41da-9445-ee3bc590f224"));

            migrationBuilder.DeleteData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("fcddbf6b-88b8-4fae-ade7-63150ce1f1ec"));

            migrationBuilder.DropColumn(
                name: "TID",
                table: "trRole");

            migrationBuilder.DropColumn(
                name: "FailAttempt",
                table: "taMember");

            migrationBuilder.DropColumn(
                name: "IsLocked",
                table: "taMember");

            migrationBuilder.UpdateData(
                table: "Location",
                keyColumn: "LID",
                keyValue: new Guid("2c055101-2271-44e0-95fe-bcf2c59a459a"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(9749), new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(9753) });

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("4199e4de-bdf8-48f8-a8a8-a5b31756a748"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 8, 17, 41, 7, 380, DateTimeKind.Local).AddTicks(5653), new DateTime(2024, 7, 8, 17, 41, 7, 381, DateTimeKind.Local).AddTicks(1370) });

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("caa4ebec-15c8-4d6b-9985-6d6b66f94e63"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 8, 17, 41, 7, 381, DateTimeKind.Local).AddTicks(1908), new DateTime(2024, 7, 8, 17, 41, 7, 381, DateTimeKind.Local).AddTicks(1912) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc2"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(48), new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(157) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc3"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(198), new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(199) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc4"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(202), new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(219) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc5"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(221), new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(222) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("2aa84ed4-a495-47c8-913f-fa5928c1b4b8"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(2140), new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(2145) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("3ff4f468-53ef-48a3-8781-61a8a053fa99"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(2165), new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(2166) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("564d0272-92c8-4108-82b2-0f98882058d4"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(2169), new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(2170) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(2174), new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(2175) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("c1cb273c-570a-42f5-b563-66bac08911cc"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(2177), new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(2178) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("c1cb273c-570a-42f5-b563-66bac08911cd"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(2218), new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(2219) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc1"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(2213), new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(2214) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("1a157bf0-4748-4589-91cc-1450e0c06596"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(3723), new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(3725) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(3731), new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(3732) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("3fa85f64-5717-4562-b3fc-2c963f66afa6"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(3728), new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(3728) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(3693), new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(3698) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(3720), new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(3721) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("3ff4f468-53ef-48a3-8781-61a8a053fa99"), new Guid("1a157bf0-4748-4589-91cc-1450e0c06596") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(7508), new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(7513) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("564d0272-92c8-4108-82b2-0f98882058d4"), new Guid("1a157bf0-4748-4589-91cc-1450e0c06596") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(7532), new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(7533) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"), new Guid("1a157bf0-4748-4589-91cc-1450e0c06596") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(7557), new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(7558) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("564d0272-92c8-4108-82b2-0f98882058d4"), new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(7561), new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(7562) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"), new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(7569), new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(7572) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("e8eb7171-de01-4a85-a955-711b211eecc1"), new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(7579), new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(7580) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("c1cb273c-570a-42f5-b563-66bac08911cc"), new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(7699), new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(7701) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("c1cb273c-570a-42f5-b563-66bac08911cd"), new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(7704), new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(7705) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("2aa84ed4-a495-47c8-913f-fa5928c1b4b8"), new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(7584), new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(7585) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("564d0272-92c8-4108-82b2-0f98882058d4"), new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(7588), new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(7589) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"), new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(7592), new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(7593) });

            migrationBuilder.UpdateData(
                table: "trTask",
                keyColumn: "Id",
                keyValue: new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(5494), new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(5499) });

            migrationBuilder.UpdateData(
                table: "trTask",
                keyColumn: "Id",
                keyValue: new Guid("4422cc3c-0ea5-4d73-a31e-a42485a81003"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(5544), new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(5546) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("1a157bf0-4748-4589-91cc-1450e0c06596"), new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(6375), new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(6379) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5"), new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(6397), new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(6398) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911"), new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(6400), new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(6402) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496"), new Guid("4422cc3c-0ea5-4d73-a31e-a42485a81003") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(6404), new DateTime(2024, 6, 8, 17, 41, 7, 386, DateTimeKind.Local).AddTicks(6405) });
        }
    }
}
