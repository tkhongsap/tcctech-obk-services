using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TCCTOBK.OperationBackend.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class trSchedulePlanFix : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_trSchedulePlan_trActivityProcedure_Route",
                table: "trSchedulePlan");

            migrationBuilder.DropPrimaryKey(
                name: "PK_trSchedulePlan",
                table: "trSchedulePlan");

            migrationBuilder.DropIndex(
                name: "IX_trSchedulePlan_Route",
                table: "trSchedulePlan");

            migrationBuilder.DropPrimaryKey(
                name: "PK_trActivityProcedure",
                table: "trActivityProcedure");

            migrationBuilder.AlterColumn<Guid>(
                name: "CSID",
                table: "trSchedulePlan",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("3075169a-bb4c-463f-a602-dac99228ceac"),
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true,
                oldDefaultValue: new Guid("3075169a-bb4c-463f-a602-dac99228ceac"));

            migrationBuilder.AlterColumn<Guid>(
                name: "CSID",
                table: "trActivityProcedure",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("3075169a-bb4c-463f-a602-dac99228ceac"),
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true,
                oldDefaultValue: new Guid("3075169a-bb4c-463f-a602-dac99228ceac"));

            migrationBuilder.AddPrimaryKey(
                name: "PK_trSchedulePlan",
                table: "trSchedulePlan",
                columns: new[] { "Id", "CSID" });

            migrationBuilder.AddPrimaryKey(
                name: "PK_trActivityProcedure",
                table: "trActivityProcedure",
                columns: new[] { "Code", "CSID" });

            migrationBuilder.UpdateData(
                table: "Location",
                keyColumn: "LID",
                keyValue: new Guid("2c055101-2271-44e0-95fe-bcf2c59a459a"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 3, 11, 12, 30, 16, 751, DateTimeKind.Local).AddTicks(7710), new DateTime(2025, 3, 11, 12, 30, 16, 751, DateTimeKind.Local).AddTicks(7720) });

            migrationBuilder.CreateIndex(
                name: "IX_trSchedulePlan_Route_CSID",
                table: "trSchedulePlan",
                columns: new[] { "Route", "CSID" });

            migrationBuilder.AddForeignKey(
                name: "FK_trSchedulePlan_trActivityProcedure_Route_CSID",
                table: "trSchedulePlan",
                columns: new[] { "Route", "CSID" },
                principalTable: "trActivityProcedure",
                principalColumns: new[] { "Code", "CSID" },
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_trSchedulePlan_trActivityProcedure_Route_CSID",
                table: "trSchedulePlan");

            migrationBuilder.DropPrimaryKey(
                name: "PK_trSchedulePlan",
                table: "trSchedulePlan");

            migrationBuilder.DropIndex(
                name: "IX_trSchedulePlan_Route_CSID",
                table: "trSchedulePlan");

            migrationBuilder.DropPrimaryKey(
                name: "PK_trActivityProcedure",
                table: "trActivityProcedure");

            migrationBuilder.AlterColumn<Guid>(
                name: "CSID",
                table: "trSchedulePlan",
                type: "uuid",
                nullable: true,
                defaultValue: new Guid("3075169a-bb4c-463f-a602-dac99228ceac"),
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldDefaultValue: new Guid("3075169a-bb4c-463f-a602-dac99228ceac"));

            migrationBuilder.AlterColumn<Guid>(
                name: "CSID",
                table: "trActivityProcedure",
                type: "uuid",
                nullable: true,
                defaultValue: new Guid("3075169a-bb4c-463f-a602-dac99228ceac"),
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldDefaultValue: new Guid("3075169a-bb4c-463f-a602-dac99228ceac"));

            migrationBuilder.AddPrimaryKey(
                name: "PK_trSchedulePlan",
                table: "trSchedulePlan",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_trActivityProcedure",
                table: "trActivityProcedure",
                column: "Code");

            migrationBuilder.UpdateData(
                table: "Location",
                keyColumn: "LID",
                keyValue: new Guid("2c055101-2271-44e0-95fe-bcf2c59a459a"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 3, 6, 12, 1, 54, 592, DateTimeKind.Local).AddTicks(8251), new DateTime(2025, 3, 6, 12, 1, 54, 592, DateTimeKind.Local).AddTicks(8253) });

            migrationBuilder.CreateIndex(
                name: "IX_trSchedulePlan_Route",
                table: "trSchedulePlan",
                column: "Route");

            migrationBuilder.AddForeignKey(
                name: "FK_trSchedulePlan_trActivityProcedure_Route",
                table: "trSchedulePlan",
                column: "Route",
                principalTable: "trActivityProcedure",
                principalColumn: "Code",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
