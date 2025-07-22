using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TCCTOBK.OperationBackend.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class RemoveRalationFCMMember : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FCMDevice_taMember_MemberId",
                table: "FCMDevice");

            migrationBuilder.AddColumn<int>(
                name: "UserType",
                table: "FCMDevice",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("4199e4de-bdf8-48f8-a8a8-a5b31756a748"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 1, 21, 13, 24, 48, 431, DateTimeKind.Local).AddTicks(4020), new DateTime(2025, 1, 21, 13, 24, 48, 449, DateTimeKind.Local).AddTicks(2520) });

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("caa4ebec-15c8-4d6b-9985-6d6b66f94e63"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 1, 21, 13, 24, 48, 449, DateTimeKind.Local).AddTicks(2820), new DateTime(2025, 1, 21, 13, 24, 48, 449, DateTimeKind.Local).AddTicks(2820) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("18a79217-9fa7-460d-bccc-e74285b07531"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 1, 21, 13, 24, 48, 450, DateTimeKind.Local).AddTicks(6870), new DateTime(2025, 1, 21, 13, 24, 48, 450, DateTimeKind.Local).AddTicks(6870) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("bd69a88e-d6c1-42a1-8a3a-628843459909"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 1, 21, 13, 24, 48, 450, DateTimeKind.Local).AddTicks(6880), new DateTime(2025, 1, 21, 13, 24, 48, 450, DateTimeKind.Local).AddTicks(6880) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("c01c5086-cfa5-44ca-89d7-baa2c1accea6"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 1, 21, 13, 24, 48, 450, DateTimeKind.Local).AddTicks(6880), new DateTime(2025, 1, 21, 13, 24, 48, 450, DateTimeKind.Local).AddTicks(6880) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("d6016437-8b0f-4b0e-8175-5a11ffc480f5"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 1, 21, 13, 24, 48, 450, DateTimeKind.Local).AddTicks(6870), new DateTime(2025, 1, 21, 13, 24, 48, 450, DateTimeKind.Local).AddTicks(6870) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("f2cf879b-34f3-41da-9445-ee3bc590f224"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 1, 21, 13, 24, 48, 450, DateTimeKind.Local).AddTicks(6870), new DateTime(2025, 1, 21, 13, 24, 48, 450, DateTimeKind.Local).AddTicks(6870) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("fcddbf6b-88b8-4fae-ade7-63150ce1f1ec"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 1, 21, 13, 24, 48, 450, DateTimeKind.Local).AddTicks(6850), new DateTime(2025, 1, 21, 13, 24, 48, 450, DateTimeKind.Local).AddTicks(6860) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UserType",
                table: "FCMDevice");

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("4199e4de-bdf8-48f8-a8a8-a5b31756a748"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 1, 20, 18, 24, 14, 694, DateTimeKind.Local).AddTicks(4710), new DateTime(2025, 1, 20, 18, 24, 14, 715, DateTimeKind.Local).AddTicks(6210) });

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("caa4ebec-15c8-4d6b-9985-6d6b66f94e63"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 1, 20, 18, 24, 14, 715, DateTimeKind.Local).AddTicks(6450), new DateTime(2025, 1, 20, 18, 24, 14, 715, DateTimeKind.Local).AddTicks(6450) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("18a79217-9fa7-460d-bccc-e74285b07531"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 1, 20, 18, 24, 14, 716, DateTimeKind.Local).AddTicks(7130), new DateTime(2025, 1, 20, 18, 24, 14, 716, DateTimeKind.Local).AddTicks(7130) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("bd69a88e-d6c1-42a1-8a3a-628843459909"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 1, 20, 18, 24, 14, 716, DateTimeKind.Local).AddTicks(7140), new DateTime(2025, 1, 20, 18, 24, 14, 716, DateTimeKind.Local).AddTicks(7140) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("c01c5086-cfa5-44ca-89d7-baa2c1accea6"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 1, 20, 18, 24, 14, 716, DateTimeKind.Local).AddTicks(7140), new DateTime(2025, 1, 20, 18, 24, 14, 716, DateTimeKind.Local).AddTicks(7140) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("d6016437-8b0f-4b0e-8175-5a11ffc480f5"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 1, 20, 18, 24, 14, 716, DateTimeKind.Local).AddTicks(7130), new DateTime(2025, 1, 20, 18, 24, 14, 716, DateTimeKind.Local).AddTicks(7140) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("f2cf879b-34f3-41da-9445-ee3bc590f224"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 1, 20, 18, 24, 14, 716, DateTimeKind.Local).AddTicks(7130), new DateTime(2025, 1, 20, 18, 24, 14, 716, DateTimeKind.Local).AddTicks(7130) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("fcddbf6b-88b8-4fae-ade7-63150ce1f1ec"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 1, 20, 18, 24, 14, 716, DateTimeKind.Local).AddTicks(7120), new DateTime(2025, 1, 20, 18, 24, 14, 716, DateTimeKind.Local).AddTicks(7120) });

            migrationBuilder.AddForeignKey(
                name: "FK_FCMDevice_taMember_MemberId",
                table: "FCMDevice",
                column: "MemberId",
                principalTable: "taMember",
                principalColumn: "MID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
