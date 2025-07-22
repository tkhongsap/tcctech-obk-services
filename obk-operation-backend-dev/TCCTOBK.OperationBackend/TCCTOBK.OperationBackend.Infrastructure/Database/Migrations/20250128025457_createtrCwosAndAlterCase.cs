using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace TCCTOBK.OperationBackend.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class createtrCwosAndAlterCase : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ModifiedBy",
                table: "trCases",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ModifiedOn",
                table: "trCases",
                type: "timestamp without time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Requester",
                table: "trCases",
                type: "text",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "trCWOs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    CwoTypeId = table.Column<int>(type: "integer", nullable: false),
                    ProblemTypeId = table.Column<int>(type: "integer", nullable: false),
                    PriorityId = table.Column<int>(type: "integer", nullable: false),
                    ServiceCategoryId = table.Column<int>(type: "integer", nullable: false),
                    LocationId = table.Column<int>(type: "integer", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    CreatedBy = table.Column<string>(type: "text", nullable: true),
                    CreatedOn = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    ModifiedBy = table.Column<string>(type: "text", nullable: true),
                    ModifiedOn = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    RequesterId = table.Column<int>(type: "integer", nullable: true),
                    RequestedOn = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: true),
                    StatusId = table.Column<int>(type: "integer", nullable: true),
                    AssetId = table.Column<int>(type: "integer", nullable: true),
                    AckedOn = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    AckedBy = table.Column<string>(type: "text", nullable: true),
                    SlaStartDateTime = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    SlatoResolve = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    SlatoRespond = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    EstimatedTotalDuration = table.Column<int>(type: "integer", nullable: true),
                    EstimatedCompletion = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    SupervisorId = table.Column<string>(type: "text", nullable: true),
                    SupervisorAssignedOn = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    SupervisorAssignedBy = table.Column<string>(type: "text", nullable: true),
                    TechnicianId = table.Column<string>(type: "text", nullable: true),
                    TechnicianAssignedOn = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    TechnicianAssignedBy = table.Column<string>(type: "text", nullable: true),
                    OperatorNote = table.Column<string>(type: "text", nullable: true),
                    ActualStartDateTime = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    ActualCompletionDateTime = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    CompletedBy = table.Column<string>(type: "text", nullable: true),
                    ClosedOn = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    ClosedBy = table.Column<string>(type: "text", nullable: true),
                    IsTaskCompletionConfirmed = table.Column<bool>(type: "boolean", nullable: true),
                    TaskCompletionConfirmedBy = table.Column<string>(type: "text", nullable: true),
                    TaskCompletionConfirmedOn = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    IsCancelled = table.Column<bool>(type: "boolean", nullable: true),
                    ServiceProviderId = table.Column<int>(type: "integer", nullable: true),
                    CompletionComment = table.Column<string>(type: "text", nullable: true),
                    ClosureComment = table.Column<string>(type: "text", nullable: true),
                    SlaTriggerPoint = table.Column<int>(type: "integer", nullable: true),
                    IsReworkRequested = table.Column<bool>(type: "boolean", nullable: true),
                    ReworkRequestedBy = table.Column<string>(type: "text", nullable: true),
                    ReworkRequestedOn = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    ReasonToRework = table.Column<string>(type: "text", nullable: true),
                    IsPrevSupervisorRejected = table.Column<bool>(type: "boolean", nullable: true),
                    PrevRejectedSupervisorId = table.Column<string>(type: "text", nullable: true),
                    IsPrevTechnicianRejected = table.Column<bool>(type: "boolean", nullable: true),
                    PrevRejectedTechnicianId = table.Column<string>(type: "text", nullable: true),
                    AcknowledgementVerifiedBy = table.Column<string>(type: "text", nullable: true),
                    CompletionAckedBy = table.Column<string>(type: "text", nullable: true),
                    CompletionVerifiedBy = table.Column<string>(type: "text", nullable: true),
                    ClientVerificationSubmittedBy = table.Column<string>(type: "text", nullable: true),
                    ClientVerificationSubmittedOn = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    ClientVerificationComment = table.Column<string>(type: "text", nullable: true),
                    ClientVerifiedUser = table.Column<string>(type: "text", nullable: true),
                    IsWorkingOffline = table.Column<bool>(type: "boolean", nullable: true),
                    WorkOfflineOn = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    WorkOfflineBy = table.Column<string>(type: "text", nullable: true),
                    IsPaused = table.Column<bool>(type: "boolean", nullable: true),
                    PausedBy = table.Column<string>(type: "text", nullable: true),
                    PausedOn = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    PausedReason = table.Column<string>(type: "text", nullable: true),
                    ResumedBy = table.Column<string>(type: "text", nullable: true),
                    ResumedOn = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    AcknowledgementSignature = table.Column<string>(type: "text", nullable: true),
                    CompletionSignature = table.Column<string>(type: "text", nullable: true),
                    ClosureSignature = table.Column<string>(type: "text", nullable: true),
                    ClientVerificationSignature = table.Column<string>(type: "text", nullable: true),
                    IsSynced = table.Column<bool>(type: "boolean", nullable: true),
                    ParentId = table.Column<int>(type: "integer", nullable: true),
                    SyncStatus = table.Column<int>(type: "integer", nullable: false),
                    SyncUtcTs = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_trCWOs", x => x.Id);
                });

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("4199e4de-bdf8-48f8-a8a8-a5b31756a748"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 1, 28, 9, 54, 55, 506, DateTimeKind.Local).AddTicks(1802), new DateTime(2025, 1, 28, 9, 54, 55, 507, DateTimeKind.Local).AddTicks(1060) });

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("caa4ebec-15c8-4d6b-9985-6d6b66f94e63"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 1, 28, 9, 54, 55, 507, DateTimeKind.Local).AddTicks(1564), new DateTime(2025, 1, 28, 9, 54, 55, 507, DateTimeKind.Local).AddTicks(1567) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("18a79217-9fa7-460d-bccc-e74285b07531"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 1, 28, 9, 54, 55, 509, DateTimeKind.Local).AddTicks(2430), new DateTime(2025, 1, 28, 9, 54, 55, 509, DateTimeKind.Local).AddTicks(2431) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("bd69a88e-d6c1-42a1-8a3a-628843459909"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 1, 28, 9, 54, 55, 509, DateTimeKind.Local).AddTicks(2478), new DateTime(2025, 1, 28, 9, 54, 55, 509, DateTimeKind.Local).AddTicks(2479) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("c01c5086-cfa5-44ca-89d7-baa2c1accea6"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 1, 28, 9, 54, 55, 509, DateTimeKind.Local).AddTicks(2475), new DateTime(2025, 1, 28, 9, 54, 55, 509, DateTimeKind.Local).AddTicks(2476) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("d6016437-8b0f-4b0e-8175-5a11ffc480f5"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 1, 28, 9, 54, 55, 509, DateTimeKind.Local).AddTicks(2439), new DateTime(2025, 1, 28, 9, 54, 55, 509, DateTimeKind.Local).AddTicks(2440) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("f2cf879b-34f3-41da-9445-ee3bc590f224"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 1, 28, 9, 54, 55, 509, DateTimeKind.Local).AddTicks(2433), new DateTime(2025, 1, 28, 9, 54, 55, 509, DateTimeKind.Local).AddTicks(2434) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("fcddbf6b-88b8-4fae-ade7-63150ce1f1ec"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 1, 28, 9, 54, 55, 509, DateTimeKind.Local).AddTicks(2407), new DateTime(2025, 1, 28, 9, 54, 55, 509, DateTimeKind.Local).AddTicks(2422) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "trCWOs");

            migrationBuilder.DropColumn(
                name: "ModifiedBy",
                table: "trCases");

            migrationBuilder.DropColumn(
                name: "ModifiedOn",
                table: "trCases");

            migrationBuilder.DropColumn(
                name: "Requester",
                table: "trCases");

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("4199e4de-bdf8-48f8-a8a8-a5b31756a748"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 1, 22, 7, 44, 56, 416, DateTimeKind.Local).AddTicks(3500), new DateTime(2025, 1, 22, 7, 44, 56, 439, DateTimeKind.Local).AddTicks(8750) });

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("caa4ebec-15c8-4d6b-9985-6d6b66f94e63"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 1, 22, 7, 44, 56, 439, DateTimeKind.Local).AddTicks(8980), new DateTime(2025, 1, 22, 7, 44, 56, 439, DateTimeKind.Local).AddTicks(8990) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("18a79217-9fa7-460d-bccc-e74285b07531"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 1, 22, 7, 44, 56, 440, DateTimeKind.Local).AddTicks(9510), new DateTime(2025, 1, 22, 7, 44, 56, 440, DateTimeKind.Local).AddTicks(9510) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("bd69a88e-d6c1-42a1-8a3a-628843459909"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 1, 22, 7, 44, 56, 440, DateTimeKind.Local).AddTicks(9520), new DateTime(2025, 1, 22, 7, 44, 56, 440, DateTimeKind.Local).AddTicks(9520) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("c01c5086-cfa5-44ca-89d7-baa2c1accea6"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 1, 22, 7, 44, 56, 440, DateTimeKind.Local).AddTicks(9520), new DateTime(2025, 1, 22, 7, 44, 56, 440, DateTimeKind.Local).AddTicks(9520) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("d6016437-8b0f-4b0e-8175-5a11ffc480f5"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 1, 22, 7, 44, 56, 440, DateTimeKind.Local).AddTicks(9520), new DateTime(2025, 1, 22, 7, 44, 56, 440, DateTimeKind.Local).AddTicks(9520) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("f2cf879b-34f3-41da-9445-ee3bc590f224"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 1, 22, 7, 44, 56, 440, DateTimeKind.Local).AddTicks(9510), new DateTime(2025, 1, 22, 7, 44, 56, 440, DateTimeKind.Local).AddTicks(9520) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("fcddbf6b-88b8-4fae-ade7-63150ce1f1ec"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 1, 22, 7, 44, 56, 440, DateTimeKind.Local).AddTicks(9510), new DateTime(2025, 1, 22, 7, 44, 56, 440, DateTimeKind.Local).AddTicks(9510) });
        }
    }
}
