using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace TCCTOBK.OperationBackend.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class CreateStaffEventlogRoster : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "EventsLog",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Type = table.Column<string>(type: "character varying", maxLength: 255, nullable: false),
                    Time = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    IpAddress = table.Column<string>(type: "text", nullable: false),
                    AuthMethod = table.Column<string>(type: "text", nullable: false),
                    TokenId = table.Column<Guid>(type: "uuid", nullable: false),
                    GrantType = table.Column<string>(type: "text", nullable: false),
                    RefreshTokenType = table.Column<string>(type: "text", nullable: false),
                    Scope = table.Column<string>(type: "text", nullable: false),
                    RefreshTokenId = table.Column<Guid>(type: "uuid", nullable: false),
                    ClientAuthMethod = table.Column<string>(type: "text", nullable: false),
                    Username = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EventsLog", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "mtStaff",
                columns: table => new
                {
                    Sfid = table.Column<Guid>(type: "uuid", nullable: false),
                    StaffName = table.Column<string>(type: "character varying", maxLength: 255, nullable: true),
                    Email = table.Column<string>(type: "character varying", maxLength: 255, nullable: false),
                    Component = table.Column<string>(type: "character varying", maxLength: 255, nullable: true),
                    Position = table.Column<string>(type: "character varying", maxLength: 255, nullable: true),
                    Company = table.Column<string>(type: "character varying", maxLength: 255, nullable: true),
                    Location = table.Column<string>(type: "character varying", nullable: true),
                    MustUseOpsApp = table.Column<bool>(type: "boolean", nullable: false),
                    isDelete = table.Column<int>(type: "integer", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    KeyCloakUserId = table.Column<string>(type: "character varying", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_mtStaff", x => x.Sfid);
                });

            migrationBuilder.CreateTable(
                name: "trRoster",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Component = table.Column<string>(type: "character varying", maxLength: 500, nullable: false),
                    WeekDay = table.Column<int>(type: "integer", nullable: true),
                    WeekEnd = table.Column<int>(type: "integer", nullable: true),
                    StartDateTime = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    EndDateTime = table.Column<DateTime>(type: "timestamp without time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_trRoster", x => x.Id);
                });

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("4199e4de-bdf8-48f8-a8a8-a5b31756a748"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 1, 20, 18, 7, 42, 973, DateTimeKind.Local).AddTicks(80), new DateTime(2025, 1, 20, 18, 7, 42, 981, DateTimeKind.Local).AddTicks(3920) });

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("caa4ebec-15c8-4d6b-9985-6d6b66f94e63"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 1, 20, 18, 7, 42, 981, DateTimeKind.Local).AddTicks(4140), new DateTime(2025, 1, 20, 18, 7, 42, 981, DateTimeKind.Local).AddTicks(4140) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("18a79217-9fa7-460d-bccc-e74285b07531"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 1, 20, 18, 7, 42, 982, DateTimeKind.Local).AddTicks(3530), new DateTime(2025, 1, 20, 18, 7, 42, 982, DateTimeKind.Local).AddTicks(3530) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("bd69a88e-d6c1-42a1-8a3a-628843459909"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 1, 20, 18, 7, 42, 982, DateTimeKind.Local).AddTicks(3540), new DateTime(2025, 1, 20, 18, 7, 42, 982, DateTimeKind.Local).AddTicks(3550) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("c01c5086-cfa5-44ca-89d7-baa2c1accea6"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 1, 20, 18, 7, 42, 982, DateTimeKind.Local).AddTicks(3540), new DateTime(2025, 1, 20, 18, 7, 42, 982, DateTimeKind.Local).AddTicks(3540) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("d6016437-8b0f-4b0e-8175-5a11ffc480f5"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 1, 20, 18, 7, 42, 982, DateTimeKind.Local).AddTicks(3540), new DateTime(2025, 1, 20, 18, 7, 42, 982, DateTimeKind.Local).AddTicks(3540) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("f2cf879b-34f3-41da-9445-ee3bc590f224"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 1, 20, 18, 7, 42, 982, DateTimeKind.Local).AddTicks(3540), new DateTime(2025, 1, 20, 18, 7, 42, 982, DateTimeKind.Local).AddTicks(3540) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("fcddbf6b-88b8-4fae-ade7-63150ce1f1ec"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 1, 20, 18, 7, 42, 982, DateTimeKind.Local).AddTicks(3530), new DateTime(2025, 1, 20, 18, 7, 42, 982, DateTimeKind.Local).AddTicks(3530) });

        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "EventsLog");

            migrationBuilder.DropTable(
                name: "mtStaff");

            migrationBuilder.DropTable(
                name: "trRoster");

            migrationBuilder.DropColumn(
                name: "staffId",
                table: "taMember");

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("4199e4de-bdf8-48f8-a8a8-a5b31756a748"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 1, 20, 10, 6, 8, 893, DateTimeKind.Local).AddTicks(6510), new DateTime(2025, 1, 20, 10, 6, 8, 910, DateTimeKind.Local).AddTicks(8230) });

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("caa4ebec-15c8-4d6b-9985-6d6b66f94e63"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 1, 20, 10, 6, 8, 910, DateTimeKind.Local).AddTicks(8480), new DateTime(2025, 1, 20, 10, 6, 8, 910, DateTimeKind.Local).AddTicks(8490) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("18a79217-9fa7-460d-bccc-e74285b07531"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 1, 20, 10, 6, 8, 912, DateTimeKind.Local).AddTicks(260), new DateTime(2025, 1, 20, 10, 6, 8, 912, DateTimeKind.Local).AddTicks(260) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("bd69a88e-d6c1-42a1-8a3a-628843459909"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 1, 20, 10, 6, 8, 912, DateTimeKind.Local).AddTicks(290), new DateTime(2025, 1, 20, 10, 6, 8, 912, DateTimeKind.Local).AddTicks(290) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("c01c5086-cfa5-44ca-89d7-baa2c1accea6"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 1, 20, 10, 6, 8, 912, DateTimeKind.Local).AddTicks(270), new DateTime(2025, 1, 20, 10, 6, 8, 912, DateTimeKind.Local).AddTicks(270) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("d6016437-8b0f-4b0e-8175-5a11ffc480f5"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 1, 20, 10, 6, 8, 912, DateTimeKind.Local).AddTicks(270), new DateTime(2025, 1, 20, 10, 6, 8, 912, DateTimeKind.Local).AddTicks(270) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("f2cf879b-34f3-41da-9445-ee3bc590f224"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 1, 20, 10, 6, 8, 912, DateTimeKind.Local).AddTicks(260), new DateTime(2025, 1, 20, 10, 6, 8, 912, DateTimeKind.Local).AddTicks(260) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("fcddbf6b-88b8-4fae-ade7-63150ce1f1ec"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 1, 20, 10, 6, 8, 912, DateTimeKind.Local).AddTicks(250), new DateTime(2025, 1, 20, 10, 6, 8, 912, DateTimeKind.Local).AddTicks(260) });

        }
    }
}
