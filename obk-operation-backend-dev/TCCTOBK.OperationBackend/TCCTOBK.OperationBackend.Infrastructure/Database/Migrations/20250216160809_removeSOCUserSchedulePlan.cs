using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TCCTOBK.OperationBackend.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class removeSOCUserSchedulePlan : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_trSchedulePlan_SOCUser_MemberId",
                table: "trSchedulePlan");

            migrationBuilder.DropForeignKey(
                name: "FK_trSchedulePlan_taMember_MID",
                table: "trSchedulePlan");

            migrationBuilder.DropIndex(
                name: "IX_trSchedulePlan_MemberId",
                table: "trSchedulePlan");

            migrationBuilder.DropColumn(
                name: "MemberId",
                table: "trSchedulePlan");

            migrationBuilder.AlterColumn<Guid>(
                name: "MID",
                table: "trSchedulePlan",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("4199e4de-bdf8-48f8-a8a8-a5b31756a748"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 2, 16, 23, 8, 8, 369, DateTimeKind.Local).AddTicks(6390), new DateTime(2025, 2, 16, 23, 8, 8, 390, DateTimeKind.Local).AddTicks(2350) });

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("caa4ebec-15c8-4d6b-9985-6d6b66f94e63"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 2, 16, 23, 8, 8, 390, DateTimeKind.Local).AddTicks(2670), new DateTime(2025, 2, 16, 23, 8, 8, 390, DateTimeKind.Local).AddTicks(2670) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("18a79217-9fa7-460d-bccc-e74285b07531"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 2, 16, 23, 8, 8, 396, DateTimeKind.Local).AddTicks(3800), new DateTime(2025, 2, 16, 23, 8, 8, 396, DateTimeKind.Local).AddTicks(3810) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("bd69a88e-d6c1-42a1-8a3a-628843459909"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 2, 16, 23, 8, 8, 396, DateTimeKind.Local).AddTicks(3820), new DateTime(2025, 2, 16, 23, 8, 8, 396, DateTimeKind.Local).AddTicks(3820) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("c01c5086-cfa5-44ca-89d7-baa2c1accea6"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 2, 16, 23, 8, 8, 396, DateTimeKind.Local).AddTicks(3820), new DateTime(2025, 2, 16, 23, 8, 8, 396, DateTimeKind.Local).AddTicks(3820) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("d6016437-8b0f-4b0e-8175-5a11ffc480f5"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 2, 16, 23, 8, 8, 396, DateTimeKind.Local).AddTicks(3810), new DateTime(2025, 2, 16, 23, 8, 8, 396, DateTimeKind.Local).AddTicks(3820) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("f2cf879b-34f3-41da-9445-ee3bc590f224"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 2, 16, 23, 8, 8, 396, DateTimeKind.Local).AddTicks(3810), new DateTime(2025, 2, 16, 23, 8, 8, 396, DateTimeKind.Local).AddTicks(3810) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("fcddbf6b-88b8-4fae-ade7-63150ce1f1ec"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 2, 16, 23, 8, 8, 396, DateTimeKind.Local).AddTicks(3790), new DateTime(2025, 2, 16, 23, 8, 8, 396, DateTimeKind.Local).AddTicks(3800) });

            migrationBuilder.AddForeignKey(
                name: "FK_trSchedulePlan_taMember_MID",
                table: "trSchedulePlan",
                column: "MID",
                principalTable: "taMember",
                principalColumn: "MID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_trSchedulePlan_taMember_MID",
                table: "trSchedulePlan");

            migrationBuilder.AlterColumn<Guid>(
                name: "MID",
                table: "trSchedulePlan",
                type: "uuid",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.AddColumn<Guid>(
                name: "MemberId",
                table: "trSchedulePlan",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("4199e4de-bdf8-48f8-a8a8-a5b31756a748"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 2, 16, 22, 55, 10, 911, DateTimeKind.Local).AddTicks(880), new DateTime(2025, 2, 16, 22, 55, 10, 933, DateTimeKind.Local).AddTicks(3470) });

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("caa4ebec-15c8-4d6b-9985-6d6b66f94e63"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 2, 16, 22, 55, 10, 933, DateTimeKind.Local).AddTicks(3810), new DateTime(2025, 2, 16, 22, 55, 10, 933, DateTimeKind.Local).AddTicks(3810) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("18a79217-9fa7-460d-bccc-e74285b07531"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 2, 16, 22, 55, 10, 940, DateTimeKind.Local).AddTicks(1560), new DateTime(2025, 2, 16, 22, 55, 10, 940, DateTimeKind.Local).AddTicks(1560) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("bd69a88e-d6c1-42a1-8a3a-628843459909"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 2, 16, 22, 55, 10, 940, DateTimeKind.Local).AddTicks(1580), new DateTime(2025, 2, 16, 22, 55, 10, 940, DateTimeKind.Local).AddTicks(1580) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("c01c5086-cfa5-44ca-89d7-baa2c1accea6"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 2, 16, 22, 55, 10, 940, DateTimeKind.Local).AddTicks(1570), new DateTime(2025, 2, 16, 22, 55, 10, 940, DateTimeKind.Local).AddTicks(1570) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("d6016437-8b0f-4b0e-8175-5a11ffc480f5"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 2, 16, 22, 55, 10, 940, DateTimeKind.Local).AddTicks(1570), new DateTime(2025, 2, 16, 22, 55, 10, 940, DateTimeKind.Local).AddTicks(1570) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("f2cf879b-34f3-41da-9445-ee3bc590f224"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 2, 16, 22, 55, 10, 940, DateTimeKind.Local).AddTicks(1560), new DateTime(2025, 2, 16, 22, 55, 10, 940, DateTimeKind.Local).AddTicks(1560) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("fcddbf6b-88b8-4fae-ade7-63150ce1f1ec"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 2, 16, 22, 55, 10, 940, DateTimeKind.Local).AddTicks(1530), new DateTime(2025, 2, 16, 22, 55, 10, 940, DateTimeKind.Local).AddTicks(1540) });

            migrationBuilder.CreateIndex(
                name: "IX_trSchedulePlan_MemberId",
                table: "trSchedulePlan",
                column: "MemberId");

            // migrationBuilder.AddForeignKey(
            //     name: "FK_trSchedulePlan_SOCUser_MemberId",
            //     table: "trSchedulePlan",
            //     column: "MemberId",
            //     principalTable: "SOCUser",
            //     principalColumn: "SID",
            //     onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_trSchedulePlan_taMember_MID",
                table: "trSchedulePlan",
                column: "MID",
                principalTable: "taMember",
                principalColumn: "MID");
        }
    }
}
