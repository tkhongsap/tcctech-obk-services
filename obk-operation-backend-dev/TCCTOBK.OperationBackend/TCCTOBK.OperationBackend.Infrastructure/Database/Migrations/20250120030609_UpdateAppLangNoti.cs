using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TCCTOBK.OperationBackend.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class UpdateAppLangNoti : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "MessageEn",
                table: "OpsAppNotifications",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "AppLanguest",
                table: "FCMDevice",
                type: "text",
                nullable: false,
                defaultValue: "");

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MessageEn",
                table: "OpsAppNotifications");

            migrationBuilder.DropColumn(
                name: "AppLanguest",
                table: "FCMDevice");

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("4199e4de-bdf8-48f8-a8a8-a5b31756a748"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 1, 8, 14, 9, 38, 102, DateTimeKind.Local).AddTicks(3710), new DateTime(2025, 1, 8, 14, 9, 38, 119, DateTimeKind.Local).AddTicks(7070) });

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("caa4ebec-15c8-4d6b-9985-6d6b66f94e63"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 1, 8, 14, 9, 38, 119, DateTimeKind.Local).AddTicks(7300), new DateTime(2025, 1, 8, 14, 9, 38, 119, DateTimeKind.Local).AddTicks(7300) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("18a79217-9fa7-460d-bccc-e74285b07531"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 1, 8, 14, 9, 38, 120, DateTimeKind.Local).AddTicks(8740), new DateTime(2025, 1, 8, 14, 9, 38, 120, DateTimeKind.Local).AddTicks(8750) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("bd69a88e-d6c1-42a1-8a3a-628843459909"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 1, 8, 14, 9, 38, 120, DateTimeKind.Local).AddTicks(8760), new DateTime(2025, 1, 8, 14, 9, 38, 120, DateTimeKind.Local).AddTicks(8760) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("c01c5086-cfa5-44ca-89d7-baa2c1accea6"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 1, 8, 14, 9, 38, 120, DateTimeKind.Local).AddTicks(8750), new DateTime(2025, 1, 8, 14, 9, 38, 120, DateTimeKind.Local).AddTicks(8750) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("d6016437-8b0f-4b0e-8175-5a11ffc480f5"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 1, 8, 14, 9, 38, 120, DateTimeKind.Local).AddTicks(8750), new DateTime(2025, 1, 8, 14, 9, 38, 120, DateTimeKind.Local).AddTicks(8750) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("f2cf879b-34f3-41da-9445-ee3bc590f224"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 1, 8, 14, 9, 38, 120, DateTimeKind.Local).AddTicks(8750), new DateTime(2025, 1, 8, 14, 9, 38, 120, DateTimeKind.Local).AddTicks(8750) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("fcddbf6b-88b8-4fae-ade7-63150ce1f1ec"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 1, 8, 14, 9, 38, 120, DateTimeKind.Local).AddTicks(8740), new DateTime(2025, 1, 8, 14, 9, 38, 120, DateTimeKind.Local).AddTicks(8740) });
        }
    }
}
