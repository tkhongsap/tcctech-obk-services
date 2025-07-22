using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TCCTOBK.OperationBackend.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class AddSOCUserAndLocation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsDelete",
                table: "trRole",
                type: "boolean",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Location",
                columns: table => new
                {
                    LID = table.Column<Guid>(type: "uuid", nullable: false),
                    LocationName = table.Column<string>(type: "text", nullable: false),
                    LocationType = table.Column<int>(type: "integer", nullable: false),
                    ParentLocationId = table.Column<Guid>(type: "uuid", nullable: true),
                    CreatedBy = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    CreatedByName = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "timestamp without time zone", maxLength: 100, nullable: false),
                    UpdatedBy = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    UpdatedByName = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "timestamp without time zone", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Location", x => x.LID);
                });

            migrationBuilder.CreateTable(
                name: "SOCUser",
                columns: table => new
                {
                    SID = table.Column<Guid>(type: "uuid", nullable: false),
                    IdentifyNumber = table.Column<string>(type: "character varying", maxLength: 500, nullable: false),
                    IdentifyType = table.Column<int>(type: "integer", nullable: false),
                    FirstName = table.Column<string>(type: "character varying", nullable: false),
                    LastName = table.Column<string>(type: "character varying", nullable: false),
                    FirstNameEn = table.Column<string>(type: "character varying", nullable: false),
                    LastNameEn = table.Column<string>(type: "character varying", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    PhoneNumber = table.Column<string>(type: "text", nullable: true),
                    Gender = table.Column<int>(type: "integer", nullable: false),
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
                    table.PrimaryKey("PK_SOCUser", x => x.SID);
                });

            migrationBuilder.CreateTable(
                name: "WorkTransaction",
                columns: table => new
                {
                    TID = table.Column<Guid>(type: "uuid", nullable: false),
                    Transactiontype = table.Column<int>(type: "integer", nullable: false),
                    CheckIn = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CheckOut = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    HoneywellResponeDataJson = table.Column<string>(type: "text", nullable: true),
                    SID = table.Column<Guid>(type: "uuid", nullable: false),
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
                    table.PrimaryKey("PK_WorkTransaction", x => x.TID);
                });

            migrationBuilder.CreateTable(
                name: "SpotCoordinate",
                columns: table => new
                {
                    CID = table.Column<Guid>(type: "uuid", nullable: false),
                    Lat = table.Column<float>(type: "real", nullable: false),
                    Long = table.Column<float>(type: "real", nullable: false),
                    LID = table.Column<Guid>(type: "uuid", nullable: false),
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
                    table.PrimaryKey("PK_SpotCoordinate", x => x.CID);
                    table.ForeignKey(
                        name: "FK_SpotCoordinate_Location_LID",
                        column: x => x.LID,
                        principalTable: "Location",
                        principalColumn: "LID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Unit",
                columns: table => new
                {
                    UID = table.Column<Guid>(type: "uuid", nullable: false),
                    UnitNo = table.Column<string>(type: "text", nullable: false),
                    Area = table.Column<float>(type: "real", nullable: true),
                    InlineAreaIndoorZone = table.Column<float>(type: "real", nullable: true),
                    InlineAreaOutdoorZone = table.Column<float>(type: "real", nullable: true),
                    IndoorSpillOutSeating = table.Column<int>(type: "integer", nullable: true),
                    UnitType = table.Column<int>(type: "integer", nullable: false),
                    Lat = table.Column<float>(type: "real", nullable: true),
                    Long = table.Column<float>(type: "real", nullable: true),
                    LID = table.Column<Guid>(type: "uuid", nullable: false),
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
                    table.PrimaryKey("PK_Unit", x => x.UID);
                    table.ForeignKey(
                        name: "FK_Unit_Location_LID",
                        column: x => x.LID,
                        principalTable: "Location",
                        principalColumn: "LID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SOCUserTanent",
                columns: table => new
                {
                    SID = table.Column<Guid>(type: "uuid", nullable: false),
                    TID = table.Column<Guid>(type: "uuid", nullable: false),
                    SOCUserSID = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SOCUserTanent", x => new { x.SID, x.TID });
                    table.ForeignKey(
                        name: "FK_SOCUserTanent_SOCUser_SOCUserSID",
                        column: x => x.SOCUserSID,
                        principalTable: "SOCUser",
                        principalColumn: "SID");
                    table.ForeignKey(
                        name: "FK_SOCUserTanent_Tenant_TID",
                        column: x => x.TID,
                        principalTable: "Tenant",
                        principalColumn: "TID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "trRoleSOCUser",
                columns: table => new
                {
                    RID = table.Column<Guid>(type: "uuid", nullable: false),
                    SID = table.Column<Guid>(type: "uuid", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_trRoleSOCUser", x => new { x.RID, x.SID });
                    table.ForeignKey(
                        name: "FK_trRoleSOCUser_SOCUser_SID",
                        column: x => x.SID,
                        principalTable: "SOCUser",
                        principalColumn: "SID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_trRoleSOCUser_trRole_RID",
                        column: x => x.RID,
                        principalTable: "trRole",
                        principalColumn: "RID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("4199e4de-bdf8-48f8-a8a8-a5b31756a748"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 25, 15, 39, 23, 801, DateTimeKind.Local).AddTicks(3240), new DateTime(2024, 6, 25, 15, 39, 23, 808, DateTimeKind.Local).AddTicks(7760) });

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("caa4ebec-15c8-4d6b-9985-6d6b66f94e63"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 25, 15, 39, 23, 808, DateTimeKind.Local).AddTicks(8030), new DateTime(2024, 6, 25, 15, 39, 23, 808, DateTimeKind.Local).AddTicks(8030) });

            migrationBuilder.CreateIndex(
                name: "IX_SOCUserTanent_SOCUserSID",
                table: "SOCUserTanent",
                column: "SOCUserSID");

            migrationBuilder.CreateIndex(
                name: "IX_SOCUserTanent_TID",
                table: "SOCUserTanent",
                column: "TID");

            migrationBuilder.CreateIndex(
                name: "IX_SpotCoordinate_LID",
                table: "SpotCoordinate",
                column: "LID");

            migrationBuilder.CreateIndex(
                name: "IX_trRoleSOCUser_SID",
                table: "trRoleSOCUser",
                column: "SID");

            migrationBuilder.CreateIndex(
                name: "IX_Unit_LID",
                table: "Unit",
                column: "LID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SOCUserTanent");

            migrationBuilder.DropTable(
                name: "SpotCoordinate");

            migrationBuilder.DropTable(
                name: "trRoleSOCUser");

            migrationBuilder.DropTable(
                name: "Unit");

            migrationBuilder.DropTable(
                name: "WorkTransaction");

            migrationBuilder.DropTable(
                name: "SOCUser");

            migrationBuilder.DropTable(
                name: "Location");

            migrationBuilder.DropColumn(
                name: "IsDelete",
                table: "trRole");

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("4199e4de-bdf8-48f8-a8a8-a5b31756a748"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 4, 17, 0, 13, 11, 544, DateTimeKind.Local).AddTicks(6193), new DateTime(2024, 4, 17, 0, 13, 11, 545, DateTimeKind.Local).AddTicks(3313) });

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("caa4ebec-15c8-4d6b-9985-6d6b66f94e63"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 4, 17, 0, 13, 11, 545, DateTimeKind.Local).AddTicks(3985), new DateTime(2024, 4, 17, 0, 13, 11, 545, DateTimeKind.Local).AddTicks(3990) });
        }
    }
}
