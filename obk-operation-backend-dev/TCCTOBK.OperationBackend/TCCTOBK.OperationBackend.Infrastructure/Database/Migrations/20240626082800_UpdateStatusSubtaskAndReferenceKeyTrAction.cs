using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TCCTOBK.OperationBackend.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class UpdateStatusSubtaskAndReferenceKeyTrAction : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_trAction_trSubtask_trSubtaskId",
                table: "trAction");

            migrationBuilder.DropForeignKey(
                name: "FK_trAction_trTask_trTaskId",
                table: "trAction");

            migrationBuilder.DropIndex(
                name: "IX_trSubtaskAction_Action",
                table: "trSubtaskAction");

            migrationBuilder.DropIndex(
                name: "IX_trAction_trSubtaskId",
                table: "trAction");

            migrationBuilder.DropIndex(
                name: "IX_trAction_trTaskId",
                table: "trAction");

            migrationBuilder.DropColumn(
                name: "trSubtaskId",
                table: "trAction");

            migrationBuilder.DropColumn(
                name: "trTaskId",
                table: "trAction");

            migrationBuilder.AddColumn<int>(
                name: "StatusId",
                table: "trSubtask",
                type: "integer",
                nullable: false,
                defaultValue: 0);

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_trSubtaskAction_Action",
                table: "trSubtaskAction");

            migrationBuilder.DropColumn(
                name: "StatusId",
                table: "trSubtask");

            migrationBuilder.AddColumn<Guid>(
                name: "trSubtaskId",
                table: "trAction",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "trTaskId",
                table: "trAction",
                type: "uuid",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("4199e4de-bdf8-48f8-a8a8-a5b31756a748"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 26, 9, 0, 39, 550, DateTimeKind.Local).AddTicks(4513), new DateTime(2024, 6, 26, 9, 0, 39, 551, DateTimeKind.Local).AddTicks(4381) });

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("caa4ebec-15c8-4d6b-9985-6d6b66f94e63"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 26, 9, 0, 39, 551, DateTimeKind.Local).AddTicks(5267), new DateTime(2024, 6, 26, 9, 0, 39, 551, DateTimeKind.Local).AddTicks(5271) });

            migrationBuilder.CreateIndex(
                name: "IX_trSubtaskAction_Action",
                table: "trSubtaskAction",
                column: "Action");

            migrationBuilder.CreateIndex(
                name: "IX_trAction_trSubtaskId",
                table: "trAction",
                column: "trSubtaskId");

            migrationBuilder.CreateIndex(
                name: "IX_trAction_trTaskId",
                table: "trAction",
                column: "trTaskId");

            migrationBuilder.AddForeignKey(
                name: "FK_trAction_trSubtask_trSubtaskId",
                table: "trAction",
                column: "trSubtaskId",
                principalTable: "trSubtask",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_trAction_trTask_trTaskId",
                table: "trAction",
                column: "trTaskId",
                principalTable: "trTask",
                principalColumn: "Id");
        }
    }
}
