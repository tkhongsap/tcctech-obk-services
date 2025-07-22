using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TCCTOBK.OperationBackend.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class CaseFix : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_trCaseMedias_trCases_CaseId",
                table: "trCaseMedias");

            migrationBuilder.DropIndex(
                name: "IX_trCaseMedias_CaseId",
                table: "trCaseMedias");

            migrationBuilder.AddColumn<Guid>(
                name: "CSID",
                table: "trCaseTasks",
                type: "uuid",
                nullable: true,
                defaultValue: new Guid("3075169a-bb4c-463f-a602-dac99228ceac"));

            migrationBuilder.AddColumn<int>(
                name: "trCasesId",
                table: "trCaseMedias",
                type: "integer",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "Location",
                keyColumn: "LID",
                keyValue: new Guid("2c055101-2271-44e0-95fe-bcf2c59a459a"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 3, 5, 9, 33, 31, 169, DateTimeKind.Local).AddTicks(4050), new DateTime(2025, 3, 5, 9, 33, 31, 169, DateTimeKind.Local).AddTicks(4050) });

            migrationBuilder.CreateIndex(
                name: "IX_trCaseMedias_trCasesId",
                table: "trCaseMedias",
                column: "trCasesId");

            migrationBuilder.AddForeignKey(
                name: "FK_trCaseMedias_trCases_trCasesId",
                table: "trCaseMedias",
                column: "trCasesId",
                principalTable: "trCases",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_trCaseMedias_trCases_trCasesId",
                table: "trCaseMedias");

            migrationBuilder.DropIndex(
                name: "IX_trCaseMedias_trCasesId",
                table: "trCaseMedias");

            migrationBuilder.DropColumn(
                name: "CSID",
                table: "trCaseTasks");

            migrationBuilder.DropColumn(
                name: "trCasesId",
                table: "trCaseMedias");

            migrationBuilder.UpdateData(
                table: "Location",
                keyColumn: "LID",
                keyValue: new Guid("2c055101-2271-44e0-95fe-bcf2c59a459a"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 2, 27, 11, 35, 59, 529, DateTimeKind.Local).AddTicks(4390), new DateTime(2025, 2, 27, 11, 35, 59, 529, DateTimeKind.Local).AddTicks(4390) });

            migrationBuilder.CreateIndex(
                name: "IX_trCaseMedias_CaseId",
                table: "trCaseMedias",
                column: "CaseId");

            migrationBuilder.AddForeignKey(
                name: "FK_trCaseMedias_trCases_CaseId",
                table: "trCaseMedias",
                column: "CaseId",
                principalTable: "trCases",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
