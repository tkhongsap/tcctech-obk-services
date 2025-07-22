using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace TCCTOBK.OperationBackend.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class ClientSiteAndCSIDField : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "CSID",
                table: "trTask",
                type: "uuid",
                nullable: true,
                defaultValue: new Guid("3075169a-bb4c-463f-a602-dac99228ceac"));

            migrationBuilder.AddColumn<Guid>(
                name: "CSID",
                table: "trSchedulePlan",
                type: "uuid",
                nullable: true,
                defaultValue: new Guid("3075169a-bb4c-463f-a602-dac99228ceac"));

            migrationBuilder.AddColumn<Guid>(
                name: "CSID",
                table: "trRoster",
                type: "uuid",
                nullable: true,
                defaultValue: new Guid("3075169a-bb4c-463f-a602-dac99228ceac"));

            migrationBuilder.AddColumn<Guid>(
                name: "CSID",
                table: "trRole",
                type: "uuid",
                nullable: true,
                defaultValue: new Guid("3075169a-bb4c-463f-a602-dac99228ceac"));

            migrationBuilder.AddColumn<Guid>(
                name: "CSID",
                table: "trInviteMember",
                type: "uuid",
                nullable: true,
                defaultValue: new Guid("3075169a-bb4c-463f-a602-dac99228ceac"));

            migrationBuilder.AddColumn<Guid>(
                name: "CSID",
                table: "trCWOs",
                type: "uuid",
                nullable: true,
                defaultValue: new Guid("3075169a-bb4c-463f-a602-dac99228ceac"));

            migrationBuilder.AddColumn<Guid>(
                name: "CSID",
                table: "trCases",
                type: "uuid",
                nullable: true,
                defaultValue: new Guid("3075169a-bb4c-463f-a602-dac99228ceac"));

            migrationBuilder.AddColumn<Guid>(
                name: "CSID",
                table: "trAttendance",
                type: "uuid",
                nullable: true,
                defaultValue: new Guid("3075169a-bb4c-463f-a602-dac99228ceac"));

            migrationBuilder.AddColumn<Guid>(
                name: "CSID",
                table: "trActivityProcedure",
                type: "uuid",
                nullable: true,
                defaultValue: new Guid("3075169a-bb4c-463f-a602-dac99228ceac"));

            migrationBuilder.AddColumn<Guid>(
                name: "CSID",
                table: "trAction",
                type: "uuid",
                nullable: true,
                defaultValue: new Guid("3075169a-bb4c-463f-a602-dac99228ceac"));

            migrationBuilder.AddColumn<Guid>(
                name: "CSID",
                table: "TenantMember",
                type: "uuid",
                nullable: true,
                defaultValue: new Guid("3075169a-bb4c-463f-a602-dac99228ceac"));

            migrationBuilder.AddColumn<Guid>(
                name: "CSID",
                table: "OpsAppNotifications",
                type: "uuid",
                nullable: true,
                defaultValue: new Guid("3075169a-bb4c-463f-a602-dac99228ceac"));

            migrationBuilder.AddColumn<Guid>(
                name: "CSID",
                table: "mtStaff",
                type: "uuid",
                nullable: true,
                defaultValue: new Guid("3075169a-bb4c-463f-a602-dac99228ceac"));

            migrationBuilder.AddColumn<Guid>(
                name: "CSID",
                table: "mtShiftManPowerRequest",
                type: "uuid",
                nullable: true,
                defaultValue: new Guid("3075169a-bb4c-463f-a602-dac99228ceac"));

            migrationBuilder.AddColumn<Guid>(
                name: "CSID",
                table: "mtShift",
                type: "uuid",
                nullable: true,
                defaultValue: new Guid("3075169a-bb4c-463f-a602-dac99228ceac"));

            migrationBuilder.AddColumn<Guid>(
                name: "CSID",
                table: "mtPrivilege",
                type: "uuid",
                nullable: true,
                defaultValue: new Guid("3075169a-bb4c-463f-a602-dac99228ceac"));

            migrationBuilder.AddColumn<Guid>(
                name: "CSID",
                table: "mtMenu",
                type: "uuid",
                nullable: true,
                defaultValue: new Guid("3075169a-bb4c-463f-a602-dac99228ceac"));

            migrationBuilder.AddColumn<Guid>(
                name: "CSID",
                table: "mtAppConfig",
                type: "uuid",
                nullable: true,
                defaultValue: new Guid("3075169a-bb4c-463f-a602-dac99228ceac"));

            migrationBuilder.AddColumn<Guid>(
                name: "CSID",
                table: "Location",
                type: "uuid",
                nullable: true,
                defaultValue: new Guid("3075169a-bb4c-463f-a602-dac99228ceac"));

            migrationBuilder.AddColumn<Guid>(
                name: "CSID",
                table: "FCMDevice",
                type: "uuid",
                nullable: true,
                defaultValue: new Guid("3075169a-bb4c-463f-a602-dac99228ceac"));

            migrationBuilder.AddColumn<Guid>(
                name: "CSID",
                table: "EventsLog",
                type: "uuid",
                nullable: true,
                defaultValue: new Guid("3075169a-bb4c-463f-a602-dac99228ceac"));

            migrationBuilder.CreateTable(
                name: "ClientMember",
                columns: table => new
                {
                    CSMID = table.Column<Guid>(type: "uuid", nullable: false),
                    MID = table.Column<Guid>(type: "uuid", nullable: false),
                    CSID = table.Column<Guid>(type: "uuid", nullable: false),
                    StaffId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ClientMember", x => x.CSMID);
                    table.ForeignKey(
                        name: "FK_ClientMember_taMember_MID",
                        column: x => x.MID,
                        principalTable: "taMember",
                        principalColumn: "MID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ClientSite",
                columns: table => new
                {
                    CSID = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying", maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ClientSite", x => x.CSID);
                });

            migrationBuilder.InsertData(
                table: "ClientSite",
                columns: new[] { "CSID", "Name" },
                values: new object[,]
                {
                    { new Guid("3075169a-bb4c-463f-a602-dac99228ceac"), "One Bangkok" },
                    { new Guid("9b84961b-1de6-445b-bd19-12430950d226"), "The Parq" }
                });

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("4199e4de-bdf8-48f8-a8a8-a5b31756a748"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 2, 6, 14, 41, 14, 817, DateTimeKind.Local).AddTicks(9610), new DateTime(2025, 2, 6, 14, 41, 14, 825, DateTimeKind.Local).AddTicks(4090) });

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("caa4ebec-15c8-4d6b-9985-6d6b66f94e63"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 2, 6, 14, 41, 14, 825, DateTimeKind.Local).AddTicks(4290), new DateTime(2025, 2, 6, 14, 41, 14, 825, DateTimeKind.Local).AddTicks(4300) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("18a79217-9fa7-460d-bccc-e74285b07531"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 2, 6, 14, 41, 14, 829, DateTimeKind.Local).AddTicks(7050), new DateTime(2025, 2, 6, 14, 41, 14, 829, DateTimeKind.Local).AddTicks(7050) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("bd69a88e-d6c1-42a1-8a3a-628843459909"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 2, 6, 14, 41, 14, 829, DateTimeKind.Local).AddTicks(7060), new DateTime(2025, 2, 6, 14, 41, 14, 829, DateTimeKind.Local).AddTicks(7060) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("c01c5086-cfa5-44ca-89d7-baa2c1accea6"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 2, 6, 14, 41, 14, 829, DateTimeKind.Local).AddTicks(7060), new DateTime(2025, 2, 6, 14, 41, 14, 829, DateTimeKind.Local).AddTicks(7060) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("d6016437-8b0f-4b0e-8175-5a11ffc480f5"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 2, 6, 14, 41, 14, 829, DateTimeKind.Local).AddTicks(7060), new DateTime(2025, 2, 6, 14, 41, 14, 829, DateTimeKind.Local).AddTicks(7060) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("f2cf879b-34f3-41da-9445-ee3bc590f224"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 2, 6, 14, 41, 14, 829, DateTimeKind.Local).AddTicks(7050), new DateTime(2025, 2, 6, 14, 41, 14, 829, DateTimeKind.Local).AddTicks(7050) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("fcddbf6b-88b8-4fae-ade7-63150ce1f1ec"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 2, 6, 14, 41, 14, 829, DateTimeKind.Local).AddTicks(6990), new DateTime(2025, 2, 6, 14, 41, 14, 829, DateTimeKind.Local).AddTicks(7000) });

            migrationBuilder.CreateIndex(
                name: "IX_TenantMember_CSID",
                table: "TenantMember",
                column: "CSID");

            migrationBuilder.CreateIndex(
                name: "IX_ClientMember_MID",
                table: "ClientMember",
                column: "MID");

            migrationBuilder.AddForeignKey(
                name: "FK_TenantMember_ClientSite_CSID",
                table: "TenantMember",
                column: "CSID",
                principalTable: "ClientSite",
                principalColumn: "CSID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TenantMember_ClientSite_CSID",
                table: "TenantMember");

            migrationBuilder.DropTable(
                name: "ClientMember");

            migrationBuilder.DropTable(
                name: "ClientSite");

            migrationBuilder.DropIndex(
                name: "IX_TenantMember_CSID",
                table: "TenantMember");

            migrationBuilder.DropColumn(
                name: "CSID",
                table: "trTask");

            migrationBuilder.DropColumn(
                name: "CSID",
                table: "trSchedulePlan");

            migrationBuilder.DropColumn(
                name: "CSID",
                table: "trRoster");

            migrationBuilder.DropColumn(
                name: "CSID",
                table: "trRole");

            migrationBuilder.DropColumn(
                name: "CSID",
                table: "trInviteMember");

            migrationBuilder.DropColumn(
                name: "CSID",
                table: "trCWOs");

            migrationBuilder.DropColumn(
                name: "CSID",
                table: "trCases");

            migrationBuilder.DropColumn(
                name: "CSID",
                table: "trAttendance");

            migrationBuilder.DropColumn(
                name: "CSID",
                table: "trActivityProcedure");

            migrationBuilder.DropColumn(
                name: "CSID",
                table: "trAction");

            migrationBuilder.DropColumn(
                name: "CSID",
                table: "TenantMember");

            migrationBuilder.DropColumn(
                name: "CSID",
                table: "OpsAppNotifications");

            migrationBuilder.DropColumn(
                name: "CSID",
                table: "mtStaff");

            migrationBuilder.DropColumn(
                name: "CSID",
                table: "mtShiftManPowerRequest");

            migrationBuilder.DropColumn(
                name: "CSID",
                table: "mtShift");

            migrationBuilder.DropColumn(
                name: "CSID",
                table: "mtPrivilege");

            migrationBuilder.DropColumn(
                name: "CSID",
                table: "mtMenu");

            migrationBuilder.DropColumn(
                name: "CSID",
                table: "mtAppConfig");

            migrationBuilder.DropColumn(
                name: "CSID",
                table: "Location");

            migrationBuilder.DropColumn(
                name: "CSID",
                table: "FCMDevice");

            migrationBuilder.DropColumn(
                name: "CSID",
                table: "EventsLog");

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("4199e4de-bdf8-48f8-a8a8-a5b31756a748"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 1, 28, 16, 33, 47, 107, DateTimeKind.Local).AddTicks(9330), new DateTime(2025, 1, 28, 16, 33, 47, 124, DateTimeKind.Local).AddTicks(4330) });

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("caa4ebec-15c8-4d6b-9985-6d6b66f94e63"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 1, 28, 16, 33, 47, 124, DateTimeKind.Local).AddTicks(4560), new DateTime(2025, 1, 28, 16, 33, 47, 124, DateTimeKind.Local).AddTicks(4560) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("18a79217-9fa7-460d-bccc-e74285b07531"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 1, 28, 16, 33, 47, 125, DateTimeKind.Local).AddTicks(5320), new DateTime(2025, 1, 28, 16, 33, 47, 125, DateTimeKind.Local).AddTicks(5320) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("bd69a88e-d6c1-42a1-8a3a-628843459909"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 1, 28, 16, 33, 47, 125, DateTimeKind.Local).AddTicks(5330), new DateTime(2025, 1, 28, 16, 33, 47, 125, DateTimeKind.Local).AddTicks(5330) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("c01c5086-cfa5-44ca-89d7-baa2c1accea6"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 1, 28, 16, 33, 47, 125, DateTimeKind.Local).AddTicks(5320), new DateTime(2025, 1, 28, 16, 33, 47, 125, DateTimeKind.Local).AddTicks(5330) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("d6016437-8b0f-4b0e-8175-5a11ffc480f5"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 1, 28, 16, 33, 47, 125, DateTimeKind.Local).AddTicks(5320), new DateTime(2025, 1, 28, 16, 33, 47, 125, DateTimeKind.Local).AddTicks(5320) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("f2cf879b-34f3-41da-9445-ee3bc590f224"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 1, 28, 16, 33, 47, 125, DateTimeKind.Local).AddTicks(5320), new DateTime(2025, 1, 28, 16, 33, 47, 125, DateTimeKind.Local).AddTicks(5320) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("fcddbf6b-88b8-4fae-ade7-63150ce1f1ec"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 1, 28, 16, 33, 47, 125, DateTimeKind.Local).AddTicks(5310), new DateTime(2025, 1, 28, 16, 33, 47, 125, DateTimeKind.Local).AddTicks(5310) });
        }
    }
}
