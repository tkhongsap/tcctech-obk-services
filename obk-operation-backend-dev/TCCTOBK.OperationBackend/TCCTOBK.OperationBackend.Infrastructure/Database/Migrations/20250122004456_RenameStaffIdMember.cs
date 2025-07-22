using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TCCTOBK.OperationBackend.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class RenameStaffIdMember : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "staffId",
                table: "taMember",
                newName: "StaffId");

            migrationBuilder.RenameColumn(
                name: "staffId",
                table: "SOCUser",
                newName: "StaffId");

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("4199e4de-bdf8-48f8-a8a8-a5b31756a748"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 1, 22, 7, 44, 56, 416, DateTimeKind.Local).AddTicks(3500), new DateTime(2025, 1, 22, 7, 44, 56, 439, DateTimeKind.Local).AddTicks(8750) });

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("caa4ebec-15c8-4d6b-9985-6d6b66f94e63"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 1, 22, 7, 44, 56, 439, DateTimeKind.Local).AddTicks(8980), new DateTime(2025, 1, 22, 7, 44, 56, 439, DateTimeKind.Local).AddTicks(8990) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("18a79217-9fa7-460d-bccc-e74285b07531"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 1, 22, 7, 44, 56, 440, DateTimeKind.Local).AddTicks(9510), new DateTime(2025, 1, 22, 7, 44, 56, 440, DateTimeKind.Local).AddTicks(9510) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("bd69a88e-d6c1-42a1-8a3a-628843459909"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 1, 22, 7, 44, 56, 440, DateTimeKind.Local).AddTicks(9520), new DateTime(2025, 1, 22, 7, 44, 56, 440, DateTimeKind.Local).AddTicks(9520) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("c01c5086-cfa5-44ca-89d7-baa2c1accea6"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 1, 22, 7, 44, 56, 440, DateTimeKind.Local).AddTicks(9520), new DateTime(2025, 1, 22, 7, 44, 56, 440, DateTimeKind.Local).AddTicks(9520) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("d6016437-8b0f-4b0e-8175-5a11ffc480f5"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 1, 22, 7, 44, 56, 440, DateTimeKind.Local).AddTicks(9520), new DateTime(2025, 1, 22, 7, 44, 56, 440, DateTimeKind.Local).AddTicks(9520) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("f2cf879b-34f3-41da-9445-ee3bc590f224"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 1, 22, 7, 44, 56, 440, DateTimeKind.Local).AddTicks(9510), new DateTime(2025, 1, 22, 7, 44, 56, 440, DateTimeKind.Local).AddTicks(9520) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("fcddbf6b-88b8-4fae-ade7-63150ce1f1ec"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 1, 22, 7, 44, 56, 440, DateTimeKind.Local).AddTicks(9510), new DateTime(2025, 1, 22, 7, 44, 56, 440, DateTimeKind.Local).AddTicks(9510) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "StaffId",
                table: "taMember",
                newName: "staffId");

            migrationBuilder.RenameColumn(
                name: "StaffId",
                table: "SOCUser",
                newName: "staffId");

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("4199e4de-bdf8-48f8-a8a8-a5b31756a748"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 1, 21, 14, 34, 28, 437, DateTimeKind.Local).AddTicks(2190), new DateTime(2025, 1, 21, 14, 34, 28, 445, DateTimeKind.Local).AddTicks(5430) });

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("caa4ebec-15c8-4d6b-9985-6d6b66f94e63"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 1, 21, 14, 34, 28, 445, DateTimeKind.Local).AddTicks(5650), new DateTime(2025, 1, 21, 14, 34, 28, 445, DateTimeKind.Local).AddTicks(5660) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("18a79217-9fa7-460d-bccc-e74285b07531"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 1, 21, 14, 34, 28, 446, DateTimeKind.Local).AddTicks(6220), new DateTime(2025, 1, 21, 14, 34, 28, 446, DateTimeKind.Local).AddTicks(6220) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("bd69a88e-d6c1-42a1-8a3a-628843459909"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 1, 21, 14, 34, 28, 446, DateTimeKind.Local).AddTicks(6230), new DateTime(2025, 1, 21, 14, 34, 28, 446, DateTimeKind.Local).AddTicks(6230) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("c01c5086-cfa5-44ca-89d7-baa2c1accea6"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 1, 21, 14, 34, 28, 446, DateTimeKind.Local).AddTicks(6230), new DateTime(2025, 1, 21, 14, 34, 28, 446, DateTimeKind.Local).AddTicks(6230) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("d6016437-8b0f-4b0e-8175-5a11ffc480f5"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 1, 21, 14, 34, 28, 446, DateTimeKind.Local).AddTicks(6220), new DateTime(2025, 1, 21, 14, 34, 28, 446, DateTimeKind.Local).AddTicks(6230) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("f2cf879b-34f3-41da-9445-ee3bc590f224"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 1, 21, 14, 34, 28, 446, DateTimeKind.Local).AddTicks(6220), new DateTime(2025, 1, 21, 14, 34, 28, 446, DateTimeKind.Local).AddTicks(6220) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("fcddbf6b-88b8-4fae-ade7-63150ce1f1ec"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 1, 21, 14, 34, 28, 446, DateTimeKind.Local).AddTicks(6210), new DateTime(2025, 1, 21, 14, 34, 28, 446, DateTimeKind.Local).AddTicks(6210) });
        }
    }
}
