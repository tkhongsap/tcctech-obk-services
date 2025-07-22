using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TCCTOBK.OperationBackend.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class UsageMonitoring : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "trRoster",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "LocationCode",
                table: "trRoster",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AlterColumn<string>(
                name: "Component",
                table: "mtStaff",
                type: "character varying",
                maxLength: 255,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "character varying",
                oldMaxLength: 255,
                oldNullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "mtStaff",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateTable(
                name: "UsageLogMonitoring",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    FixedDailyUserTarget = table.Column<int>(type: "integer", nullable: true),
                    AtcualActiveDailyUser = table.Column<int>(type: "integer", nullable: true),
                    TotlaOnGroundStaffMustUseOpsApp = table.Column<int>(type: "integer", nullable: true),
                    TotalDalilyOnGroundStaffMustUseOpsAppWithRegister = table.Column<int>(type: "integer", nullable: true),
                    TotalDalilyOnGroundStaffMustUseOpsAppWithOutRegister = table.Column<int>(type: "integer", nullable: true),
                    Component = table.Column<string>(type: "character varying", nullable: true),
                    Statistics = table.Column<string>(type: "character varying", nullable: true),
                    AllStaff = table.Column<string>(type: "character varying", nullable: true),
                    SumWeekDay = table.Column<int>(type: "integer", nullable: true),
                    SumWeekEnd = table.Column<int>(type: "integer", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp without time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UsageLogMonitoring", x => x.Id);
                });

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("4199e4de-bdf8-48f8-a8a8-a5b31756a748"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 2, 10, 17, 12, 33, 555, DateTimeKind.Local).AddTicks(260), new DateTime(2025, 2, 10, 17, 12, 33, 562, DateTimeKind.Local).AddTicks(5580) });

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("caa4ebec-15c8-4d6b-9985-6d6b66f94e63"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 2, 10, 17, 12, 33, 562, DateTimeKind.Local).AddTicks(5810), new DateTime(2025, 2, 10, 17, 12, 33, 562, DateTimeKind.Local).AddTicks(5820) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("18a79217-9fa7-460d-bccc-e74285b07531"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 2, 10, 17, 12, 33, 563, DateTimeKind.Local).AddTicks(6130), new DateTime(2025, 2, 10, 17, 12, 33, 563, DateTimeKind.Local).AddTicks(6130) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("bd69a88e-d6c1-42a1-8a3a-628843459909"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 2, 10, 17, 12, 33, 563, DateTimeKind.Local).AddTicks(6140), new DateTime(2025, 2, 10, 17, 12, 33, 563, DateTimeKind.Local).AddTicks(6150) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("c01c5086-cfa5-44ca-89d7-baa2c1accea6"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 2, 10, 17, 12, 33, 563, DateTimeKind.Local).AddTicks(6140), new DateTime(2025, 2, 10, 17, 12, 33, 563, DateTimeKind.Local).AddTicks(6140) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("d6016437-8b0f-4b0e-8175-5a11ffc480f5"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 2, 10, 17, 12, 33, 563, DateTimeKind.Local).AddTicks(6140), new DateTime(2025, 2, 10, 17, 12, 33, 563, DateTimeKind.Local).AddTicks(6140) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("f2cf879b-34f3-41da-9445-ee3bc590f224"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 2, 10, 17, 12, 33, 563, DateTimeKind.Local).AddTicks(6140), new DateTime(2025, 2, 10, 17, 12, 33, 563, DateTimeKind.Local).AddTicks(6140) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("fcddbf6b-88b8-4fae-ade7-63150ce1f1ec"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 2, 10, 17, 12, 33, 563, DateTimeKind.Local).AddTicks(6120), new DateTime(2025, 2, 10, 17, 12, 33, 563, DateTimeKind.Local).AddTicks(6130) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UsageLogMonitoring");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "trRoster");

            migrationBuilder.DropColumn(
                name: "LocationCode",
                table: "trRoster");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "mtStaff");

            migrationBuilder.AlterColumn<string>(
                name: "Component",
                table: "mtStaff",
                type: "character varying",
                maxLength: 255,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying",
                oldMaxLength: 255);

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
