using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TCCTOBK.OperationBackend.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class AlterKeyTenantMemberSupportMultiClientSite : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TenantMember_ClientSite_CSID",
                table: "TenantMember");

            migrationBuilder.DropPrimaryKey(
                name: "PK_TenantMember",
                table: "TenantMember");

            migrationBuilder.DropIndex(
                name: "IX_TenantMember_CSID",
                table: "TenantMember");

            migrationBuilder.AlterColumn<Guid>(
                name: "CSID",
                table: "TenantMember",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("3075169a-bb4c-463f-a602-dac99228ceac"),
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true,
                oldDefaultValue: new Guid("3075169a-bb4c-463f-a602-dac99228ceac"));

            migrationBuilder.AddPrimaryKey(
                name: "PK_TenantMember",
                table: "TenantMember",
                columns: new[] { "CSID", "MID", "TID" });

            migrationBuilder.UpdateData(
                table: "Location",
                keyColumn: "LID",
                keyValue: new Guid("2c055101-2271-44e0-95fe-bcf2c59a459a"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 3, 19, 10, 49, 15, 164, DateTimeKind.Local).AddTicks(8902), new DateTime(2025, 3, 19, 10, 49, 15, 164, DateTimeKind.Local).AddTicks(8906) });

            migrationBuilder.CreateIndex(
                name: "IX_TenantMember_MID",
                table: "TenantMember",
                column: "MID");

            migrationBuilder.AddForeignKey(
                name: "FK_TenantMember_ClientSite_CSID",
                table: "TenantMember",
                column: "CSID",
                principalTable: "ClientSite",
                principalColumn: "CSID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TenantMember_ClientSite_CSID",
                table: "TenantMember");

            migrationBuilder.DropPrimaryKey(
                name: "PK_TenantMember",
                table: "TenantMember");

            migrationBuilder.DropIndex(
                name: "IX_TenantMember_MID",
                table: "TenantMember");

            migrationBuilder.AlterColumn<Guid>(
                name: "CSID",
                table: "TenantMember",
                type: "uuid",
                nullable: true,
                defaultValue: new Guid("3075169a-bb4c-463f-a602-dac99228ceac"),
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldDefaultValue: new Guid("3075169a-bb4c-463f-a602-dac99228ceac"));

            migrationBuilder.AddPrimaryKey(
                name: "PK_TenantMember",
                table: "TenantMember",
                columns: new[] { "MID", "TID" });

            migrationBuilder.UpdateData(
                table: "Location",
                keyColumn: "LID",
                keyValue: new Guid("2c055101-2271-44e0-95fe-bcf2c59a459a"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 3, 13, 22, 50, 4, 408, DateTimeKind.Local).AddTicks(4110), new DateTime(2025, 3, 13, 22, 50, 4, 408, DateTimeKind.Local).AddTicks(4110) });

            migrationBuilder.CreateIndex(
                name: "IX_TenantMember_CSID",
                table: "TenantMember",
                column: "CSID");

            migrationBuilder.AddForeignKey(
                name: "FK_TenantMember_ClientSite_CSID",
                table: "TenantMember",
                column: "CSID",
                principalTable: "ClientSite",
                principalColumn: "CSID");
        }
    }
}
