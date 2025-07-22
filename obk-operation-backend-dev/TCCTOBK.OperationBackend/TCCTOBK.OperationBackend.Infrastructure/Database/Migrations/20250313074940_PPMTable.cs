using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TCCTOBK.OperationBackend.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class PPMTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "trPPMs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false),
                    CSID = table.Column<Guid>(type: "uuid", nullable: false, defaultValue: new Guid("3075169a-bb4c-463f-a602-dac99228ceac")),
                    Name = table.Column<string>(type: "text", nullable: true),
                    MWOId = table.Column<int>(type: "integer", nullable: true),
                    LocationId = table.Column<int>(type: "integer", nullable: true),
                    ChecklistId = table.Column<int>(type: "integer", nullable: true),
                    ServiceCategoryId = table.Column<int>(type: "integer", nullable: true),
                    ServiceProviderId = table.Column<int>(type: "integer", nullable: true),
                    ServicingGroupId = table.Column<int>(type: "integer", nullable: true),
                    AckedBy = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    AckedOn = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    EstimatedTotalDuration = table.Column<int>(type: "integer", nullable: true),
                    TargetStart = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    TargetCompletion = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    ActualStart = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    ActualCompletion = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    CompletedBy = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    CompletionComment = table.Column<string>(type: "text", nullable: true),
                    CompletionVerifiedBy = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    FrequencyTypeId = table.Column<int>(type: "integer", nullable: true),
                    StatusId = table.Column<int>(type: "integer", nullable: true),
                    CreatedBy = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    CreatedOn = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    ModifiedOn = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: true),
                    ClosedOn = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    ClosedBy = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    ClosureComment = table.Column<string>(type: "text", nullable: true),
                    IsReworkRequested = table.Column<bool>(type: "boolean", nullable: true),
                    SupervisorId = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    SupervisorAssignedBy = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    SupervisorAssignedOn = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    IsTechniciansAssigned = table.Column<bool>(type: "boolean", nullable: true),
                    TechniciansAssignedBy = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    TechniciansAssignedOn = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    IsCancelled = table.Column<bool>(type: "boolean", nullable: true),
                    WorkflowId = table.Column<int>(type: "integer", nullable: true),
                    IsAdhoc = table.Column<bool>(type: "boolean", nullable: true),
                    IsPrevSupervisorRejected = table.Column<bool>(type: "boolean", nullable: true),
                    IsPrevTechnicianRejected = table.Column<bool>(type: "boolean", nullable: true),
                    ClientVerifiedBy = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    ClientVerificationComment = table.Column<string>(type: "text", nullable: true),
                    ClientVerificationSubmittedBy = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    ClientVerificationSubmittedOn = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    AcknowledgementSignature = table.Column<string>(type: "text", nullable: true),
                    CompletionSignature = table.Column<string>(type: "text", nullable: true),
                    ClosureSignature = table.Column<string>(type: "text", nullable: true),
                    ClientVerificationSignature = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_trPPMs", x => new { x.CSID, x.Id });
                });

            migrationBuilder.UpdateData(
                table: "Location",
                keyColumn: "LID",
                keyValue: new Guid("2c055101-2271-44e0-95fe-bcf2c59a459a"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 3, 13, 14, 49, 38, 533, DateTimeKind.Local).AddTicks(7612), new DateTime(2025, 3, 13, 14, 49, 38, 533, DateTimeKind.Local).AddTicks(7616) });

            migrationBuilder.CreateIndex(
                name: "IX_trPPMs_StatusId",
                table: "trPPMs",
                column: "StatusId");

            migrationBuilder.CreateIndex(
                name: "IX_trPPMs_SupervisorId",
                table: "trPPMs",
                column: "SupervisorId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "trPPMs");

            migrationBuilder.UpdateData(
                table: "Location",
                keyColumn: "LID",
                keyValue: new Guid("2c055101-2271-44e0-95fe-bcf2c59a459a"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 3, 12, 17, 12, 14, 194, DateTimeKind.Local).AddTicks(6550), new DateTime(2025, 3, 12, 17, 12, 14, 194, DateTimeKind.Local).AddTicks(6550) });
        }
    }
}
