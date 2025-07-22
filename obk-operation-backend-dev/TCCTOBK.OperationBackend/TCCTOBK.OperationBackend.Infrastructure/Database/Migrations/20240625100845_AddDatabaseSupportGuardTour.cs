using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TCCTOBK.OperationBackend.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class AddDatabaseSupportGuardTour : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "mtActionType",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Action = table.Column<string>(type: "character varying", maxLength: 500, nullable: false),
                    CreatedBy = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    CreatedByName = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "timestamp without time zone", maxLength: 100, nullable: false),
                    UpdatedBy = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    UpdatedByName = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "timestamp without time zone", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_mtActionType", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "trSubtask",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying", maxLength: 500, nullable: false),
                    CreatedBy = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    CreatedByName = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "timestamp without time zone", maxLength: 100, nullable: false),
                    UpdatedBy = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    UpdatedByName = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "timestamp without time zone", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_trSubtask", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "trTask",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying", maxLength: 500, nullable: false),
                    StatusId = table.Column<int>(type: "integer", nullable: false),
                    StartDate = table.Column<DateTime>(type: "timestamp without time zone", maxLength: 100, nullable: true),
                    EndDate = table.Column<DateTime>(type: "timestamp without time zone", maxLength: 100, nullable: true),
                    LocationId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedBy = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    CreatedByName = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "timestamp without time zone", maxLength: 100, nullable: false),
                    UpdatedBy = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    UpdatedByName = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "timestamp without time zone", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_trTask", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "trAction",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying", maxLength: 500, nullable: false),
                    Description = table.Column<string>(type: "character varying", maxLength: 1000, nullable: false),
                    ActionType = table.Column<Guid>(type: "uuid", nullable: false),
                    MetaData = table.Column<string>(type: "json", nullable: true),
                    trSubtaskId = table.Column<Guid>(type: "uuid", nullable: true),
                    trTaskId = table.Column<Guid>(type: "uuid", nullable: true),
                    CreatedBy = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    CreatedByName = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "timestamp without time zone", maxLength: 100, nullable: false),
                    UpdatedBy = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    UpdatedByName = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "timestamp without time zone", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_trAction", x => x.Id);
                    table.ForeignKey(
                        name: "FK_trAction_mtActionType_ActionType",
                        column: x => x.ActionType,
                        principalTable: "mtActionType",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_trAction_trSubtask_trSubtaskId",
                        column: x => x.trSubtaskId,
                        principalTable: "trSubtask",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_trAction_trTask_trTaskId",
                        column: x => x.trTaskId,
                        principalTable: "trTask",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "trTaskSubtask",
                columns: table => new
                {
                    Task = table.Column<Guid>(type: "uuid", nullable: false),
                    Subtask = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedBy = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    CreatedByName = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "timestamp without time zone", maxLength: 100, nullable: false),
                    UpdatedBy = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    UpdatedByName = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "timestamp without time zone", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_trTaskSubtask", x => new { x.Task, x.Subtask });
                    table.ForeignKey(
                        name: "FK_trTaskSubtask_trSubtask_Subtask",
                        column: x => x.Subtask,
                        principalTable: "trSubtask",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_trTaskSubtask_trTask_Task",
                        column: x => x.Task,
                        principalTable: "trTask",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "trSubtaskAction",
                columns: table => new
                {
                    Subtask = table.Column<Guid>(type: "uuid", nullable: false),
                    Action = table.Column<Guid>(type: "uuid", nullable: false),
                    StatusId = table.Column<int>(type: "integer", nullable: false),
                    CreatedBy = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    CreatedByName = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "timestamp without time zone", maxLength: 100, nullable: false),
                    UpdatedBy = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    UpdatedByName = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "timestamp without time zone", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_trSubtaskAction", x => new { x.Subtask, x.Action });
                    table.ForeignKey(
                        name: "FK_trSubtaskAction_trAction_Action",
                        column: x => x.Action,
                        principalTable: "trAction",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_trSubtaskAction_trSubtask_Subtask",
                        column: x => x.Subtask,
                        principalTable: "trSubtask",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("4199e4de-bdf8-48f8-a8a8-a5b31756a748"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 25, 17, 8, 44, 646, DateTimeKind.Local).AddTicks(6858), new DateTime(2024, 6, 25, 17, 8, 44, 647, DateTimeKind.Local).AddTicks(742) });

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("caa4ebec-15c8-4d6b-9985-6d6b66f94e63"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 25, 17, 8, 44, 647, DateTimeKind.Local).AddTicks(1181), new DateTime(2024, 6, 25, 17, 8, 44, 647, DateTimeKind.Local).AddTicks(1184) });

            migrationBuilder.CreateIndex(
                name: "IX_trAction_ActionType",
                table: "trAction",
                column: "ActionType");

            migrationBuilder.CreateIndex(
                name: "IX_trAction_trSubtaskId",
                table: "trAction",
                column: "trSubtaskId");

            migrationBuilder.CreateIndex(
                name: "IX_trAction_trTaskId",
                table: "trAction",
                column: "trTaskId");

            migrationBuilder.CreateIndex(
                name: "IX_trSubtaskAction_Action",
                table: "trSubtaskAction",
                column: "Action");

            migrationBuilder.CreateIndex(
                name: "IX_trTaskSubtask_Subtask",
                table: "trTaskSubtask",
                column: "Subtask");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "trSubtaskAction");

            migrationBuilder.DropTable(
                name: "trTaskSubtask");

            migrationBuilder.DropTable(
                name: "trAction");

            migrationBuilder.DropTable(
                name: "mtActionType");

            migrationBuilder.DropTable(
                name: "trSubtask");

            migrationBuilder.DropTable(
                name: "trTask");

            migrationBuilder.DropColumn(
                name: "IsDelete",
                table: "trRole");

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("4199e4de-bdf8-48f8-a8a8-a5b31756a748"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 4, 17, 0, 13, 11, 544, DateTimeKind.Local).AddTicks(6193), new DateTime(2024, 4, 17, 0, 13, 11, 545, DateTimeKind.Local).AddTicks(3313) });

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("caa4ebec-15c8-4d6b-9985-6d6b66f94e63"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 4, 17, 0, 13, 11, 545, DateTimeKind.Local).AddTicks(3985), new DateTime(2024, 4, 17, 0, 13, 11, 545, DateTimeKind.Local).AddTicks(3990) });
        }
    }
}
