using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TCCTOBK.OperationBackend.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class AddColumnIntroduceIntrSustainabilityBanner : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "LabelIntroduce",
                table: "trSustainabilityBanner",
                type: "character varying",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LabelIntroduceCN",
                table: "trSustainabilityBanner",
                type: "character varying",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LabelIntroduceTH",
                table: "trSustainabilityBanner",
                type: "character varying",
                maxLength: 50,
                nullable: true);

            migrationBuilder.UpdateData(
                table: "Location",
                keyColumn: "LID",
                keyValue: new Guid("2c055101-2271-44e0-95fe-bcf2c59a459a"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 3, 6, 12, 1, 54, 592, DateTimeKind.Local).AddTicks(8251), new DateTime(2025, 3, 6, 12, 1, 54, 592, DateTimeKind.Local).AddTicks(8253) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LabelIntroduce",
                table: "trSustainabilityBanner");

            migrationBuilder.DropColumn(
                name: "LabelIntroduceCN",
                table: "trSustainabilityBanner");

            migrationBuilder.DropColumn(
                name: "LabelIntroduceTH",
                table: "trSustainabilityBanner");

            migrationBuilder.UpdateData(
                table: "Location",
                keyColumn: "LID",
                keyValue: new Guid("2c055101-2271-44e0-95fe-bcf2c59a459a"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 3, 5, 10, 7, 12, 405, DateTimeKind.Local).AddTicks(3680), new DateTime(2025, 3, 5, 10, 7, 12, 405, DateTimeKind.Local).AddTicks(3690) });
        }
    }
}
