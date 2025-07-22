using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TCCTOBK.OperationBackend.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class UpdateReferenceKeySupportGuardTour : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_trSubtaskAction_Action",
                table: "trSubtaskAction");

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("4199e4de-bdf8-48f8-a8a8-a5b31756a748"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 26, 17, 5, 12, 591, DateTimeKind.Local).AddTicks(8461), new DateTime(2024, 6, 26, 17, 5, 12, 592, DateTimeKind.Local).AddTicks(5613) });

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("caa4ebec-15c8-4d6b-9985-6d6b66f94e63"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 26, 17, 5, 12, 592, DateTimeKind.Local).AddTicks(6022), new DateTime(2024, 6, 26, 17, 5, 12, 592, DateTimeKind.Local).AddTicks(6024) });

            migrationBuilder.CreateIndex(
                name: "IX_trSubtaskAction_Action",
                table: "trSubtaskAction",
                column: "Action");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_trSubtaskAction_Action",
                table: "trSubtaskAction");

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("4199e4de-bdf8-48f8-a8a8-a5b31756a748"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 26, 15, 27, 59, 358, DateTimeKind.Local).AddTicks(234), new DateTime(2024, 6, 26, 15, 27, 59, 358, DateTimeKind.Local).AddTicks(5032) });

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("caa4ebec-15c8-4d6b-9985-6d6b66f94e63"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 26, 15, 27, 59, 358, DateTimeKind.Local).AddTicks(5537), new DateTime(2024, 6, 26, 15, 27, 59, 358, DateTimeKind.Local).AddTicks(5540) });

            migrationBuilder.CreateIndex(
                name: "IX_trSubtaskAction_Action",
                table: "trSubtaskAction",
                column: "Action",
                unique: true);
        }
    }
}
