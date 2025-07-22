using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TCCTOBK.OperationBackend.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class clearMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Remarks",
                table: "trTask",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Seq",
                table: "trSubtask",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "IsDelete",
                table: "taMember",
                type: "boolean",
                nullable: false,
                defaultValue: false);

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Remarks",
                table: "trTask");

            migrationBuilder.DropColumn(
                name: "Seq",
                table: "trSubtask");

            migrationBuilder.DropColumn(
                name: "IsDelete",
                table: "taMember");

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("4199e4de-bdf8-48f8-a8a8-a5b31756a748"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 1, 28, 9, 54, 55, 506, DateTimeKind.Local).AddTicks(1802), new DateTime(2025, 1, 28, 9, 54, 55, 507, DateTimeKind.Local).AddTicks(1060) });

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("caa4ebec-15c8-4d6b-9985-6d6b66f94e63"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 1, 28, 9, 54, 55, 507, DateTimeKind.Local).AddTicks(1564), new DateTime(2025, 1, 28, 9, 54, 55, 507, DateTimeKind.Local).AddTicks(1567) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("18a79217-9fa7-460d-bccc-e74285b07531"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 1, 28, 9, 54, 55, 509, DateTimeKind.Local).AddTicks(2430), new DateTime(2025, 1, 28, 9, 54, 55, 509, DateTimeKind.Local).AddTicks(2431) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("bd69a88e-d6c1-42a1-8a3a-628843459909"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 1, 28, 9, 54, 55, 509, DateTimeKind.Local).AddTicks(2478), new DateTime(2025, 1, 28, 9, 54, 55, 509, DateTimeKind.Local).AddTicks(2479) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("c01c5086-cfa5-44ca-89d7-baa2c1accea6"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 1, 28, 9, 54, 55, 509, DateTimeKind.Local).AddTicks(2475), new DateTime(2025, 1, 28, 9, 54, 55, 509, DateTimeKind.Local).AddTicks(2476) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("d6016437-8b0f-4b0e-8175-5a11ffc480f5"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 1, 28, 9, 54, 55, 509, DateTimeKind.Local).AddTicks(2439), new DateTime(2025, 1, 28, 9, 54, 55, 509, DateTimeKind.Local).AddTicks(2440) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("f2cf879b-34f3-41da-9445-ee3bc590f224"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 1, 28, 9, 54, 55, 509, DateTimeKind.Local).AddTicks(2433), new DateTime(2025, 1, 28, 9, 54, 55, 509, DateTimeKind.Local).AddTicks(2434) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("fcddbf6b-88b8-4fae-ade7-63150ce1f1ec"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 1, 28, 9, 54, 55, 509, DateTimeKind.Local).AddTicks(2407), new DateTime(2025, 1, 28, 9, 54, 55, 509, DateTimeKind.Local).AddTicks(2422) });
        }
    }
}
