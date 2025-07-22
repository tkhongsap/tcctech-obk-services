using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TCCTOBK.OperationBackend.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class marcomSurvey : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "trMarcomSurvey",
                columns: table => new
                {
                    MSID = table.Column<Guid>(type: "uuid", nullable: false),
                    FormDate = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    ToDate = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    Duration = table.Column<int>(type: "integer", nullable: false),
                    DurationUnit = table.Column<string>(type: "text", nullable: true),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    Title = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "character varying", maxLength: 500, nullable: true),
                    BannerImage = table.Column<string>(type: "text", nullable: true),
                    CreatedBy = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    CreatedByName = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "timestamp without time zone", maxLength: 100, nullable: false),
                    UpdatedBy = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    UpdatedByName = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "timestamp without time zone", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_trMarcomSurvey", x => x.MSID);
                });

            migrationBuilder.CreateTable(
                name: "trMarcomSurveyQuestionType",
                columns: table => new
                {
                    MSQID = table.Column<Guid>(type: "uuid", nullable: false),
                    Type = table.Column<int>(type: "integer", nullable: false),
                    Title = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "character varying", maxLength: 500, nullable: true),
                    TypeConfig = table.Column<string>(type: "character varying", nullable: false),
                    CreatedBy = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    CreatedByName = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "timestamp without time zone", maxLength: 100, nullable: false),
                    UpdatedBy = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    UpdatedByName = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "timestamp without time zone", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_trMarcomSurveyQuestionType", x => x.MSQID);
                });

            migrationBuilder.CreateTable(
                name: "trMarcomSurveyAnswer",
                columns: table => new
                {
                    MSAID = table.Column<Guid>(type: "uuid", nullable: false),
                    MSID = table.Column<Guid>(type: "uuid", nullable: false),
                    SubmitDate = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: true),
                    UserName = table.Column<string>(type: "text", nullable: true),
                    trMarcomSurveyMSID = table.Column<Guid>(type: "uuid", nullable: true),
                    CreatedBy = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    CreatedByName = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "timestamp without time zone", maxLength: 100, nullable: false),
                    UpdatedBy = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    UpdatedByName = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "timestamp without time zone", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_trMarcomSurveyAnswer", x => x.MSAID);
                    table.ForeignKey(
                        name: "FK_trMarcomSurveyAnswer_trMarcomSurvey_trMarcomSurveyMSID",
                        column: x => x.trMarcomSurveyMSID,
                        principalTable: "trMarcomSurvey",
                        principalColumn: "MSID");
                });

            migrationBuilder.CreateTable(
                name: "trMarcomSurveySection",
                columns: table => new
                {
                    MSSID = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    Order = table.Column<int>(type: "integer", nullable: false),
                    BannerImage = table.Column<string>(type: "text", nullable: true),
                    trMarcomSurveyMSID = table.Column<Guid>(type: "uuid", nullable: true),
                    CreatedBy = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    CreatedByName = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "timestamp without time zone", maxLength: 100, nullable: false),
                    UpdatedBy = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    UpdatedByName = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "timestamp without time zone", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_trMarcomSurveySection", x => x.MSSID);
                    table.ForeignKey(
                        name: "FK_trMarcomSurveySection_trMarcomSurvey_trMarcomSurveyMSID",
                        column: x => x.trMarcomSurveyMSID,
                        principalTable: "trMarcomSurvey",
                        principalColumn: "MSID");
                });

            migrationBuilder.CreateTable(
                name: "trMarcomSurveyAnswerDetail",
                columns: table => new
                {
                    MSADID = table.Column<Guid>(type: "uuid", nullable: false),
                    MSAID = table.Column<Guid>(type: "uuid", nullable: false),
                    trMarcomSurveyAnswerMSAID = table.Column<Guid>(type: "uuid", nullable: true),
                    CreatedBy = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    CreatedByName = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "timestamp without time zone", maxLength: 100, nullable: false),
                    UpdatedBy = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    UpdatedByName = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "timestamp without time zone", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_trMarcomSurveyAnswerDetail", x => x.MSADID);
                    table.ForeignKey(
                        name: "FK_trMarcomSurveyAnswerDetail_trMarcomSurveyAnswer_trMarcomSur~",
                        column: x => x.trMarcomSurveyAnswerMSAID,
                        principalTable: "trMarcomSurveyAnswer",
                        principalColumn: "MSAID");
                });

            migrationBuilder.CreateTable(
                name: "trMarcomSurveyQuestion",
                columns: table => new
                {
                    MSQID = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    MSQTID = table.Column<Guid>(type: "uuid", nullable: false),
                    DataJson = table.Column<string>(type: "text", nullable: false),
                    trMarcomSurveySectionMSSID = table.Column<Guid>(type: "uuid", nullable: true),
                    CreatedBy = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    CreatedByName = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "timestamp without time zone", maxLength: 100, nullable: false),
                    UpdatedBy = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    UpdatedByName = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "timestamp without time zone", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_trMarcomSurveyQuestion", x => x.MSQID);
                    table.ForeignKey(
                        name: "FK_trMarcomSurveyQuestion_trMarcomSurveyQuestionType_MSQTID",
                        column: x => x.MSQTID,
                        principalTable: "trMarcomSurveyQuestionType",
                        principalColumn: "MSQID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_trMarcomSurveyQuestion_trMarcomSurveySection_trMarcomSurvey~",
                        column: x => x.trMarcomSurveySectionMSSID,
                        principalTable: "trMarcomSurveySection",
                        principalColumn: "MSSID");
                });

            migrationBuilder.CreateTable(
                name: "trMarcomSurveyQuestionSection",
                columns: table => new
                {
                    MSQID = table.Column<Guid>(type: "uuid", nullable: false),
                    MSSID = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_trMarcomSurveyQuestionSection", x => new { x.MSQID, x.MSSID });
                    table.ForeignKey(
                        name: "FK_trMarcomSurveyQuestionSection_trMarcomSurveyQuestion_MSQID",
                        column: x => x.MSQID,
                        principalTable: "trMarcomSurveyQuestion",
                        principalColumn: "MSQID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_trMarcomSurveyQuestionSection_trMarcomSurveySection_MSSID",
                        column: x => x.MSSID,
                        principalTable: "trMarcomSurveySection",
                        principalColumn: "MSSID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.UpdateData(
                table: "Location",
                keyColumn: "LID",
                keyValue: new Guid("2c055101-2271-44e0-95fe-bcf2c59a459a"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 6, 4, 13, 59, 22, 683, DateTimeKind.Local).AddTicks(6110), new DateTime(2025, 6, 4, 13, 59, 22, 683, DateTimeKind.Local).AddTicks(6110) });

            migrationBuilder.CreateIndex(
                name: "IX_trMarcomSurveyAnswer_trMarcomSurveyMSID",
                table: "trMarcomSurveyAnswer",
                column: "trMarcomSurveyMSID");

            migrationBuilder.CreateIndex(
                name: "IX_trMarcomSurveyAnswerDetail_trMarcomSurveyAnswerMSAID",
                table: "trMarcomSurveyAnswerDetail",
                column: "trMarcomSurveyAnswerMSAID");

            migrationBuilder.CreateIndex(
                name: "IX_trMarcomSurveyQuestion_MSQTID",
                table: "trMarcomSurveyQuestion",
                column: "MSQTID");

            migrationBuilder.CreateIndex(
                name: "IX_trMarcomSurveyQuestion_trMarcomSurveySectionMSSID",
                table: "trMarcomSurveyQuestion",
                column: "trMarcomSurveySectionMSSID");

            migrationBuilder.CreateIndex(
                name: "IX_trMarcomSurveyQuestionSection_MSSID",
                table: "trMarcomSurveyQuestionSection",
                column: "MSSID");

            migrationBuilder.CreateIndex(
                name: "IX_trMarcomSurveySection_trMarcomSurveyMSID",
                table: "trMarcomSurveySection",
                column: "trMarcomSurveyMSID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "trMarcomSurveyAnswerDetail");

            migrationBuilder.DropTable(
                name: "trMarcomSurveyQuestionSection");

            migrationBuilder.DropTable(
                name: "trMarcomSurveyAnswer");

            migrationBuilder.DropTable(
                name: "trMarcomSurveyQuestion");

            migrationBuilder.DropTable(
                name: "trMarcomSurveyQuestionType");

            migrationBuilder.DropTable(
                name: "trMarcomSurveySection");

            migrationBuilder.DropTable(
                name: "trMarcomSurvey");

            migrationBuilder.UpdateData(
                table: "Location",
                keyColumn: "LID",
                keyValue: new Guid("2c055101-2271-44e0-95fe-bcf2c59a459a"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2025, 4, 2, 14, 55, 11, 127, DateTimeKind.Local).AddTicks(1440), new DateTime(2025, 4, 2, 14, 55, 11, 127, DateTimeKind.Local).AddTicks(1440) });
        }
    }
}
