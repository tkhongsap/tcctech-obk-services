using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TCCTOBK.OperationBackend.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class UniqueKeyPPM : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Location",
                keyColumn: "LID",
                keyValue: new Guid("2c055101-2271-44e0-95fe-bcf2c59a459a"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 3, 24, 10, 13, 53, 572, DateTimeKind.Local).AddTicks(4936), new DateTime(2025, 3, 24, 10, 13, 53, 572, DateTimeKind.Local).AddTicks(4939) });

            migrationBuilder.CreateIndex(
                name: "IX_trPPMs_TechniciansAssignedBy",
                table: "trPPMs",
                column: "TechniciansAssignedBy");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_trPPMs_TechniciansAssignedBy",
                table: "trPPMs");

            migrationBuilder.UpdateData(
                table: "Location",
                keyColumn: "LID",
                keyValue: new Guid("2c055101-2271-44e0-95fe-bcf2c59a459a"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 3, 19, 10, 49, 15, 164, DateTimeKind.Local).AddTicks(8902), new DateTime(2025, 3, 19, 10, 49, 15, 164, DateTimeKind.Local).AddTicks(8906) });
        }
    }
}
