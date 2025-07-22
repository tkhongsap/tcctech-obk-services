using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace TCCTOBK.OperationBackend.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class CaseFixRelation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_trCaseMedias_trCases_trCasesId",
                table: "trCaseMedias");

            migrationBuilder.DropForeignKey(
                name: "FK_trCaseTasks_trCases_CaseId",
                table: "trCaseTasks");

            migrationBuilder.DropPrimaryKey(
                name: "PK_trCaseTasks",
                table: "trCaseTasks");

            migrationBuilder.DropPrimaryKey(
                name: "PK_trCases",
                table: "trCases");

            migrationBuilder.DropIndex(
                name: "IX_trCaseMedias_trCasesId",
                table: "trCaseMedias");

            migrationBuilder.AlterColumn<Guid>(
                name: "CSID",
                table: "trCaseTasks",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("3075169a-bb4c-463f-a602-dac99228ceac"),
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true,
                oldDefaultValue: new Guid("3075169a-bb4c-463f-a602-dac99228ceac"));

            migrationBuilder.AlterColumn<int>(
                name: "Id",
                table: "trCaseTasks",
                type: "integer",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer")
                .OldAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AlterColumn<Guid>(
                name: "CSID",
                table: "trCases",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("3075169a-bb4c-463f-a602-dac99228ceac"),
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true,
                oldDefaultValue: new Guid("3075169a-bb4c-463f-a602-dac99228ceac"));

            migrationBuilder.AlterColumn<int>(
                name: "Id",
                table: "trCases",
                type: "integer",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer")
                .OldAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AddColumn<Guid>(
                name: "trCasesCSID",
                table: "trCaseMedias",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_trCaseTasks",
                table: "trCaseTasks",
                columns: new[] { "CSID", "Id" });

            migrationBuilder.AddPrimaryKey(
                name: "PK_trCases",
                table: "trCases",
                columns: new[] { "CSID", "Id" });

            migrationBuilder.UpdateData(
                table: "Location",
                keyColumn: "LID",
                keyValue: new Guid("2c055101-2271-44e0-95fe-bcf2c59a459a"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 3, 5, 9, 44, 59, 731, DateTimeKind.Local).AddTicks(6600), new DateTime(2025, 3, 5, 9, 44, 59, 731, DateTimeKind.Local).AddTicks(6600) });

            migrationBuilder.CreateIndex(
                name: "IX_trCaseTasks_CSID_CaseId",
                table: "trCaseTasks",
                columns: new[] { "CSID", "CaseId" });

            migrationBuilder.CreateIndex(
                name: "IX_trCaseMedias_trCasesCSID_trCasesId",
                table: "trCaseMedias",
                columns: new[] { "trCasesCSID", "trCasesId" });

            migrationBuilder.AddForeignKey(
                name: "FK_trCaseMedias_trCases_trCasesCSID_trCasesId",
                table: "trCaseMedias",
                columns: new[] { "trCasesCSID", "trCasesId" },
                principalTable: "trCases",
                principalColumns: new[] { "CSID", "Id" });

            migrationBuilder.AddForeignKey(
                name: "FK_trCaseTasks_trCases_CSID_CaseId",
                table: "trCaseTasks",
                columns: new[] { "CSID", "CaseId" },
                principalTable: "trCases",
                principalColumns: new[] { "CSID", "Id" },
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_trCaseMedias_trCases_trCasesCSID_trCasesId",
                table: "trCaseMedias");

            migrationBuilder.DropForeignKey(
                name: "FK_trCaseTasks_trCases_CSID_CaseId",
                table: "trCaseTasks");

            migrationBuilder.DropPrimaryKey(
                name: "PK_trCaseTasks",
                table: "trCaseTasks");

            migrationBuilder.DropIndex(
                name: "IX_trCaseTasks_CSID_CaseId",
                table: "trCaseTasks");

            migrationBuilder.DropPrimaryKey(
                name: "PK_trCases",
                table: "trCases");

            migrationBuilder.DropIndex(
                name: "IX_trCaseMedias_trCasesCSID_trCasesId",
                table: "trCaseMedias");

            migrationBuilder.DropColumn(
                name: "trCasesCSID",
                table: "trCaseMedias");

            migrationBuilder.AlterColumn<int>(
                name: "Id",
                table: "trCaseTasks",
                type: "integer",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer")
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AlterColumn<Guid>(
                name: "CSID",
                table: "trCaseTasks",
                type: "uuid",
                nullable: true,
                defaultValue: new Guid("3075169a-bb4c-463f-a602-dac99228ceac"),
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldDefaultValue: new Guid("3075169a-bb4c-463f-a602-dac99228ceac"));

            migrationBuilder.AlterColumn<int>(
                name: "Id",
                table: "trCases",
                type: "integer",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer")
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AlterColumn<Guid>(
                name: "CSID",
                table: "trCases",
                type: "uuid",
                nullable: true,
                defaultValue: new Guid("3075169a-bb4c-463f-a602-dac99228ceac"),
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldDefaultValue: new Guid("3075169a-bb4c-463f-a602-dac99228ceac"));

            migrationBuilder.AddPrimaryKey(
                name: "PK_trCaseTasks",
                table: "trCaseTasks",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_trCases",
                table: "trCases",
                column: "Id");

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

            migrationBuilder.AddForeignKey(
                name: "FK_trCaseTasks_trCases_CaseId",
                table: "trCaseTasks",
                column: "CaseId",
                principalTable: "trCases",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
