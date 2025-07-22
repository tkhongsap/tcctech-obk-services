using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace TCCTOBK.OperationBackend.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class CwoFix : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_trCWOs",
                table: "trCWOs");

            migrationBuilder.AlterColumn<Guid>(
                name: "CSID",
                table: "trCWOs",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("3075169a-bb4c-463f-a602-dac99228ceac"),
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true,
                oldDefaultValue: new Guid("3075169a-bb4c-463f-a602-dac99228ceac"));

            migrationBuilder.AlterColumn<int>(
                name: "Id",
                table: "trCWOs",
                type: "integer",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer")
                .OldAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AddPrimaryKey(
                name: "PK_trCWOs",
                table: "trCWOs",
                columns: new[] { "CSID", "Id" });

            migrationBuilder.UpdateData(
                table: "Location",
                keyColumn: "LID",
                keyValue: new Guid("2c055101-2271-44e0-95fe-bcf2c59a459a"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 3, 5, 10, 7, 12, 405, DateTimeKind.Local).AddTicks(3680), new DateTime(2025, 3, 5, 10, 7, 12, 405, DateTimeKind.Local).AddTicks(3690) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_trCWOs",
                table: "trCWOs");

            migrationBuilder.AlterColumn<int>(
                name: "Id",
                table: "trCWOs",
                type: "integer",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer")
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AlterColumn<Guid>(
                name: "CSID",
                table: "trCWOs",
                type: "uuid",
                nullable: true,
                defaultValue: new Guid("3075169a-bb4c-463f-a602-dac99228ceac"),
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldDefaultValue: new Guid("3075169a-bb4c-463f-a602-dac99228ceac"));

            migrationBuilder.AddPrimaryKey(
                name: "PK_trCWOs",
                table: "trCWOs",
                column: "Id");

            migrationBuilder.UpdateData(
                table: "Location",
                keyColumn: "LID",
                keyValue: new Guid("2c055101-2271-44e0-95fe-bcf2c59a459a"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 3, 5, 9, 44, 59, 731, DateTimeKind.Local).AddTicks(6600), new DateTime(2025, 3, 5, 9, 44, 59, 731, DateTimeKind.Local).AddTicks(6600) });
        }
    }
}
