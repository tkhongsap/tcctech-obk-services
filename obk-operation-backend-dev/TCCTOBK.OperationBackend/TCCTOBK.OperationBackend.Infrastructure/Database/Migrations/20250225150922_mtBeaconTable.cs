using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TCCTOBK.OperationBackend.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class mtBeaconTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "mtBeacon",
                columns: table => new
                {
                    BID = table.Column<Guid>(type: "uuid", nullable: false),
                    UUID = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Major = table.Column<int>(type: "integer", nullable: false),
                    Minor = table.Column<int>(type: "integer", nullable: false),
                    Latitude = table.Column<double>(type: "double precision", nullable: false),
                    Longitude = table.Column<double>(type: "double precision", nullable: false),
                    FloorName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    ParkName = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    SpaceNo = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    SpaceType = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    ZoneName = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_mtBeacon", x => x.BID);
                });

            migrationBuilder.UpdateData(
                table: "Location",
                keyColumn: "LID",
                keyValue: new Guid("2c055101-2271-44e0-95fe-bcf2c59a459a"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 2, 25, 22, 9, 21, 950, DateTimeKind.Local).AddTicks(1560), new DateTime(2025, 2, 25, 22, 9, 21, 950, DateTimeKind.Local).AddTicks(1560) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "mtBeacon");

            migrationBuilder.UpdateData(
                table: "Location",
                keyColumn: "LID",
                keyValue: new Guid("2c055101-2271-44e0-95fe-bcf2c59a459a"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 2, 21, 13, 27, 57, 583, DateTimeKind.Local).AddTicks(9970), new DateTime(2025, 2, 21, 13, 27, 57, 583, DateTimeKind.Local).AddTicks(9970) });
        }
    }
}
