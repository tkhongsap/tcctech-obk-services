using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TCCTOBK.OperationBackend.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class CreateFucntionRoleLocation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "staffId",
                table: "SOCUser",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "trFunctionRoleLocation",
                columns: table => new
                {
                    FRLID = table.Column<Guid>(type: "uuid", nullable: false),
                    LocationId = table.Column<int>(type: "integer", nullable: false),
                    FunctionRoleId = table.Column<int>(type: "integer", nullable: false),
                    SID = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_trFunctionRoleLocation", x => x.FRLID);
                    table.ForeignKey(
                        name: "FK_trFunctionRoleLocation_SOCUser_SID",
                        column: x => x.SID,
                        principalTable: "SOCUser",
                        principalColumn: "SID",
                        onDelete: ReferentialAction.Cascade);
                });

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

            migrationBuilder.CreateIndex(
                name: "IX_trFunctionRoleLocation_SID",
                table: "trFunctionRoleLocation",
                column: "SID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "trFunctionRoleLocation");

            migrationBuilder.DropColumn(
                name: "staffId",
                table: "SOCUser");

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("4199e4de-bdf8-48f8-a8a8-a5b31756a748"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 12, 27, 15, 57, 5, 725, DateTimeKind.Local).AddTicks(5960), new DateTime(2024, 12, 27, 15, 57, 5, 739, DateTimeKind.Local).AddTicks(7150) });

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("caa4ebec-15c8-4d6b-9985-6d6b66f94e63"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 12, 27, 15, 57, 5, 739, DateTimeKind.Local).AddTicks(7410), new DateTime(2024, 12, 27, 15, 57, 5, 739, DateTimeKind.Local).AddTicks(7410) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("18a79217-9fa7-460d-bccc-e74285b07531"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 12, 27, 15, 57, 5, 740, DateTimeKind.Local).AddTicks(8940), new DateTime(2024, 12, 27, 15, 57, 5, 740, DateTimeKind.Local).AddTicks(8940) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("bd69a88e-d6c1-42a1-8a3a-628843459909"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 12, 27, 15, 57, 5, 740, DateTimeKind.Local).AddTicks(8950), new DateTime(2024, 12, 27, 15, 57, 5, 740, DateTimeKind.Local).AddTicks(8950) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("c01c5086-cfa5-44ca-89d7-baa2c1accea6"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 12, 27, 15, 57, 5, 740, DateTimeKind.Local).AddTicks(8950), new DateTime(2024, 12, 27, 15, 57, 5, 740, DateTimeKind.Local).AddTicks(8950) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("d6016437-8b0f-4b0e-8175-5a11ffc480f5"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 12, 27, 15, 57, 5, 740, DateTimeKind.Local).AddTicks(8950), new DateTime(2024, 12, 27, 15, 57, 5, 740, DateTimeKind.Local).AddTicks(8950) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("f2cf879b-34f3-41da-9445-ee3bc590f224"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 12, 27, 15, 57, 5, 740, DateTimeKind.Local).AddTicks(8940), new DateTime(2024, 12, 27, 15, 57, 5, 740, DateTimeKind.Local).AddTicks(8940) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("fcddbf6b-88b8-4fae-ade7-63150ce1f1ec"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 12, 27, 15, 57, 5, 740, DateTimeKind.Local).AddTicks(8930), new DateTime(2024, 12, 27, 15, 57, 5, 740, DateTimeKind.Local).AddTicks(8940) });
        }
    }
}
