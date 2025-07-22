using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TCCTOBK.OperationBackend.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class AddTableForopApp : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "TimeCardEntries",
                columns: table => new
                {
                    CAID = table.Column<Guid>(type: "uuid", nullable: false),
                    TSID = table.Column<Guid>(type: "uuid", nullable: false),
                    CheckIn = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CheckOut = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedBy = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    CreatedByName = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "timestamp without time zone", maxLength: 100, nullable: false),
                    UpdatedBy = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    UpdatedByName = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "timestamp without time zone", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TimeCardEntries", x => x.CAID);
                });

            migrationBuilder.CreateTable(
                name: "TimeSheet",
                columns: table => new
                {
                    TSID = table.Column<Guid>(type: "uuid", nullable: false),
                    Location = table.Column<int>(type: "integer", nullable: false),
                    CheckCode = table.Column<string>(type: "character varying", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedBy = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    CreatedByName = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "timestamp without time zone", maxLength: 100, nullable: false),
                    UpdatedBy = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    UpdatedByName = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "timestamp without time zone", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TimeSheet", x => x.TSID);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TimeCardEntries");

            migrationBuilder.DropTable(
                name: "TimeSheet");
        }
    }
}
