using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TCCTOBK.OperationBackend.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class StaffAuditableAndSeq : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "CSID",
                table: "UsageLogMonitoring",
                type: "uuid",
                nullable: true,
                defaultValue: new Guid("3075169a-bb4c-463f-a602-dac99228ceac"));

            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                table: "mtStaff",
                type: "character varying",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "CreatedByName",
                table: "mtStaff",
                type: "character varying",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedDate",
                table: "mtStaff",
                type: "timestamp without time zone",
                maxLength: 100,
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "Seq",
                table: "mtStaff",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UpdatedBy",
                table: "mtStaff",
                type: "character varying",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "UpdatedByName",
                table: "mtStaff",
                type: "character varying",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.UpdateData(
                table: "ClientSite",
                keyColumn: "CSID",
                keyValue: new Guid("9b84961b-1de6-445b-bd19-12430950d226"),
                column: "Name",
                value: "The PARQ");

            migrationBuilder.InsertData(
                table: "Location",
                columns: new[] { "LID", "BuildingName", "BuildingZoneName", "CSID", "CreatedBy", "CreatedByName", "CreatedDate", "FloorName", "LocationCode", "ParentLocationId", "RefId", "SiteName", "Space", "Subspace", "Type", "TypeId", "UpdatedBy", "UpdatedByName", "UpdatedDate", "ZoneName" },
                values: new object[] { new Guid("2c055101-2271-44e0-95fe-bcf2c59a459a"), "O2", "O2T1", new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), "00000000-0000-0000-0000-000000000000", "System", new DateTime(2025, 2, 20, 15, 6, 27, 831, DateTimeKind.Local).AddTicks(4950), "1B", "", null, null, "OBK", null, null, "floor", null, "00000000-0000-0000-0000-000000000000", "System", new DateTime(2025, 2, 20, 15, 6, 27, 831, DateTimeKind.Local).AddTicks(4950), "R1" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ClientMember_taMember_MID",
                table: "ClientMember");

            migrationBuilder.DeleteData(
                table: "Location",
                keyColumn: "LID",
                keyValue: new Guid("2c055101-2271-44e0-95fe-bcf2c59a459a"));

            migrationBuilder.DropColumn(
                name: "CSID",
                table: "UsageLogMonitoring");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "mtStaff");

            migrationBuilder.DropColumn(
                name: "CreatedByName",
                table: "mtStaff");

            migrationBuilder.DropColumn(
                name: "CreatedDate",
                table: "mtStaff");

            migrationBuilder.DropColumn(
                name: "Seq",
                table: "mtStaff");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                table: "mtStaff");

            migrationBuilder.DropColumn(
                name: "UpdatedByName",
                table: "mtStaff");

            migrationBuilder.UpdateData(
                table: "ClientSite",
                keyColumn: "CSID",
                keyValue: new Guid("9b84961b-1de6-445b-bd19-12430950d226"),
                column: "Name",
                value: "The Parq");
        }
    }
}
