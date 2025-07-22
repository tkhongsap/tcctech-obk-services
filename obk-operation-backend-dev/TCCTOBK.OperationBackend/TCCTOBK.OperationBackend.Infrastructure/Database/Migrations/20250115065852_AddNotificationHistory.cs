using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TCCTOBK.OperationBackend.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class AddNotificationHistory : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "OpsAppNotifications",
                columns: table => new
                {
                    OANID = table.Column<Guid>(type: "uuid", nullable: false),
                    FromUser = table.Column<Guid>(type: "uuid", nullable: false),
                    FromUserName = table.Column<string>(type: "text", nullable: false),
                    ToUser = table.Column<Guid>(type: "uuid", nullable: false),
                    ToUserName = table.Column<string>(type: "text", nullable: false),
                    UserType = table.Column<int>(type: "integer", nullable: false),
                    MessageType = table.Column<int>(type: "integer", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: false),
                    Message = table.Column<string>(type: "text", nullable: false),
                    IsSendSuccess = table.Column<bool>(type: "boolean", nullable: false),
                    FCMResult = table.Column<string>(type: "text", nullable: false),
                    IsRead = table.Column<bool>(type: "boolean", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "timestamp without time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OpsAppNotifications", x => x.OANID);
                });

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("4199e4de-bdf8-48f8-a8a8-a5b31756a748"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 1, 15, 13, 58, 52, 162, DateTimeKind.Local).AddTicks(7650), new DateTime(2025, 1, 15, 13, 58, 52, 179, DateTimeKind.Local).AddTicks(2290) });

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("caa4ebec-15c8-4d6b-9985-6d6b66f94e63"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 1, 15, 13, 58, 52, 179, DateTimeKind.Local).AddTicks(2560), new DateTime(2025, 1, 15, 13, 58, 52, 179, DateTimeKind.Local).AddTicks(2560) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("18a79217-9fa7-460d-bccc-e74285b07531"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 1, 15, 13, 58, 52, 180, DateTimeKind.Local).AddTicks(5820), new DateTime(2025, 1, 15, 13, 58, 52, 180, DateTimeKind.Local).AddTicks(5820) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("bd69a88e-d6c1-42a1-8a3a-628843459909"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 1, 15, 13, 58, 52, 180, DateTimeKind.Local).AddTicks(5830), new DateTime(2025, 1, 15, 13, 58, 52, 180, DateTimeKind.Local).AddTicks(5830) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("c01c5086-cfa5-44ca-89d7-baa2c1accea6"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 1, 15, 13, 58, 52, 180, DateTimeKind.Local).AddTicks(5830), new DateTime(2025, 1, 15, 13, 58, 52, 180, DateTimeKind.Local).AddTicks(5830) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("d6016437-8b0f-4b0e-8175-5a11ffc480f5"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 1, 15, 13, 58, 52, 180, DateTimeKind.Local).AddTicks(5830), new DateTime(2025, 1, 15, 13, 58, 52, 180, DateTimeKind.Local).AddTicks(5830) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("f2cf879b-34f3-41da-9445-ee3bc590f224"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 1, 15, 13, 58, 52, 180, DateTimeKind.Local).AddTicks(5820), new DateTime(2025, 1, 15, 13, 58, 52, 180, DateTimeKind.Local).AddTicks(5820) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("fcddbf6b-88b8-4fae-ade7-63150ce1f1ec"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 1, 15, 13, 58, 52, 180, DateTimeKind.Local).AddTicks(5810), new DateTime(2025, 1, 15, 13, 58, 52, 180, DateTimeKind.Local).AddTicks(5820) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "OpsAppNotifications");

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("4199e4de-bdf8-48f8-a8a8-a5b31756a748"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 1, 6, 13, 53, 19, 200, DateTimeKind.Local).AddTicks(950), new DateTime(2025, 1, 6, 13, 53, 19, 207, DateTimeKind.Local).AddTicks(2600) });

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("caa4ebec-15c8-4d6b-9985-6d6b66f94e63"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 1, 6, 13, 53, 19, 207, DateTimeKind.Local).AddTicks(2810), new DateTime(2025, 1, 6, 13, 53, 19, 207, DateTimeKind.Local).AddTicks(2810) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("18a79217-9fa7-460d-bccc-e74285b07531"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 1, 6, 13, 53, 19, 208, DateTimeKind.Local).AddTicks(2120), new DateTime(2025, 1, 6, 13, 53, 19, 208, DateTimeKind.Local).AddTicks(2120) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("bd69a88e-d6c1-42a1-8a3a-628843459909"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 1, 6, 13, 53, 19, 208, DateTimeKind.Local).AddTicks(2130), new DateTime(2025, 1, 6, 13, 53, 19, 208, DateTimeKind.Local).AddTicks(2130) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("c01c5086-cfa5-44ca-89d7-baa2c1accea6"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 1, 6, 13, 53, 19, 208, DateTimeKind.Local).AddTicks(2130), new DateTime(2025, 1, 6, 13, 53, 19, 208, DateTimeKind.Local).AddTicks(2130) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("d6016437-8b0f-4b0e-8175-5a11ffc480f5"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 1, 6, 13, 53, 19, 208, DateTimeKind.Local).AddTicks(2120), new DateTime(2025, 1, 6, 13, 53, 19, 208, DateTimeKind.Local).AddTicks(2130) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("f2cf879b-34f3-41da-9445-ee3bc590f224"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 1, 6, 13, 53, 19, 208, DateTimeKind.Local).AddTicks(2120), new DateTime(2025, 1, 6, 13, 53, 19, 208, DateTimeKind.Local).AddTicks(2120) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("fcddbf6b-88b8-4fae-ade7-63150ce1f1ec"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 1, 6, 13, 53, 19, 208, DateTimeKind.Local).AddTicks(2110), new DateTime(2025, 1, 6, 13, 53, 19, 208, DateTimeKind.Local).AddTicks(2110) });
        }
    }
}
