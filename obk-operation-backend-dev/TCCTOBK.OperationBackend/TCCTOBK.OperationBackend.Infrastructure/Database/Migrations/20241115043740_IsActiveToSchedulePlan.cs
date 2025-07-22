using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace TCCTOBK.OperationBackend.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class IsActiveToSchedulePlan : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "trSchedulePlan",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.UpdateData(
                table: "Location",
                keyColumn: "LID",
                keyValue: new Guid("2c055101-2271-44e0-95fe-bcf2c59a459a"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 11, 15, 11, 37, 38, 172, DateTimeKind.Local).AddTicks(6251), new DateTime(2024, 11, 15, 11, 37, 38, 172, DateTimeKind.Local).AddTicks(6254) });

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("4199e4de-bdf8-48f8-a8a8-a5b31756a748"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 11, 15, 11, 37, 38, 166, DateTimeKind.Local).AddTicks(7701), new DateTime(2024, 11, 15, 11, 37, 38, 167, DateTimeKind.Local).AddTicks(2591) });

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("caa4ebec-15c8-4d6b-9985-6d6b66f94e63"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 11, 15, 11, 37, 38, 167, DateTimeKind.Local).AddTicks(3083), new DateTime(2024, 11, 15, 11, 37, 38, 167, DateTimeKind.Local).AddTicks(3087) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc2"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 15, 11, 37, 38, 171, DateTimeKind.Local).AddTicks(7208), new DateTime(2024, 10, 15, 11, 37, 38, 171, DateTimeKind.Local).AddTicks(7318) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc3"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 15, 11, 37, 38, 171, DateTimeKind.Local).AddTicks(7370), new DateTime(2024, 10, 15, 11, 37, 38, 171, DateTimeKind.Local).AddTicks(7371) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc4"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 15, 11, 37, 38, 171, DateTimeKind.Local).AddTicks(7374), new DateTime(2024, 10, 15, 11, 37, 38, 171, DateTimeKind.Local).AddTicks(7375) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc5"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 15, 11, 37, 38, 171, DateTimeKind.Local).AddTicks(7377), new DateTime(2024, 10, 15, 11, 37, 38, 171, DateTimeKind.Local).AddTicks(7378) });

            migrationBuilder.UpdateData(
                table: "mtShiftManPowerRequest",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedDate", "StartDateTime", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 15, 11, 37, 38, 174, DateTimeKind.Local).AddTicks(2799), new DateTime(2024, 10, 15, 11, 37, 38, 174, DateTimeKind.Local).AddTicks(2435), new DateTime(2024, 10, 15, 11, 37, 38, 174, DateTimeKind.Local).AddTicks(2804) });

            migrationBuilder.UpdateData(
                table: "mtShiftManPowerRequest",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedDate", "StartDateTime", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 15, 11, 37, 38, 174, DateTimeKind.Local).AddTicks(2827), new DateTime(2024, 10, 15, 11, 37, 38, 174, DateTimeKind.Local).AddTicks(2825), new DateTime(2024, 10, 15, 11, 37, 38, 174, DateTimeKind.Local).AddTicks(2828) });

            migrationBuilder.UpdateData(
                table: "mtShiftManPowerRequest",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedDate", "StartDateTime", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 15, 11, 37, 38, 174, DateTimeKind.Local).AddTicks(2831), new DateTime(2024, 10, 15, 11, 37, 38, 174, DateTimeKind.Local).AddTicks(2830), new DateTime(2024, 10, 15, 11, 37, 38, 174, DateTimeKind.Local).AddTicks(2832) });

            migrationBuilder.UpdateData(
                table: "mtShiftManPowerRequest",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedDate", "StartDateTime", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 15, 11, 37, 38, 174, DateTimeKind.Local).AddTicks(2835), new DateTime(2024, 10, 15, 11, 37, 38, 174, DateTimeKind.Local).AddTicks(2834), new DateTime(2024, 10, 15, 11, 37, 38, 174, DateTimeKind.Local).AddTicks(2836) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("2aa84ed4-a495-47c8-913f-fa5928c1b4b8"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 15, 11, 37, 38, 171, DateTimeKind.Local).AddTicks(8998), new DateTime(2024, 10, 15, 11, 37, 38, 171, DateTimeKind.Local).AddTicks(9003) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("3ff4f468-53ef-48a3-8781-61a8a053fa99"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 15, 11, 37, 38, 171, DateTimeKind.Local).AddTicks(9023), new DateTime(2024, 10, 15, 11, 37, 38, 171, DateTimeKind.Local).AddTicks(9024) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("564d0272-92c8-4108-82b2-0f98882058d4"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 15, 11, 37, 38, 171, DateTimeKind.Local).AddTicks(9027), new DateTime(2024, 10, 15, 11, 37, 38, 171, DateTimeKind.Local).AddTicks(9028) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 15, 11, 37, 38, 171, DateTimeKind.Local).AddTicks(9031), new DateTime(2024, 10, 15, 11, 37, 38, 171, DateTimeKind.Local).AddTicks(9032) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("c1cb273c-570a-42f5-b563-66bac08911cc"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 15, 11, 37, 38, 171, DateTimeKind.Local).AddTicks(9054), new DateTime(2024, 10, 15, 11, 37, 38, 171, DateTimeKind.Local).AddTicks(9055) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("c1cb273c-570a-42f5-b563-66bac08911cd"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 15, 11, 37, 38, 171, DateTimeKind.Local).AddTicks(9072), new DateTime(2024, 10, 15, 11, 37, 38, 171, DateTimeKind.Local).AddTicks(9073) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc1"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 15, 11, 37, 38, 171, DateTimeKind.Local).AddTicks(9068), new DateTime(2024, 10, 15, 11, 37, 38, 171, DateTimeKind.Local).AddTicks(9069) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("18a79217-9fa7-460d-bccc-e74285b07531"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 11, 15, 11, 37, 38, 175, DateTimeKind.Local).AddTicks(4267), new DateTime(2024, 11, 15, 11, 37, 38, 175, DateTimeKind.Local).AddTicks(4268) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("f2cf879b-34f3-41da-9445-ee3bc590f224"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 11, 15, 11, 37, 38, 175, DateTimeKind.Local).AddTicks(4271), new DateTime(2024, 11, 15, 11, 37, 38, 175, DateTimeKind.Local).AddTicks(4272) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("fcddbf6b-88b8-4fae-ade7-63150ce1f1ec"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 11, 15, 11, 37, 38, 175, DateTimeKind.Local).AddTicks(4201), new DateTime(2024, 11, 15, 11, 37, 38, 175, DateTimeKind.Local).AddTicks(4208) });

            migrationBuilder.InsertData(
                table: "trRole",
                columns: new[] { "RID", "CreatedBy", "CreatedByName", "CreatedDate", "Description", "IsActive", "IsDelete", "Name", "TID", "UpdatedBy", "UpdatedByName", "UpdatedDate" },
                values: new object[,]
                {
                    { new Guid("bd69a88e-d6c1-42a1-8a3a-628843459909"), "00000000-0000-0000-0000-000000000000", "System", new DateTime(2024, 11, 15, 11, 37, 38, 175, DateTimeKind.Local).AddTicks(4282), "SOC manager", true, false, "SOC manager", new Guid("caa4ebec-15c8-4d6b-9985-6d6b66f94e63"), "00000000-0000-0000-0000-000000000000", "System", new DateTime(2024, 11, 15, 11, 37, 38, 175, DateTimeKind.Local).AddTicks(4283) },
                    { new Guid("c01c5086-cfa5-44ca-89d7-baa2c1accea6"), "00000000-0000-0000-0000-000000000000", "System", new DateTime(2024, 11, 15, 11, 37, 38, 175, DateTimeKind.Local).AddTicks(4279), "FMC manager", true, false, "FMC manager", new Guid("caa4ebec-15c8-4d6b-9985-6d6b66f94e63"), "00000000-0000-0000-0000-000000000000", "System", new DateTime(2024, 11, 15, 11, 37, 38, 175, DateTimeKind.Local).AddTicks(4280) },
                    { new Guid("d6016437-8b0f-4b0e-8175-5a11ffc480f5"), "00000000-0000-0000-0000-000000000000", "System", new DateTime(2024, 11, 15, 11, 37, 38, 175, DateTimeKind.Local).AddTicks(4276), "Dcc", true, false, "Dcc", new Guid("caa4ebec-15c8-4d6b-9985-6d6b66f94e63"), "00000000-0000-0000-0000-000000000000", "System", new DateTime(2024, 11, 15, 11, 37, 38, 175, DateTimeKind.Local).AddTicks(4277) }
                });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("1a157bf0-4748-4589-91cc-1450e0c06596"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 15, 11, 37, 38, 172, DateTimeKind.Local).AddTicks(573), new DateTime(2024, 10, 15, 11, 37, 38, 172, DateTimeKind.Local).AddTicks(574) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 15, 11, 37, 38, 172, DateTimeKind.Local).AddTicks(580), new DateTime(2024, 10, 15, 11, 37, 38, 172, DateTimeKind.Local).AddTicks(581) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("3fa85f64-5717-4562-b3fc-2c963f66afa6"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 15, 11, 37, 38, 172, DateTimeKind.Local).AddTicks(576), new DateTime(2024, 10, 15, 11, 37, 38, 172, DateTimeKind.Local).AddTicks(577) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 15, 11, 37, 38, 172, DateTimeKind.Local).AddTicks(543), new DateTime(2024, 10, 15, 11, 37, 38, 172, DateTimeKind.Local).AddTicks(548) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 15, 11, 37, 38, 172, DateTimeKind.Local).AddTicks(569), new DateTime(2024, 10, 15, 11, 37, 38, 172, DateTimeKind.Local).AddTicks(571) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("3ff4f468-53ef-48a3-8781-61a8a053fa99"), new Guid("1a157bf0-4748-4589-91cc-1450e0c06596") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 15, 11, 37, 38, 172, DateTimeKind.Local).AddTicks(4083), new DateTime(2024, 10, 15, 11, 37, 38, 172, DateTimeKind.Local).AddTicks(4087) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("564d0272-92c8-4108-82b2-0f98882058d4"), new Guid("1a157bf0-4748-4589-91cc-1450e0c06596") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 15, 11, 37, 38, 172, DateTimeKind.Local).AddTicks(4120), new DateTime(2024, 10, 15, 11, 37, 38, 172, DateTimeKind.Local).AddTicks(4121) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"), new Guid("1a157bf0-4748-4589-91cc-1450e0c06596") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 15, 11, 37, 38, 172, DateTimeKind.Local).AddTicks(4124), new DateTime(2024, 10, 15, 11, 37, 38, 172, DateTimeKind.Local).AddTicks(4125) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("564d0272-92c8-4108-82b2-0f98882058d4"), new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 15, 11, 37, 38, 172, DateTimeKind.Local).AddTicks(4128), new DateTime(2024, 10, 15, 11, 37, 38, 172, DateTimeKind.Local).AddTicks(4129) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"), new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 15, 11, 37, 38, 172, DateTimeKind.Local).AddTicks(4133), new DateTime(2024, 10, 15, 11, 37, 38, 172, DateTimeKind.Local).AddTicks(4134) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("e8eb7171-de01-4a85-a955-711b211eecc1"), new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 15, 11, 37, 38, 172, DateTimeKind.Local).AddTicks(4140), new DateTime(2024, 10, 15, 11, 37, 38, 172, DateTimeKind.Local).AddTicks(4141) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("c1cb273c-570a-42f5-b563-66bac08911cc"), new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 15, 11, 37, 38, 172, DateTimeKind.Local).AddTicks(4168), new DateTime(2024, 10, 15, 11, 37, 38, 172, DateTimeKind.Local).AddTicks(4170) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("c1cb273c-570a-42f5-b563-66bac08911cd"), new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 15, 11, 37, 38, 172, DateTimeKind.Local).AddTicks(4172), new DateTime(2024, 10, 15, 11, 37, 38, 172, DateTimeKind.Local).AddTicks(4173) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("2aa84ed4-a495-47c8-913f-fa5928c1b4b8"), new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 15, 11, 37, 38, 172, DateTimeKind.Local).AddTicks(4144), new DateTime(2024, 10, 15, 11, 37, 38, 172, DateTimeKind.Local).AddTicks(4145) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("564d0272-92c8-4108-82b2-0f98882058d4"), new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 15, 11, 37, 38, 172, DateTimeKind.Local).AddTicks(4148), new DateTime(2024, 10, 15, 11, 37, 38, 172, DateTimeKind.Local).AddTicks(4149) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"), new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 15, 11, 37, 38, 172, DateTimeKind.Local).AddTicks(4163), new DateTime(2024, 10, 15, 11, 37, 38, 172, DateTimeKind.Local).AddTicks(4164) });

            migrationBuilder.UpdateData(
                table: "trTask",
                keyColumn: "Id",
                keyValue: new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 15, 11, 37, 38, 172, DateTimeKind.Local).AddTicks(2122), new DateTime(2024, 10, 15, 11, 37, 38, 172, DateTimeKind.Local).AddTicks(2127) });

            migrationBuilder.UpdateData(
                table: "trTask",
                keyColumn: "Id",
                keyValue: new Guid("4422cc3c-0ea5-4d73-a31e-a42485a81003"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 15, 11, 37, 38, 172, DateTimeKind.Local).AddTicks(2213), new DateTime(2024, 10, 15, 11, 37, 38, 172, DateTimeKind.Local).AddTicks(2214) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("1a157bf0-4748-4589-91cc-1450e0c06596"), new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 15, 11, 37, 38, 172, DateTimeKind.Local).AddTicks(2987), new DateTime(2024, 10, 15, 11, 37, 38, 172, DateTimeKind.Local).AddTicks(2991) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5"), new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 15, 11, 37, 38, 172, DateTimeKind.Local).AddTicks(3008), new DateTime(2024, 10, 15, 11, 37, 38, 172, DateTimeKind.Local).AddTicks(3009) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911"), new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 15, 11, 37, 38, 172, DateTimeKind.Local).AddTicks(3012), new DateTime(2024, 10, 15, 11, 37, 38, 172, DateTimeKind.Local).AddTicks(3013) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496"), new Guid("4422cc3c-0ea5-4d73-a31e-a42485a81003") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 10, 15, 11, 37, 38, 172, DateTimeKind.Local).AddTicks(3015), new DateTime(2024, 10, 15, 11, 37, 38, 172, DateTimeKind.Local).AddTicks(3016) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("bd69a88e-d6c1-42a1-8a3a-628843459909"));

            migrationBuilder.DeleteData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("c01c5086-cfa5-44ca-89d7-baa2c1accea6"));

            migrationBuilder.DeleteData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("d6016437-8b0f-4b0e-8175-5a11ffc480f5"));

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "trSchedulePlan");

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
    }
}
