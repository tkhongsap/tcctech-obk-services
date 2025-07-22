using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace TCCTOBK.OperationBackend.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class UpdateTypeAndIdx : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_trCaseTasks_CaseId",
                table: "trCaseTasks");

            migrationBuilder.DeleteData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("4199e4de-bdf8-48f8-a8a8-a5b31756a748"));

            migrationBuilder.DeleteData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("18a79217-9fa7-460d-bccc-e74285b07531"));

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

            migrationBuilder.DeleteData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("f2cf879b-34f3-41da-9445-ee3bc590f224"));

            migrationBuilder.DeleteData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("fcddbf6b-88b8-4fae-ade7-63150ce1f1ec"));

            migrationBuilder.DeleteData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("caa4ebec-15c8-4d6b-9985-6d6b66f94e63"));

            migrationBuilder.AlterColumn<string>(
                name: "WorkOfflineBy",
                table: "trCWOs",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "TechnicianAssignedBy",
                table: "trCWOs",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "TaskCompletionConfirmedBy",
                table: "trCWOs",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "SupervisorAssignedBy",
                table: "trCWOs",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "ReworkRequestedBy",
                table: "trCWOs",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "ResumedBy",
                table: "trCWOs",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "PausedBy",
                table: "trCWOs",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "ModifiedBy",
                table: "trCWOs",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "CreatedBy",
                table: "trCWOs",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "CompletionVerifiedBy",
                table: "trCWOs",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "CompletionAckedBy",
                table: "trCWOs",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "CompletedBy",
                table: "trCWOs",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "ClosedBy",
                table: "trCWOs",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "ClientVerificationSubmittedBy",
                table: "trCWOs",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "AcknowledgementVerifiedBy",
                table: "trCWOs",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "AckedBy",
                table: "trCWOs",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "ModifiedBy",
                table: "trCaseTasks",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "CreatedBy",
                table: "trCaseTasks",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "ModifiedBy",
                table: "trCases",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "LocationName",
                table: "trCases",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(100)",
                oldMaxLength: 100,
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_trCWOs_StatusId",
                table: "trCWOs",
                column: "StatusId");

            migrationBuilder.CreateIndex(
                name: "IX_trCWOs_SupervisorId",
                table: "trCWOs",
                column: "SupervisorId");

            migrationBuilder.CreateIndex(
                name: "IX_trCWOs_TechnicianId",
                table: "trCWOs",
                column: "TechnicianId");

            migrationBuilder.CreateIndex(
                name: "IX_trCaseTasks_AssignedStaffId",
                table: "trCaseTasks",
                column: "AssignedStaffId");

            migrationBuilder.CreateIndex(
                name: "IX_trCaseTasks_CaseId_AssignedStaffId",
                table: "trCaseTasks",
                columns: new[] { "CaseId", "AssignedStaffId" });

            migrationBuilder.CreateIndex(
                name: "IX_trCaseTasks_StatusCode",
                table: "trCaseTasks",
                column: "StatusCode");

            migrationBuilder.CreateIndex(
                name: "IX_trCases_CaseNo",
                table: "trCases",
                column: "CaseNo");

            migrationBuilder.CreateIndex(
                name: "IX_trCases_CreatedOn",
                table: "trCases",
                column: "CreatedOn",
                descending: new bool[0]);

            migrationBuilder.CreateIndex(
                name: "IX_trCases_CreatedOn_Id",
                table: "trCases",
                columns: new[] { "CreatedOn", "Id" },
                descending: new[] { true, false });

            migrationBuilder.CreateIndex(
                name: "IX_trCases_StatusCode",
                table: "trCases",
                column: "StatusCode");

            migrationBuilder.CreateIndex(
                name: "IX_trCases_SyncStatus",
                table: "trCases",
                column: "SyncStatus");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_trCWOs_StatusId",
                table: "trCWOs");

            migrationBuilder.DropIndex(
                name: "IX_trCWOs_SupervisorId",
                table: "trCWOs");

            migrationBuilder.DropIndex(
                name: "IX_trCWOs_TechnicianId",
                table: "trCWOs");

            migrationBuilder.DropIndex(
                name: "IX_trCaseTasks_AssignedStaffId",
                table: "trCaseTasks");

            migrationBuilder.DropIndex(
                name: "IX_trCaseTasks_CaseId_AssignedStaffId",
                table: "trCaseTasks");

            migrationBuilder.DropIndex(
                name: "IX_trCaseTasks_StatusCode",
                table: "trCaseTasks");

            migrationBuilder.DropIndex(
                name: "IX_trCases_CaseNo",
                table: "trCases");

            migrationBuilder.DropIndex(
                name: "IX_trCases_CreatedOn",
                table: "trCases");

            migrationBuilder.DropIndex(
                name: "IX_trCases_CreatedOn_Id",
                table: "trCases");

            migrationBuilder.DropIndex(
                name: "IX_trCases_StatusCode",
                table: "trCases");

            migrationBuilder.DropIndex(
                name: "IX_trCases_SyncStatus",
                table: "trCases");

            migrationBuilder.AlterColumn<string>(
                name: "WorkOfflineBy",
                table: "trCWOs",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(100)",
                oldMaxLength: 100,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "TechnicianAssignedBy",
                table: "trCWOs",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(100)",
                oldMaxLength: 100,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "TaskCompletionConfirmedBy",
                table: "trCWOs",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(100)",
                oldMaxLength: 100,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "SupervisorAssignedBy",
                table: "trCWOs",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(100)",
                oldMaxLength: 100,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "ReworkRequestedBy",
                table: "trCWOs",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(100)",
                oldMaxLength: 100,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "ResumedBy",
                table: "trCWOs",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(100)",
                oldMaxLength: 100,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "PausedBy",
                table: "trCWOs",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(100)",
                oldMaxLength: 100,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "ModifiedBy",
                table: "trCWOs",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(100)",
                oldMaxLength: 100,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "CreatedBy",
                table: "trCWOs",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(100)",
                oldMaxLength: 100,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "CompletionVerifiedBy",
                table: "trCWOs",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(100)",
                oldMaxLength: 100,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "CompletionAckedBy",
                table: "trCWOs",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(100)",
                oldMaxLength: 100,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "CompletedBy",
                table: "trCWOs",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(100)",
                oldMaxLength: 100,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "ClosedBy",
                table: "trCWOs",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(100)",
                oldMaxLength: 100,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "ClientVerificationSubmittedBy",
                table: "trCWOs",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(100)",
                oldMaxLength: 100,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "AcknowledgementVerifiedBy",
                table: "trCWOs",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(100)",
                oldMaxLength: 100,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "AckedBy",
                table: "trCWOs",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(100)",
                oldMaxLength: 100,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "ModifiedBy",
                table: "trCaseTasks",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(100)",
                oldMaxLength: 100,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "CreatedBy",
                table: "trCaseTasks",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(100)",
                oldMaxLength: 100,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "ModifiedBy",
                table: "trCases",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(100)",
                oldMaxLength: 100,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "LocationName",
                table: "trCases",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.InsertData(
                table: "Tenant",
                columns: new[] { "TID", "CreatedBy", "CreatedByName", "CreatedDate", "IsActive", "Name", "UpdatedBy", "UpdatedByName", "UpdatedDate", "description" },
                values: new object[,]
                {
                    { new Guid("4199e4de-bdf8-48f8-a8a8-a5b31756a748"), "00000000-0000-0000-0000-000000000000", "System", new DateTime(2025, 1, 28, 16, 33, 47, 107, DateTimeKind.Local).AddTicks(9330), true, "OBK CMS", "00000000-0000-0000-0000-000000000000", "System", new DateTime(2025, 1, 28, 16, 33, 47, 124, DateTimeKind.Local).AddTicks(4330), "One bangkok CMS" },
                    { new Guid("caa4ebec-15c8-4d6b-9985-6d6b66f94e63"), "00000000-0000-0000-0000-000000000000", "System", new DateTime(2025, 1, 28, 16, 33, 47, 124, DateTimeKind.Local).AddTicks(4560), true, "Operation app", "00000000-0000-0000-0000-000000000000", "System", new DateTime(2025, 1, 28, 16, 33, 47, 124, DateTimeKind.Local).AddTicks(4560), "Operation app" }
                });

            migrationBuilder.InsertData(
                table: "trRole",
                columns: new[] { "RID", "CreatedBy", "CreatedByName", "CreatedDate", "Description", "IsActive", "IsDelete", "Name", "TID", "UpdatedBy", "UpdatedByName", "UpdatedDate" },
                values: new object[,]
                {
                    { new Guid("18a79217-9fa7-460d-bccc-e74285b07531"), "00000000-0000-0000-0000-000000000000", "System", new DateTime(2025, 1, 28, 16, 33, 47, 125, DateTimeKind.Local).AddTicks(5320), "Cleaning", true, false, "Cleaning", new Guid("caa4ebec-15c8-4d6b-9985-6d6b66f94e63"), "00000000-0000-0000-0000-000000000000", "System", new DateTime(2025, 1, 28, 16, 33, 47, 125, DateTimeKind.Local).AddTicks(5320) },
                    { new Guid("bd69a88e-d6c1-42a1-8a3a-628843459909"), "00000000-0000-0000-0000-000000000000", "System", new DateTime(2025, 1, 28, 16, 33, 47, 125, DateTimeKind.Local).AddTicks(5330), "SOC manager", true, false, "SOC manager", new Guid("caa4ebec-15c8-4d6b-9985-6d6b66f94e63"), "00000000-0000-0000-0000-000000000000", "System", new DateTime(2025, 1, 28, 16, 33, 47, 125, DateTimeKind.Local).AddTicks(5330) },
                    { new Guid("c01c5086-cfa5-44ca-89d7-baa2c1accea6"), "00000000-0000-0000-0000-000000000000", "System", new DateTime(2025, 1, 28, 16, 33, 47, 125, DateTimeKind.Local).AddTicks(5320), "FMC manager", true, false, "FMC manager", new Guid("caa4ebec-15c8-4d6b-9985-6d6b66f94e63"), "00000000-0000-0000-0000-000000000000", "System", new DateTime(2025, 1, 28, 16, 33, 47, 125, DateTimeKind.Local).AddTicks(5330) },
                    { new Guid("d6016437-8b0f-4b0e-8175-5a11ffc480f5"), "00000000-0000-0000-0000-000000000000", "System", new DateTime(2025, 1, 28, 16, 33, 47, 125, DateTimeKind.Local).AddTicks(5320), "Dcc", true, false, "Dcc", new Guid("caa4ebec-15c8-4d6b-9985-6d6b66f94e63"), "00000000-0000-0000-0000-000000000000", "System", new DateTime(2025, 1, 28, 16, 33, 47, 125, DateTimeKind.Local).AddTicks(5320) },
                    { new Guid("f2cf879b-34f3-41da-9445-ee3bc590f224"), "00000000-0000-0000-0000-000000000000", "System", new DateTime(2025, 1, 28, 16, 33, 47, 125, DateTimeKind.Local).AddTicks(5320), "Supervisor", true, false, "Supervisor", new Guid("caa4ebec-15c8-4d6b-9985-6d6b66f94e63"), "00000000-0000-0000-0000-000000000000", "System", new DateTime(2025, 1, 28, 16, 33, 47, 125, DateTimeKind.Local).AddTicks(5320) },
                    { new Guid("fcddbf6b-88b8-4fae-ade7-63150ce1f1ec"), "00000000-0000-0000-0000-000000000000", "System", new DateTime(2025, 1, 28, 16, 33, 47, 125, DateTimeKind.Local).AddTicks(5310), "Technician", true, false, "Technician", new Guid("caa4ebec-15c8-4d6b-9985-6d6b66f94e63"), "00000000-0000-0000-0000-000000000000", "System", new DateTime(2025, 1, 28, 16, 33, 47, 125, DateTimeKind.Local).AddTicks(5310) }
                });

            migrationBuilder.CreateIndex(
                name: "IX_trCaseTasks_CaseId",
                table: "trCaseTasks",
                column: "CaseId");
        }
    }
}
