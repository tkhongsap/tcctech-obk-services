using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TCCTOBK.OperationBackend.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class UpdateTableSustainBanner : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "LabelLevel1CN",
                table: "trSustainabilityBanner",
                type: "character varying",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LabelLevel1TH",
                table: "trSustainabilityBanner",
                type: "character varying",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LabelLevel2CN",
                table: "trSustainabilityBanner",
                type: "character varying",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LabelLevel2TH",
                table: "trSustainabilityBanner",
                type: "character varying",
                maxLength: 50,
                nullable: true);

            migrationBuilder.UpdateData(
                table: "Location",
                keyColumn: "LID",
                keyValue: new Guid("2c055101-2271-44e0-95fe-bcf2c59a459a"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 11, 6, 15, 27, 4, 482, DateTimeKind.Local).AddTicks(841), new DateTime(2024, 11, 6, 15, 27, 4, 482, DateTimeKind.Local).AddTicks(843) });

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("4199e4de-bdf8-48f8-a8a8-a5b31756a748"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 11, 6, 15, 27, 4, 478, DateTimeKind.Local).AddTicks(4980), new DateTime(2024, 11, 6, 15, 27, 4, 478, DateTimeKind.Local).AddTicks(8063) });

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("caa4ebec-15c8-4d6b-9985-6d6b66f94e63"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 11, 6, 15, 27, 4, 478, DateTimeKind.Local).AddTicks(8364), new DateTime(2024, 11, 6, 15, 27, 4, 478, DateTimeKind.Local).AddTicks(8366) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc2"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 6, 15, 27, 4, 481, DateTimeKind.Local).AddTicks(6093), new DateTime(2024, 10, 6, 15, 27, 4, 481, DateTimeKind.Local).AddTicks(6154) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc3"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 6, 15, 27, 4, 481, DateTimeKind.Local).AddTicks(6171), new DateTime(2024, 10, 6, 15, 27, 4, 481, DateTimeKind.Local).AddTicks(6172) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc4"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 6, 15, 27, 4, 481, DateTimeKind.Local).AddTicks(6175), new DateTime(2024, 10, 6, 15, 27, 4, 481, DateTimeKind.Local).AddTicks(6175) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc5"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 6, 15, 27, 4, 481, DateTimeKind.Local).AddTicks(6187), new DateTime(2024, 10, 6, 15, 27, 4, 481, DateTimeKind.Local).AddTicks(6188) });

            migrationBuilder.UpdateData(
                table: "mtShiftManPowerRequest",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedDate", "StartDateTime", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 6, 15, 27, 4, 482, DateTimeKind.Local).AddTicks(7270), new DateTime(2024, 10, 6, 15, 27, 4, 482, DateTimeKind.Local).AddTicks(7116), new DateTime(2024, 10, 6, 15, 27, 4, 482, DateTimeKind.Local).AddTicks(7271) });

            migrationBuilder.UpdateData(
                table: "mtShiftManPowerRequest",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedDate", "StartDateTime", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 6, 15, 27, 4, 482, DateTimeKind.Local).AddTicks(7280), new DateTime(2024, 10, 6, 15, 27, 4, 482, DateTimeKind.Local).AddTicks(7278), new DateTime(2024, 10, 6, 15, 27, 4, 482, DateTimeKind.Local).AddTicks(7281) });

            migrationBuilder.UpdateData(
                table: "mtShiftManPowerRequest",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedDate", "StartDateTime", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 6, 15, 27, 4, 482, DateTimeKind.Local).AddTicks(7283), new DateTime(2024, 10, 6, 15, 27, 4, 482, DateTimeKind.Local).AddTicks(7282), new DateTime(2024, 10, 6, 15, 27, 4, 482, DateTimeKind.Local).AddTicks(7284) });

            migrationBuilder.UpdateData(
                table: "mtShiftManPowerRequest",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedDate", "StartDateTime", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 6, 15, 27, 4, 482, DateTimeKind.Local).AddTicks(7287), new DateTime(2024, 10, 6, 15, 27, 4, 482, DateTimeKind.Local).AddTicks(7286), new DateTime(2024, 10, 6, 15, 27, 4, 482, DateTimeKind.Local).AddTicks(7288) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("2aa84ed4-a495-47c8-913f-fa5928c1b4b8"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 6, 15, 27, 4, 481, DateTimeKind.Local).AddTicks(6888), new DateTime(2024, 10, 6, 15, 27, 4, 481, DateTimeKind.Local).AddTicks(6889) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("3ff4f468-53ef-48a3-8781-61a8a053fa99"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 6, 15, 27, 4, 481, DateTimeKind.Local).AddTicks(6897), new DateTime(2024, 10, 6, 15, 27, 4, 481, DateTimeKind.Local).AddTicks(6898) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("564d0272-92c8-4108-82b2-0f98882058d4"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 6, 15, 27, 4, 481, DateTimeKind.Local).AddTicks(6901), new DateTime(2024, 10, 6, 15, 27, 4, 481, DateTimeKind.Local).AddTicks(6902) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 6, 15, 27, 4, 481, DateTimeKind.Local).AddTicks(6905), new DateTime(2024, 10, 6, 15, 27, 4, 481, DateTimeKind.Local).AddTicks(6905) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("c1cb273c-570a-42f5-b563-66bac08911cc"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 6, 15, 27, 4, 481, DateTimeKind.Local).AddTicks(6908), new DateTime(2024, 10, 6, 15, 27, 4, 481, DateTimeKind.Local).AddTicks(6909) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("c1cb273c-570a-42f5-b563-66bac08911cd"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 6, 15, 27, 4, 481, DateTimeKind.Local).AddTicks(6927), new DateTime(2024, 10, 6, 15, 27, 4, 481, DateTimeKind.Local).AddTicks(6928) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc1"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 6, 15, 27, 4, 481, DateTimeKind.Local).AddTicks(6916), new DateTime(2024, 10, 6, 15, 27, 4, 481, DateTimeKind.Local).AddTicks(6924) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("18a79217-9fa7-460d-bccc-e74285b07531"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 11, 6, 15, 27, 4, 483, DateTimeKind.Local).AddTicks(3724), new DateTime(2024, 11, 6, 15, 27, 4, 483, DateTimeKind.Local).AddTicks(3725) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("f2cf879b-34f3-41da-9445-ee3bc590f224"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 11, 6, 15, 27, 4, 483, DateTimeKind.Local).AddTicks(3728), new DateTime(2024, 11, 6, 15, 27, 4, 483, DateTimeKind.Local).AddTicks(3728) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("fcddbf6b-88b8-4fae-ade7-63150ce1f1ec"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 11, 6, 15, 27, 4, 483, DateTimeKind.Local).AddTicks(3712), new DateTime(2024, 11, 6, 15, 27, 4, 483, DateTimeKind.Local).AddTicks(3718) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("1a157bf0-4748-4589-91cc-1450e0c06596"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 6, 15, 27, 4, 481, DateTimeKind.Local).AddTicks(7557), new DateTime(2024, 10, 6, 15, 27, 4, 481, DateTimeKind.Local).AddTicks(7557) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 6, 15, 27, 4, 481, DateTimeKind.Local).AddTicks(7562), new DateTime(2024, 10, 6, 15, 27, 4, 481, DateTimeKind.Local).AddTicks(7563) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("3fa85f64-5717-4562-b3fc-2c963f66afa6"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 6, 15, 27, 4, 481, DateTimeKind.Local).AddTicks(7559), new DateTime(2024, 10, 6, 15, 27, 4, 481, DateTimeKind.Local).AddTicks(7560) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 6, 15, 27, 4, 481, DateTimeKind.Local).AddTicks(7542), new DateTime(2024, 10, 6, 15, 27, 4, 481, DateTimeKind.Local).AddTicks(7543) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 6, 15, 27, 4, 481, DateTimeKind.Local).AddTicks(7553), new DateTime(2024, 10, 6, 15, 27, 4, 481, DateTimeKind.Local).AddTicks(7554) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("3ff4f468-53ef-48a3-8781-61a8a053fa99"), new Guid("1a157bf0-4748-4589-91cc-1450e0c06596") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 6, 15, 27, 4, 481, DateTimeKind.Local).AddTicks(9887), new DateTime(2024, 10, 6, 15, 27, 4, 481, DateTimeKind.Local).AddTicks(9890) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("564d0272-92c8-4108-82b2-0f98882058d4"), new Guid("1a157bf0-4748-4589-91cc-1450e0c06596") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 6, 15, 27, 4, 481, DateTimeKind.Local).AddTicks(9903), new DateTime(2024, 10, 6, 15, 27, 4, 481, DateTimeKind.Local).AddTicks(9904) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"), new Guid("1a157bf0-4748-4589-91cc-1450e0c06596") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 6, 15, 27, 4, 481, DateTimeKind.Local).AddTicks(9915), new DateTime(2024, 10, 6, 15, 27, 4, 481, DateTimeKind.Local).AddTicks(9916) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("564d0272-92c8-4108-82b2-0f98882058d4"), new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 6, 15, 27, 4, 481, DateTimeKind.Local).AddTicks(9918), new DateTime(2024, 10, 6, 15, 27, 4, 481, DateTimeKind.Local).AddTicks(9919) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"), new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 6, 15, 27, 4, 481, DateTimeKind.Local).AddTicks(9921), new DateTime(2024, 10, 6, 15, 27, 4, 481, DateTimeKind.Local).AddTicks(9922) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("e8eb7171-de01-4a85-a955-711b211eecc1"), new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 6, 15, 27, 4, 481, DateTimeKind.Local).AddTicks(9927), new DateTime(2024, 10, 6, 15, 27, 4, 481, DateTimeKind.Local).AddTicks(9928) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("c1cb273c-570a-42f5-b563-66bac08911cc"), new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 6, 15, 27, 4, 481, DateTimeKind.Local).AddTicks(9941), new DateTime(2024, 10, 6, 15, 27, 4, 481, DateTimeKind.Local).AddTicks(9948) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("c1cb273c-570a-42f5-b563-66bac08911cd"), new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 6, 15, 27, 4, 481, DateTimeKind.Local).AddTicks(9950), new DateTime(2024, 10, 6, 15, 27, 4, 481, DateTimeKind.Local).AddTicks(9951) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("2aa84ed4-a495-47c8-913f-fa5928c1b4b8"), new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 6, 15, 27, 4, 481, DateTimeKind.Local).AddTicks(9930), new DateTime(2024, 10, 6, 15, 27, 4, 481, DateTimeKind.Local).AddTicks(9931) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("564d0272-92c8-4108-82b2-0f98882058d4"), new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 6, 15, 27, 4, 481, DateTimeKind.Local).AddTicks(9933), new DateTime(2024, 10, 6, 15, 27, 4, 481, DateTimeKind.Local).AddTicks(9934) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"), new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 6, 15, 27, 4, 481, DateTimeKind.Local).AddTicks(9937), new DateTime(2024, 10, 6, 15, 27, 4, 481, DateTimeKind.Local).AddTicks(9937) });

            migrationBuilder.UpdateData(
                table: "trTask",
                keyColumn: "Id",
                keyValue: new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 6, 15, 27, 4, 481, DateTimeKind.Local).AddTicks(9026), new DateTime(2024, 10, 6, 15, 27, 4, 481, DateTimeKind.Local).AddTicks(9029) });

            migrationBuilder.UpdateData(
                table: "trTask",
                keyColumn: "Id",
                keyValue: new Guid("4422cc3c-0ea5-4d73-a31e-a42485a81003"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 6, 15, 27, 4, 481, DateTimeKind.Local).AddTicks(9049), new DateTime(2024, 10, 6, 15, 27, 4, 481, DateTimeKind.Local).AddTicks(9050) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("1a157bf0-4748-4589-91cc-1450e0c06596"), new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 6, 15, 27, 4, 481, DateTimeKind.Local).AddTicks(9355), new DateTime(2024, 10, 6, 15, 27, 4, 481, DateTimeKind.Local).AddTicks(9356) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5"), new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 6, 15, 27, 4, 481, DateTimeKind.Local).AddTicks(9364), new DateTime(2024, 10, 6, 15, 27, 4, 481, DateTimeKind.Local).AddTicks(9365) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911"), new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 6, 15, 27, 4, 481, DateTimeKind.Local).AddTicks(9367), new DateTime(2024, 10, 6, 15, 27, 4, 481, DateTimeKind.Local).AddTicks(9368) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496"), new Guid("4422cc3c-0ea5-4d73-a31e-a42485a81003") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 6, 15, 27, 4, 481, DateTimeKind.Local).AddTicks(9370), new DateTime(2024, 10, 6, 15, 27, 4, 481, DateTimeKind.Local).AddTicks(9371) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LabelLevel1CN",
                table: "trSustainabilityBanner");

            migrationBuilder.DropColumn(
                name: "LabelLevel1TH",
                table: "trSustainabilityBanner");

            migrationBuilder.DropColumn(
                name: "LabelLevel2CN",
                table: "trSustainabilityBanner");

            migrationBuilder.DropColumn(
                name: "LabelLevel2TH",
                table: "trSustainabilityBanner");

            migrationBuilder.UpdateData(
                table: "Location",
                keyColumn: "LID",
                keyValue: new Guid("2c055101-2271-44e0-95fe-bcf2c59a459a"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 30, 14, 15, 6, 211, DateTimeKind.Local).AddTicks(5347), new DateTime(2024, 10, 30, 14, 15, 6, 211, DateTimeKind.Local).AddTicks(5349) });

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("4199e4de-bdf8-48f8-a8a8-a5b31756a748"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 30, 14, 15, 6, 208, DateTimeKind.Local).AddTicks(257), new DateTime(2024, 10, 30, 14, 15, 6, 208, DateTimeKind.Local).AddTicks(3727) });

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("caa4ebec-15c8-4d6b-9985-6d6b66f94e63"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 30, 14, 15, 6, 208, DateTimeKind.Local).AddTicks(3931), new DateTime(2024, 10, 30, 14, 15, 6, 208, DateTimeKind.Local).AddTicks(3933) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc2"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 9, 30, 14, 15, 6, 211, DateTimeKind.Local).AddTicks(1320), new DateTime(2024, 9, 30, 14, 15, 6, 211, DateTimeKind.Local).AddTicks(1373) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc3"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 9, 30, 14, 15, 6, 211, DateTimeKind.Local).AddTicks(1401), new DateTime(2024, 9, 30, 14, 15, 6, 211, DateTimeKind.Local).AddTicks(1402) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc4"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 9, 30, 14, 15, 6, 211, DateTimeKind.Local).AddTicks(1405), new DateTime(2024, 9, 30, 14, 15, 6, 211, DateTimeKind.Local).AddTicks(1405) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc5"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 9, 30, 14, 15, 6, 211, DateTimeKind.Local).AddTicks(1407), new DateTime(2024, 9, 30, 14, 15, 6, 211, DateTimeKind.Local).AddTicks(1408) });

            migrationBuilder.UpdateData(
                table: "mtShiftManPowerRequest",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedDate", "StartDateTime", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 9, 30, 14, 15, 6, 212, DateTimeKind.Local).AddTicks(1716), new DateTime(2024, 9, 30, 14, 15, 6, 212, DateTimeKind.Local).AddTicks(1540), new DateTime(2024, 9, 30, 14, 15, 6, 212, DateTimeKind.Local).AddTicks(1718) });

            migrationBuilder.UpdateData(
                table: "mtShiftManPowerRequest",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedDate", "StartDateTime", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 9, 30, 14, 15, 6, 212, DateTimeKind.Local).AddTicks(1727), new DateTime(2024, 9, 30, 14, 15, 6, 212, DateTimeKind.Local).AddTicks(1726), new DateTime(2024, 9, 30, 14, 15, 6, 212, DateTimeKind.Local).AddTicks(1728) });

            migrationBuilder.UpdateData(
                table: "mtShiftManPowerRequest",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedDate", "StartDateTime", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 9, 30, 14, 15, 6, 212, DateTimeKind.Local).AddTicks(1731), new DateTime(2024, 9, 30, 14, 15, 6, 212, DateTimeKind.Local).AddTicks(1730), new DateTime(2024, 9, 30, 14, 15, 6, 212, DateTimeKind.Local).AddTicks(1732) });

            migrationBuilder.UpdateData(
                table: "mtShiftManPowerRequest",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedDate", "StartDateTime", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 9, 30, 14, 15, 6, 212, DateTimeKind.Local).AddTicks(1734), new DateTime(2024, 9, 30, 14, 15, 6, 212, DateTimeKind.Local).AddTicks(1733), new DateTime(2024, 9, 30, 14, 15, 6, 212, DateTimeKind.Local).AddTicks(1735) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("2aa84ed4-a495-47c8-913f-fa5928c1b4b8"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 9, 30, 14, 15, 6, 211, DateTimeKind.Local).AddTicks(2108), new DateTime(2024, 9, 30, 14, 15, 6, 211, DateTimeKind.Local).AddTicks(2109) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("3ff4f468-53ef-48a3-8781-61a8a053fa99"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 9, 30, 14, 15, 6, 211, DateTimeKind.Local).AddTicks(2116), new DateTime(2024, 9, 30, 14, 15, 6, 211, DateTimeKind.Local).AddTicks(2117) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("564d0272-92c8-4108-82b2-0f98882058d4"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 9, 30, 14, 15, 6, 211, DateTimeKind.Local).AddTicks(2121), new DateTime(2024, 9, 30, 14, 15, 6, 211, DateTimeKind.Local).AddTicks(2122) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 9, 30, 14, 15, 6, 211, DateTimeKind.Local).AddTicks(2125), new DateTime(2024, 9, 30, 14, 15, 6, 211, DateTimeKind.Local).AddTicks(2126) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("c1cb273c-570a-42f5-b563-66bac08911cc"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 9, 30, 14, 15, 6, 211, DateTimeKind.Local).AddTicks(2129), new DateTime(2024, 9, 30, 14, 15, 6, 211, DateTimeKind.Local).AddTicks(2140) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("c1cb273c-570a-42f5-b563-66bac08911cd"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 9, 30, 14, 15, 6, 211, DateTimeKind.Local).AddTicks(2151), new DateTime(2024, 9, 30, 14, 15, 6, 211, DateTimeKind.Local).AddTicks(2152) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc1"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 9, 30, 14, 15, 6, 211, DateTimeKind.Local).AddTicks(2147), new DateTime(2024, 9, 30, 14, 15, 6, 211, DateTimeKind.Local).AddTicks(2148) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("18a79217-9fa7-460d-bccc-e74285b07531"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 30, 14, 15, 6, 212, DateTimeKind.Local).AddTicks(8122), new DateTime(2024, 10, 30, 14, 15, 6, 212, DateTimeKind.Local).AddTicks(8123) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("f2cf879b-34f3-41da-9445-ee3bc590f224"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 30, 14, 15, 6, 212, DateTimeKind.Local).AddTicks(8125), new DateTime(2024, 10, 30, 14, 15, 6, 212, DateTimeKind.Local).AddTicks(8125) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("fcddbf6b-88b8-4fae-ade7-63150ce1f1ec"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 30, 14, 15, 6, 212, DateTimeKind.Local).AddTicks(8112), new DateTime(2024, 10, 30, 14, 15, 6, 212, DateTimeKind.Local).AddTicks(8116) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("1a157bf0-4748-4589-91cc-1450e0c06596"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 9, 30, 14, 15, 6, 211, DateTimeKind.Local).AddTicks(2786), new DateTime(2024, 9, 30, 14, 15, 6, 211, DateTimeKind.Local).AddTicks(2787) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 9, 30, 14, 15, 6, 211, DateTimeKind.Local).AddTicks(2792), new DateTime(2024, 9, 30, 14, 15, 6, 211, DateTimeKind.Local).AddTicks(2792) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("3fa85f64-5717-4562-b3fc-2c963f66afa6"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 9, 30, 14, 15, 6, 211, DateTimeKind.Local).AddTicks(2789), new DateTime(2024, 9, 30, 14, 15, 6, 211, DateTimeKind.Local).AddTicks(2790) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 9, 30, 14, 15, 6, 211, DateTimeKind.Local).AddTicks(2775), new DateTime(2024, 9, 30, 14, 15, 6, 211, DateTimeKind.Local).AddTicks(2776) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 9, 30, 14, 15, 6, 211, DateTimeKind.Local).AddTicks(2783), new DateTime(2024, 9, 30, 14, 15, 6, 211, DateTimeKind.Local).AddTicks(2784) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("3ff4f468-53ef-48a3-8781-61a8a053fa99"), new Guid("1a157bf0-4748-4589-91cc-1450e0c06596") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 9, 30, 14, 15, 6, 211, DateTimeKind.Local).AddTicks(4279), new DateTime(2024, 9, 30, 14, 15, 6, 211, DateTimeKind.Local).AddTicks(4281) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("564d0272-92c8-4108-82b2-0f98882058d4"), new Guid("1a157bf0-4748-4589-91cc-1450e0c06596") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 9, 30, 14, 15, 6, 211, DateTimeKind.Local).AddTicks(4299), new DateTime(2024, 9, 30, 14, 15, 6, 211, DateTimeKind.Local).AddTicks(4300) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"), new Guid("1a157bf0-4748-4589-91cc-1450e0c06596") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 9, 30, 14, 15, 6, 211, DateTimeKind.Local).AddTicks(4303), new DateTime(2024, 9, 30, 14, 15, 6, 211, DateTimeKind.Local).AddTicks(4304) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("564d0272-92c8-4108-82b2-0f98882058d4"), new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 9, 30, 14, 15, 6, 211, DateTimeKind.Local).AddTicks(4306), new DateTime(2024, 9, 30, 14, 15, 6, 211, DateTimeKind.Local).AddTicks(4307) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"), new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 9, 30, 14, 15, 6, 211, DateTimeKind.Local).AddTicks(4309), new DateTime(2024, 9, 30, 14, 15, 6, 211, DateTimeKind.Local).AddTicks(4310) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("e8eb7171-de01-4a85-a955-711b211eecc1"), new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 9, 30, 14, 15, 6, 211, DateTimeKind.Local).AddTicks(4315), new DateTime(2024, 9, 30, 14, 15, 6, 211, DateTimeKind.Local).AddTicks(4315) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("c1cb273c-570a-42f5-b563-66bac08911cc"), new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 9, 30, 14, 15, 6, 211, DateTimeKind.Local).AddTicks(4391), new DateTime(2024, 9, 30, 14, 15, 6, 211, DateTimeKind.Local).AddTicks(4392) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("c1cb273c-570a-42f5-b563-66bac08911cd"), new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 9, 30, 14, 15, 6, 211, DateTimeKind.Local).AddTicks(4395), new DateTime(2024, 9, 30, 14, 15, 6, 211, DateTimeKind.Local).AddTicks(4396) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("2aa84ed4-a495-47c8-913f-fa5928c1b4b8"), new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 9, 30, 14, 15, 6, 211, DateTimeKind.Local).AddTicks(4318), new DateTime(2024, 9, 30, 14, 15, 6, 211, DateTimeKind.Local).AddTicks(4319) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("564d0272-92c8-4108-82b2-0f98882058d4"), new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 9, 30, 14, 15, 6, 211, DateTimeKind.Local).AddTicks(4321), new DateTime(2024, 9, 30, 14, 15, 6, 211, DateTimeKind.Local).AddTicks(4322) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"), new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 9, 30, 14, 15, 6, 211, DateTimeKind.Local).AddTicks(4387), new DateTime(2024, 9, 30, 14, 15, 6, 211, DateTimeKind.Local).AddTicks(4388) });

            migrationBuilder.UpdateData(
                table: "trTask",
                keyColumn: "Id",
                keyValue: new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 9, 30, 14, 15, 6, 211, DateTimeKind.Local).AddTicks(3400), new DateTime(2024, 9, 30, 14, 15, 6, 211, DateTimeKind.Local).AddTicks(3401) });

            migrationBuilder.UpdateData(
                table: "trTask",
                keyColumn: "Id",
                keyValue: new Guid("4422cc3c-0ea5-4d73-a31e-a42485a81003"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 9, 30, 14, 15, 6, 211, DateTimeKind.Local).AddTicks(3409), new DateTime(2024, 9, 30, 14, 15, 6, 211, DateTimeKind.Local).AddTicks(3410) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("1a157bf0-4748-4589-91cc-1450e0c06596"), new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 9, 30, 14, 15, 6, 211, DateTimeKind.Local).AddTicks(3718), new DateTime(2024, 9, 30, 14, 15, 6, 211, DateTimeKind.Local).AddTicks(3719) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5"), new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 9, 30, 14, 15, 6, 211, DateTimeKind.Local).AddTicks(3726), new DateTime(2024, 9, 30, 14, 15, 6, 211, DateTimeKind.Local).AddTicks(3727) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911"), new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 9, 30, 14, 15, 6, 211, DateTimeKind.Local).AddTicks(3729), new DateTime(2024, 9, 30, 14, 15, 6, 211, DateTimeKind.Local).AddTicks(3730) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496"), new Guid("4422cc3c-0ea5-4d73-a31e-a42485a81003") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 9, 30, 14, 15, 6, 211, DateTimeKind.Local).AddTicks(3732), new DateTime(2024, 9, 30, 14, 15, 6, 211, DateTimeKind.Local).AddTicks(3733) });
        }
    }
}
