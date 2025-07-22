using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace TCCTOBK.OperationBackend.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class TableMemberUAT : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "trMemberUAT",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    MetaData = table.Column<string>(type: "json", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_trMemberUAT", x => x.Id);
                });

            migrationBuilder.UpdateData(
                table: "Location",
                keyColumn: "LID",
                keyValue: new Guid("2c055101-2271-44e0-95fe-bcf2c59a459a"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(7363), new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(7367) });

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("4199e4de-bdf8-48f8-a8a8-a5b31756a748"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 25, 16, 10, 17, 868, DateTimeKind.Local).AddTicks(9855), new DateTime(2024, 7, 25, 16, 10, 17, 869, DateTimeKind.Local).AddTicks(4725) });

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("caa4ebec-15c8-4d6b-9985-6d6b66f94e63"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 25, 16, 10, 17, 869, DateTimeKind.Local).AddTicks(5200), new DateTime(2024, 7, 25, 16, 10, 17, 869, DateTimeKind.Local).AddTicks(5203) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc2"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 25, 16, 10, 17, 872, DateTimeKind.Local).AddTicks(9440), new DateTime(2024, 6, 25, 16, 10, 17, 872, DateTimeKind.Local).AddTicks(9517) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc3"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 25, 16, 10, 17, 872, DateTimeKind.Local).AddTicks(9539), new DateTime(2024, 6, 25, 16, 10, 17, 872, DateTimeKind.Local).AddTicks(9540) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc4"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 25, 16, 10, 17, 872, DateTimeKind.Local).AddTicks(9542), new DateTime(2024, 6, 25, 16, 10, 17, 872, DateTimeKind.Local).AddTicks(9543) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc5"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 25, 16, 10, 17, 872, DateTimeKind.Local).AddTicks(9545), new DateTime(2024, 6, 25, 16, 10, 17, 872, DateTimeKind.Local).AddTicks(9546) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("2aa84ed4-a495-47c8-913f-fa5928c1b4b8"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(1072), new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(1077) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("3ff4f468-53ef-48a3-8781-61a8a053fa99"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(1094), new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(1095) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("564d0272-92c8-4108-82b2-0f98882058d4"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(1098), new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(1099) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(1121), new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(1122) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("c1cb273c-570a-42f5-b563-66bac08911cc"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(1125), new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(1126) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("c1cb273c-570a-42f5-b563-66bac08911cd"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(1136), new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(1137) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc1"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(1133), new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(1134) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("18a79217-9fa7-460d-bccc-e74285b07531"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 25, 16, 10, 17, 874, DateTimeKind.Local).AddTicks(5720), new DateTime(2024, 7, 25, 16, 10, 17, 874, DateTimeKind.Local).AddTicks(5720) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("f2cf879b-34f3-41da-9445-ee3bc590f224"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 25, 16, 10, 17, 874, DateTimeKind.Local).AddTicks(5723), new DateTime(2024, 7, 25, 16, 10, 17, 874, DateTimeKind.Local).AddTicks(5723) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("fcddbf6b-88b8-4fae-ade7-63150ce1f1ec"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 25, 16, 10, 17, 874, DateTimeKind.Local).AddTicks(5709), new DateTime(2024, 7, 25, 16, 10, 17, 874, DateTimeKind.Local).AddTicks(5712) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("1a157bf0-4748-4589-91cc-1450e0c06596"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(2563), new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(2564) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(2580), new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(2581) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("3fa85f64-5717-4562-b3fc-2c963f66afa6"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(2577), new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(2578) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(2485), new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(2489) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(2558), new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(2560) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("3ff4f468-53ef-48a3-8781-61a8a053fa99"), new Guid("1a157bf0-4748-4589-91cc-1450e0c06596") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(5771), new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(5774) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("564d0272-92c8-4108-82b2-0f98882058d4"), new Guid("1a157bf0-4748-4589-91cc-1450e0c06596") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(5789), new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(5790) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"), new Guid("1a157bf0-4748-4589-91cc-1450e0c06596") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(5793), new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(5794) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("564d0272-92c8-4108-82b2-0f98882058d4"), new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(5796), new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(5797) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"), new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(5800), new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(5800) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("e8eb7171-de01-4a85-a955-711b211eecc1"), new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(5806), new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(5807) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("c1cb273c-570a-42f5-b563-66bac08911cc"), new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(5822), new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(5823) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("c1cb273c-570a-42f5-b563-66bac08911cd"), new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(5825), new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(5826) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("2aa84ed4-a495-47c8-913f-fa5928c1b4b8"), new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(5809), new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(5810) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("564d0272-92c8-4108-82b2-0f98882058d4"), new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(5813), new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(5814) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"), new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(5817), new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(5818) });

            migrationBuilder.UpdateData(
                table: "trTask",
                keyColumn: "Id",
                keyValue: new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(4011), new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(4015) });

            migrationBuilder.UpdateData(
                table: "trTask",
                keyColumn: "Id",
                keyValue: new Guid("4422cc3c-0ea5-4d73-a31e-a42485a81003"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(4032), new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(4033) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("1a157bf0-4748-4589-91cc-1450e0c06596"), new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(4754), new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(4757) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5"), new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(4772), new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(4773) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911"), new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(4775), new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(4776) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496"), new Guid("4422cc3c-0ea5-4d73-a31e-a42485a81003") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(4778), new DateTime(2024, 6, 25, 16, 10, 17, 873, DateTimeKind.Local).AddTicks(4797) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "trMemberUAT");

            migrationBuilder.UpdateData(
                table: "Location",
                keyColumn: "LID",
                keyValue: new Guid("2c055101-2271-44e0-95fe-bcf2c59a459a"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 21, 17, 36, 14, 228, DateTimeKind.Local).AddTicks(2723), new DateTime(2024, 6, 21, 17, 36, 14, 228, DateTimeKind.Local).AddTicks(2727) });

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("4199e4de-bdf8-48f8-a8a8-a5b31756a748"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 21, 17, 36, 14, 222, DateTimeKind.Local).AddTicks(3900), new DateTime(2024, 7, 21, 17, 36, 14, 222, DateTimeKind.Local).AddTicks(9443) });

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("caa4ebec-15c8-4d6b-9985-6d6b66f94e63"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 21, 17, 36, 14, 223, DateTimeKind.Local).AddTicks(130), new DateTime(2024, 7, 21, 17, 36, 14, 223, DateTimeKind.Local).AddTicks(133) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc2"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 21, 17, 36, 14, 227, DateTimeKind.Local).AddTicks(2771), new DateTime(2024, 6, 21, 17, 36, 14, 227, DateTimeKind.Local).AddTicks(2900) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc3"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 21, 17, 36, 14, 227, DateTimeKind.Local).AddTicks(2938), new DateTime(2024, 6, 21, 17, 36, 14, 227, DateTimeKind.Local).AddTicks(2940) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc4"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 21, 17, 36, 14, 227, DateTimeKind.Local).AddTicks(2944), new DateTime(2024, 6, 21, 17, 36, 14, 227, DateTimeKind.Local).AddTicks(2945) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc5"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 21, 17, 36, 14, 227, DateTimeKind.Local).AddTicks(2949), new DateTime(2024, 6, 21, 17, 36, 14, 227, DateTimeKind.Local).AddTicks(2950) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("2aa84ed4-a495-47c8-913f-fa5928c1b4b8"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 21, 17, 36, 14, 227, DateTimeKind.Local).AddTicks(5096), new DateTime(2024, 6, 21, 17, 36, 14, 227, DateTimeKind.Local).AddTicks(5101) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("3ff4f468-53ef-48a3-8781-61a8a053fa99"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 21, 17, 36, 14, 227, DateTimeKind.Local).AddTicks(5120), new DateTime(2024, 6, 21, 17, 36, 14, 227, DateTimeKind.Local).AddTicks(5127) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("564d0272-92c8-4108-82b2-0f98882058d4"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 21, 17, 36, 14, 227, DateTimeKind.Local).AddTicks(5130), new DateTime(2024, 6, 21, 17, 36, 14, 227, DateTimeKind.Local).AddTicks(5130) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 21, 17, 36, 14, 227, DateTimeKind.Local).AddTicks(5161), new DateTime(2024, 6, 21, 17, 36, 14, 227, DateTimeKind.Local).AddTicks(5162) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("c1cb273c-570a-42f5-b563-66bac08911cc"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 21, 17, 36, 14, 227, DateTimeKind.Local).AddTicks(5165), new DateTime(2024, 6, 21, 17, 36, 14, 227, DateTimeKind.Local).AddTicks(5166) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("c1cb273c-570a-42f5-b563-66bac08911cd"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 21, 17, 36, 14, 227, DateTimeKind.Local).AddTicks(5179), new DateTime(2024, 6, 21, 17, 36, 14, 227, DateTimeKind.Local).AddTicks(5180) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc1"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 21, 17, 36, 14, 227, DateTimeKind.Local).AddTicks(5176), new DateTime(2024, 6, 21, 17, 36, 14, 227, DateTimeKind.Local).AddTicks(5177) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("18a79217-9fa7-460d-bccc-e74285b07531"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 21, 17, 36, 14, 229, DateTimeKind.Local).AddTicks(2301), new DateTime(2024, 7, 21, 17, 36, 14, 229, DateTimeKind.Local).AddTicks(2302) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("f2cf879b-34f3-41da-9445-ee3bc590f224"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 21, 17, 36, 14, 229, DateTimeKind.Local).AddTicks(2305), new DateTime(2024, 7, 21, 17, 36, 14, 229, DateTimeKind.Local).AddTicks(2305) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("fcddbf6b-88b8-4fae-ade7-63150ce1f1ec"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 21, 17, 36, 14, 229, DateTimeKind.Local).AddTicks(2268), new DateTime(2024, 7, 21, 17, 36, 14, 229, DateTimeKind.Local).AddTicks(2285) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("1a157bf0-4748-4589-91cc-1450e0c06596"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 21, 17, 36, 14, 227, DateTimeKind.Local).AddTicks(7103), new DateTime(2024, 6, 21, 17, 36, 14, 227, DateTimeKind.Local).AddTicks(7104) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 21, 17, 36, 14, 227, DateTimeKind.Local).AddTicks(7126), new DateTime(2024, 6, 21, 17, 36, 14, 227, DateTimeKind.Local).AddTicks(7127) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("3fa85f64-5717-4562-b3fc-2c963f66afa6"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 21, 17, 36, 14, 227, DateTimeKind.Local).AddTicks(7121), new DateTime(2024, 6, 21, 17, 36, 14, 227, DateTimeKind.Local).AddTicks(7122) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 21, 17, 36, 14, 227, DateTimeKind.Local).AddTicks(7066), new DateTime(2024, 6, 21, 17, 36, 14, 227, DateTimeKind.Local).AddTicks(7071) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 21, 17, 36, 14, 227, DateTimeKind.Local).AddTicks(7098), new DateTime(2024, 6, 21, 17, 36, 14, 227, DateTimeKind.Local).AddTicks(7100) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("3ff4f468-53ef-48a3-8781-61a8a053fa99"), new Guid("1a157bf0-4748-4589-91cc-1450e0c06596") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 21, 17, 36, 14, 228, DateTimeKind.Local).AddTicks(1189), new DateTime(2024, 6, 21, 17, 36, 14, 228, DateTimeKind.Local).AddTicks(1192) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("564d0272-92c8-4108-82b2-0f98882058d4"), new Guid("1a157bf0-4748-4589-91cc-1450e0c06596") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 21, 17, 36, 14, 228, DateTimeKind.Local).AddTicks(1228), new DateTime(2024, 6, 21, 17, 36, 14, 228, DateTimeKind.Local).AddTicks(1230) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"), new Guid("1a157bf0-4748-4589-91cc-1450e0c06596") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 21, 17, 36, 14, 228, DateTimeKind.Local).AddTicks(1232), new DateTime(2024, 6, 21, 17, 36, 14, 228, DateTimeKind.Local).AddTicks(1233) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("564d0272-92c8-4108-82b2-0f98882058d4"), new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 21, 17, 36, 14, 228, DateTimeKind.Local).AddTicks(1235), new DateTime(2024, 6, 21, 17, 36, 14, 228, DateTimeKind.Local).AddTicks(1236) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"), new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 21, 17, 36, 14, 228, DateTimeKind.Local).AddTicks(1244), new DateTime(2024, 6, 21, 17, 36, 14, 228, DateTimeKind.Local).AddTicks(1245) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("e8eb7171-de01-4a85-a955-711b211eecc1"), new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 21, 17, 36, 14, 228, DateTimeKind.Local).AddTicks(1250), new DateTime(2024, 6, 21, 17, 36, 14, 228, DateTimeKind.Local).AddTicks(1251) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("c1cb273c-570a-42f5-b563-66bac08911cc"), new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 21, 17, 36, 14, 228, DateTimeKind.Local).AddTicks(1264), new DateTime(2024, 6, 21, 17, 36, 14, 228, DateTimeKind.Local).AddTicks(1265) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("c1cb273c-570a-42f5-b563-66bac08911cd"), new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 21, 17, 36, 14, 228, DateTimeKind.Local).AddTicks(1267), new DateTime(2024, 6, 21, 17, 36, 14, 228, DateTimeKind.Local).AddTicks(1268) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("2aa84ed4-a495-47c8-913f-fa5928c1b4b8"), new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 21, 17, 36, 14, 228, DateTimeKind.Local).AddTicks(1253), new DateTime(2024, 6, 21, 17, 36, 14, 228, DateTimeKind.Local).AddTicks(1254) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("564d0272-92c8-4108-82b2-0f98882058d4"), new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 21, 17, 36, 14, 228, DateTimeKind.Local).AddTicks(1257), new DateTime(2024, 6, 21, 17, 36, 14, 228, DateTimeKind.Local).AddTicks(1258) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"), new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 21, 17, 36, 14, 228, DateTimeKind.Local).AddTicks(1260), new DateTime(2024, 6, 21, 17, 36, 14, 228, DateTimeKind.Local).AddTicks(1261) });

            migrationBuilder.UpdateData(
                table: "trTask",
                keyColumn: "Id",
                keyValue: new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 21, 17, 36, 14, 227, DateTimeKind.Local).AddTicks(9090), new DateTime(2024, 6, 21, 17, 36, 14, 227, DateTimeKind.Local).AddTicks(9095) });

            migrationBuilder.UpdateData(
                table: "trTask",
                keyColumn: "Id",
                keyValue: new Guid("4422cc3c-0ea5-4d73-a31e-a42485a81003"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 21, 17, 36, 14, 227, DateTimeKind.Local).AddTicks(9118), new DateTime(2024, 6, 21, 17, 36, 14, 227, DateTimeKind.Local).AddTicks(9119) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("1a157bf0-4748-4589-91cc-1450e0c06596"), new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 21, 17, 36, 14, 228, DateTimeKind.Local).AddTicks(22), new DateTime(2024, 6, 21, 17, 36, 14, 228, DateTimeKind.Local).AddTicks(26) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5"), new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 21, 17, 36, 14, 228, DateTimeKind.Local).AddTicks(42), new DateTime(2024, 6, 21, 17, 36, 14, 228, DateTimeKind.Local).AddTicks(43) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911"), new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 21, 17, 36, 14, 228, DateTimeKind.Local).AddTicks(46), new DateTime(2024, 6, 21, 17, 36, 14, 228, DateTimeKind.Local).AddTicks(46) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496"), new Guid("4422cc3c-0ea5-4d73-a31e-a42485a81003") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 21, 17, 36, 14, 228, DateTimeKind.Local).AddTicks(49), new DateTime(2024, 6, 21, 17, 36, 14, 228, DateTimeKind.Local).AddTicks(78) });
        }
    }
}
