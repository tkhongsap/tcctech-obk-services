using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TCCTOBK.OperationBackend.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class AddTableMarcom : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "trMarcomCMSExplore",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Order = table.Column<int>(type: "integer", nullable: false),
                    IsShowRelatedLink = table.Column<bool>(type: "boolean", nullable: false),
                    TitleRelatedEN = table.Column<string>(type: "character varying", maxLength: 200, nullable: true),
                    TitleRelatedTH = table.Column<string>(type: "character varying", maxLength: 200, nullable: true),
                    TitleRelatedCN = table.Column<string>(type: "character varying", maxLength: 200, nullable: true),
                    SubTitleRelatedEN = table.Column<string>(type: "character varying", maxLength: 200, nullable: true),
                    SubTitleRelatedTH = table.Column<string>(type: "character varying", maxLength: 200, nullable: true),
                    SubTitleRelatedCN = table.Column<string>(type: "character varying", maxLength: 200, nullable: true),
                    TitleEn = table.Column<string>(type: "character varying", maxLength: 500, nullable: false),
                    TitleTH = table.Column<string>(type: "character varying", maxLength: 500, nullable: true),
                    TitleCN = table.Column<string>(type: "character varying", maxLength: 500, nullable: true),
                    CoverImageURLEN = table.Column<string>(type: "character varying", nullable: true),
                    CoverFileNameEN = table.Column<string>(type: "character varying", nullable: true),
                    CoverOriginalFileNameEN = table.Column<string>(type: "character varying", nullable: true),
                    CoverImageURLTH = table.Column<string>(type: "character varying", nullable: true),
                    CoverFileNameTH = table.Column<string>(type: "character varying", nullable: true),
                    CoverOriginalFileNameTH = table.Column<string>(type: "character varying", nullable: true),
                    CoverImageURLCN = table.Column<string>(type: "character varying", nullable: true),
                    CoverFileNameCN = table.Column<string>(type: "character varying", nullable: true),
                    CoverOriginalFileNameCN = table.Column<string>(type: "character varying", nullable: true),
                    HeadImageURLEN = table.Column<string>(type: "character varying", nullable: true),
                    HeadFileNameEN = table.Column<string>(type: "character varying", nullable: true),
                    HeadOriginalFileNameEN = table.Column<string>(type: "character varying", nullable: true),
                    HeadImageURLTH = table.Column<string>(type: "character varying", nullable: true),
                    HeadFileNameTH = table.Column<string>(type: "character varying", nullable: true),
                    HeadOriginalFileNameTH = table.Column<string>(type: "character varying", nullable: true),
                    HeadImageURLCN = table.Column<string>(type: "character varying", nullable: true),
                    HeadFileNameCN = table.Column<string>(type: "character varying", nullable: true),
                    HeadOriginalFileNameCN = table.Column<string>(type: "character varying", nullable: true),
                    IntroduceEN = table.Column<string>(type: "character varying", maxLength: 2000, nullable: true),
                    IntroduceTH = table.Column<string>(type: "character varying", maxLength: 2000, nullable: true),
                    IntroduceCN = table.Column<string>(type: "character varying", maxLength: 2000, nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    IsDelete = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedBy = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    CreatedByName = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "timestamp without time zone", maxLength: 100, nullable: false),
                    UpdatedBy = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    UpdatedByName = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "timestamp without time zone", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_trMarcomCMSExplore", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "trMarcomCMSExploreContent",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ContentId = table.Column<Guid>(type: "uuid", nullable: false),
                    Order = table.Column<int>(type: "integer", nullable: false),
                    Language = table.Column<string>(type: "character varying", nullable: false),
                    ContentType = table.Column<int>(type: "integer", nullable: false),
                    Text = table.Column<string>(type: "character varying", nullable: true),
                    ImageURL = table.Column<string>(type: "character varying", nullable: true),
                    FileName = table.Column<string>(type: "character varying", nullable: true),
                    OriginalFileName = table.Column<string>(type: "character varying", nullable: true),
                    YoutubeURL = table.Column<string>(type: "character varying", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    IsDelete = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedBy = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    CreatedByName = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "timestamp without time zone", maxLength: 100, nullable: false),
                    UpdatedBy = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    UpdatedByName = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "timestamp without time zone", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_trMarcomCMSExploreContent", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "trMarcomCMSTag",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ContentId = table.Column<Guid>(type: "uuid", nullable: false),
                    Order = table.Column<int>(type: "integer", nullable: false),
                    TagName = table.Column<string>(type: "character varying", maxLength: 500, nullable: false),
                    IsDelete = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedBy = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    CreatedByName = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "timestamp without time zone", maxLength: 100, nullable: false),
                    UpdatedBy = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    UpdatedByName = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "timestamp without time zone", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_trMarcomCMSTag", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "trMarcomCMSWhatHappenCategory",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Order = table.Column<int>(type: "integer", nullable: false),
                    IsArtAndCulture = table.Column<bool>(type: "boolean", nullable: false),
                    CategoryNameEn = table.Column<string>(type: "character varying", maxLength: 500, nullable: false),
                    CategoryNameTH = table.Column<string>(type: "character varying", maxLength: 500, nullable: true),
                    CategoryNameCN = table.Column<string>(type: "character varying", maxLength: 500, nullable: true),
                    IntroduceEN = table.Column<string>(type: "character varying", maxLength: 2000, nullable: true),
                    IntroduceTH = table.Column<string>(type: "character varying", maxLength: 2000, nullable: true),
                    IntroduceCN = table.Column<string>(type: "character varying", maxLength: 2000, nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    IsDelete = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedBy = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    CreatedByName = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "timestamp without time zone", maxLength: 100, nullable: false),
                    UpdatedBy = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    UpdatedByName = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "timestamp without time zone", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_trMarcomCMSWhatHappenCategory", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "trMarcomCMSWhatHappenContent",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    SubContentId = table.Column<Guid>(type: "uuid", nullable: false),
                    Order = table.Column<int>(type: "integer", nullable: false),
                    Language = table.Column<string>(type: "character varying", nullable: false),
                    ContentType = table.Column<int>(type: "integer", nullable: false),
                    Text = table.Column<string>(type: "character varying", nullable: true),
                    ImageURL = table.Column<string>(type: "character varying", nullable: true),
                    FileName = table.Column<string>(type: "character varying", nullable: true),
                    OriginalFileName = table.Column<string>(type: "character varying", nullable: true),
                    YoutubeURL = table.Column<string>(type: "character varying", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    IsDelete = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedBy = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    CreatedByName = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "timestamp without time zone", maxLength: 100, nullable: false),
                    UpdatedBy = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    UpdatedByName = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "timestamp without time zone", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_trMarcomCMSWhatHappenContent", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "trMarcomCMSWhatHappenSub",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CategoryId = table.Column<Guid>(type: "uuid", nullable: false),
                    Order = table.Column<int>(type: "integer", nullable: false),
                    OrderPin = table.Column<int>(type: "integer", nullable: true),
                    IsShowRelatedLink = table.Column<bool>(type: "boolean", nullable: false),
                    IsPin = table.Column<bool>(type: "boolean", nullable: false),
                    ShowTimeStartDate = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    ShowTimeEndDate = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    IsNotSpecify = table.Column<bool>(type: "boolean", nullable: false),
                    EventTimeStartDate = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    EventTimeEndDate = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    TypeLink = table.Column<int>(type: "integer", nullable: false),
                    DetailLink = table.Column<string>(type: "character varying", maxLength: 500, nullable: true),
                    TitleRelatedEN = table.Column<string>(type: "character varying", maxLength: 200, nullable: true),
                    TitleRelatedTH = table.Column<string>(type: "character varying", maxLength: 200, nullable: true),
                    TitleRelatedCN = table.Column<string>(type: "character varying", maxLength: 200, nullable: true),
                    SubTitleRelatedEN = table.Column<string>(type: "character varying", maxLength: 200, nullable: true),
                    SubTitleRelatedTH = table.Column<string>(type: "character varying", maxLength: 200, nullable: true),
                    SubTitleRelatedCN = table.Column<string>(type: "character varying", maxLength: 200, nullable: true),
                    TitleEn = table.Column<string>(type: "character varying", maxLength: 500, nullable: false),
                    TitleTH = table.Column<string>(type: "character varying", maxLength: 500, nullable: true),
                    TitleCN = table.Column<string>(type: "character varying", maxLength: 500, nullable: true),
                    CoverImageURLEN = table.Column<string>(type: "character varying", nullable: true),
                    CoverFileNameEN = table.Column<string>(type: "character varying", nullable: true),
                    CoverOriginalFileNameEN = table.Column<string>(type: "character varying", nullable: true),
                    CoverImageURLTH = table.Column<string>(type: "character varying", nullable: true),
                    CoverFileNameTH = table.Column<string>(type: "character varying", nullable: true),
                    CoverOriginalFileNameTH = table.Column<string>(type: "character varying", nullable: true),
                    CoverImageURLCN = table.Column<string>(type: "character varying", nullable: true),
                    CoverFileNameCN = table.Column<string>(type: "character varying", nullable: true),
                    CoverOriginalFileNameCN = table.Column<string>(type: "character varying", nullable: true),
                    IntroduceEN = table.Column<string>(type: "character varying", maxLength: 2000, nullable: true),
                    IntroduceTH = table.Column<string>(type: "character varying", maxLength: 2000, nullable: true),
                    IntroduceCN = table.Column<string>(type: "character varying", maxLength: 2000, nullable: true),
                    HeadImageURLEN = table.Column<string>(type: "character varying", nullable: true),
                    HeadFileNameEN = table.Column<string>(type: "character varying", nullable: true),
                    HeadOriginalFileNameEN = table.Column<string>(type: "character varying", nullable: true),
                    HeadImageURLTH = table.Column<string>(type: "character varying", nullable: true),
                    HeadFileNameTH = table.Column<string>(type: "character varying", nullable: true),
                    HeadOriginalFileNameTH = table.Column<string>(type: "character varying", nullable: true),
                    HeadImageURLCN = table.Column<string>(type: "character varying", nullable: true),
                    HeadFileNameCN = table.Column<string>(type: "character varying", nullable: true),
                    HeadOriginalFileNameCN = table.Column<string>(type: "character varying", nullable: true),
                    TextImageEN = table.Column<string>(type: "character varying", nullable: true),
                    TextImageTH = table.Column<string>(type: "text", nullable: true),
                    TextImageCN = table.Column<string>(type: "text", nullable: true),
                    LocationEN = table.Column<string>(type: "character varying", nullable: true),
                    LocationTH = table.Column<string>(type: "character varying", nullable: true),
                    LocationCN = table.Column<string>(type: "character varying", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    IsDelete = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedBy = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    CreatedByName = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "timestamp without time zone", maxLength: 100, nullable: false),
                    UpdatedBy = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    UpdatedByName = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "timestamp without time zone", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_trMarcomCMSWhatHappenSub", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "trMarcomConfig",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Type = table.Column<int>(type: "integer", nullable: false),
                    ValueInt = table.Column<int>(type: "integer", nullable: true),
                    ValueString = table.Column<string>(type: "character varying", maxLength: 250, nullable: true),
                    CreatedBy = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    CreatedByName = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "timestamp without time zone", maxLength: 100, nullable: false),
                    UpdatedBy = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    UpdatedByName = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "timestamp without time zone", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_trMarcomConfig", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "trMarcomPRBanner",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Order = table.Column<int>(type: "integer", nullable: false),
                    BannerName = table.Column<string>(type: "character varying", nullable: false),
                    StartDate = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    EndDate = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    IsNotSpecify = table.Column<bool>(type: "boolean", nullable: false),
                    Type = table.Column<int>(type: "integer", nullable: false),
                    IsImageEN = table.Column<bool>(type: "boolean", nullable: false),
                    IsImageTH = table.Column<bool>(type: "boolean", nullable: true),
                    IsImageCN = table.Column<bool>(type: "boolean", nullable: true),
                    ImageURLEN = table.Column<string>(type: "character varying", nullable: false),
                    FileNameEN = table.Column<string>(type: "character varying", nullable: false),
                    OriginalFileNameEN = table.Column<string>(type: "character varying", nullable: false),
                    ImageURLTH = table.Column<string>(type: "character varying", nullable: true),
                    FileNameTH = table.Column<string>(type: "character varying", nullable: true),
                    OriginalFileNameTH = table.Column<string>(type: "character varying", nullable: true),
                    ImageURLCN = table.Column<string>(type: "character varying", nullable: true),
                    FileNameCN = table.Column<string>(type: "character varying", nullable: true),
                    OriginalFileNameCN = table.Column<string>(type: "character varying", nullable: true),
                    LinkToURL = table.Column<string>(type: "character varying", nullable: true),
                    TextEN = table.Column<string>(type: "character varying", nullable: true),
                    TextTH = table.Column<string>(type: "character varying", nullable: true),
                    TextCN = table.Column<string>(type: "character varying", nullable: true),
                    IsShowRelatedLink = table.Column<bool>(type: "boolean", nullable: true),
                    HeaderImageURLEN = table.Column<string>(type: "character varying", nullable: true),
                    HeaderFileNameEN = table.Column<string>(type: "character varying", nullable: true),
                    HeaderOriginalFileNameEN = table.Column<string>(type: "character varying", nullable: true),
                    HeaderImageURLTH = table.Column<string>(type: "character varying", nullable: true),
                    HeaderFileNameTH = table.Column<string>(type: "character varying", nullable: true),
                    HeaderOriginalFileNameTH = table.Column<string>(type: "character varying", nullable: true),
                    HeaderImageURLCN = table.Column<string>(type: "character varying", nullable: true),
                    HeaderFileNameCN = table.Column<string>(type: "character varying", nullable: true),
                    HeaderOriginalFileNameCN = table.Column<string>(type: "character varying", nullable: true),
                    TitleEN = table.Column<string>(type: "character varying", nullable: true),
                    TitleTH = table.Column<string>(type: "character varying", nullable: true),
                    TitleCN = table.Column<string>(type: "character varying", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    IsDelete = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedBy = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    CreatedByName = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "timestamp without time zone", maxLength: 100, nullable: false),
                    UpdatedBy = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    UpdatedByName = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "timestamp without time zone", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_trMarcomPRBanner", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "trMarcomSpecialEvent",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Order = table.Column<int>(type: "integer", nullable: false),
                    ShowTimeStartDate = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    ShowTimeEndDate = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    IsNotSpecify = table.Column<bool>(type: "boolean", nullable: false),
                    IsShowDontShowAgain = table.Column<bool>(type: "boolean", nullable: false),
                    EventName = table.Column<string>(type: "character varying", nullable: false),
                    ImageURLEN = table.Column<string>(type: "character varying", nullable: false),
                    FileNameEN = table.Column<string>(type: "character varying", nullable: false),
                    OriginalFileNameEN = table.Column<string>(type: "character varying", nullable: false),
                    ImageURLTH = table.Column<string>(type: "character varying", nullable: true),
                    FileNameTH = table.Column<string>(type: "character varying", nullable: true),
                    OriginalFileNameTH = table.Column<string>(type: "character varying", nullable: true),
                    ImageURLCN = table.Column<string>(type: "character varying", nullable: true),
                    FileNameCN = table.Column<string>(type: "character varying", nullable: true),
                    OriginalFileNameCN = table.Column<string>(type: "character varying", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    IsDelete = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedBy = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    CreatedByName = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "timestamp without time zone", maxLength: 100, nullable: false),
                    UpdatedBy = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    UpdatedByName = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "timestamp without time zone", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_trMarcomSpecialEvent", x => x.Id);
                });

            migrationBuilder.UpdateData(
                table: "Location",
                keyColumn: "LID",
                keyValue: new Guid("2c055101-2271-44e0-95fe-bcf2c59a459a"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 9, 24, 15, 31, 59, 537, DateTimeKind.Local).AddTicks(2056), new DateTime(2024, 9, 24, 15, 31, 59, 537, DateTimeKind.Local).AddTicks(2057) });

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("4199e4de-bdf8-48f8-a8a8-a5b31756a748"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 9, 24, 15, 31, 59, 533, DateTimeKind.Local).AddTicks(9835), new DateTime(2024, 9, 24, 15, 31, 59, 534, DateTimeKind.Local).AddTicks(2855) });

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("caa4ebec-15c8-4d6b-9985-6d6b66f94e63"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 9, 24, 15, 31, 59, 534, DateTimeKind.Local).AddTicks(3043), new DateTime(2024, 9, 24, 15, 31, 59, 534, DateTimeKind.Local).AddTicks(3044) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc2"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 24, 15, 31, 59, 536, DateTimeKind.Local).AddTicks(8473), new DateTime(2024, 8, 24, 15, 31, 59, 536, DateTimeKind.Local).AddTicks(8531) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc3"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 24, 15, 31, 59, 536, DateTimeKind.Local).AddTicks(8552), new DateTime(2024, 8, 24, 15, 31, 59, 536, DateTimeKind.Local).AddTicks(8553) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc4"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 24, 15, 31, 59, 536, DateTimeKind.Local).AddTicks(8584), new DateTime(2024, 8, 24, 15, 31, 59, 536, DateTimeKind.Local).AddTicks(8585) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc5"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 24, 15, 31, 59, 536, DateTimeKind.Local).AddTicks(8587), new DateTime(2024, 8, 24, 15, 31, 59, 536, DateTimeKind.Local).AddTicks(8588) });

            migrationBuilder.UpdateData(
                table: "mtShiftManPowerRequest",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedDate", "StartDateTime", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 24, 15, 31, 59, 538, DateTimeKind.Local).AddTicks(2672), new DateTime(2024, 8, 24, 15, 31, 59, 538, DateTimeKind.Local).AddTicks(2483), new DateTime(2024, 8, 24, 15, 31, 59, 538, DateTimeKind.Local).AddTicks(2674) });

            migrationBuilder.UpdateData(
                table: "mtShiftManPowerRequest",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedDate", "StartDateTime", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 24, 15, 31, 59, 538, DateTimeKind.Local).AddTicks(2682), new DateTime(2024, 8, 24, 15, 31, 59, 538, DateTimeKind.Local).AddTicks(2680), new DateTime(2024, 8, 24, 15, 31, 59, 538, DateTimeKind.Local).AddTicks(2683) });

            migrationBuilder.UpdateData(
                table: "mtShiftManPowerRequest",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedDate", "StartDateTime", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 24, 15, 31, 59, 538, DateTimeKind.Local).AddTicks(2725), new DateTime(2024, 8, 24, 15, 31, 59, 538, DateTimeKind.Local).AddTicks(2724), new DateTime(2024, 8, 24, 15, 31, 59, 538, DateTimeKind.Local).AddTicks(2726) });

            migrationBuilder.UpdateData(
                table: "mtShiftManPowerRequest",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedDate", "StartDateTime", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 24, 15, 31, 59, 538, DateTimeKind.Local).AddTicks(2729), new DateTime(2024, 8, 24, 15, 31, 59, 538, DateTimeKind.Local).AddTicks(2728), new DateTime(2024, 8, 24, 15, 31, 59, 538, DateTimeKind.Local).AddTicks(2730) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("2aa84ed4-a495-47c8-913f-fa5928c1b4b8"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 24, 15, 31, 59, 536, DateTimeKind.Local).AddTicks(9215), new DateTime(2024, 8, 24, 15, 31, 59, 536, DateTimeKind.Local).AddTicks(9216) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("3ff4f468-53ef-48a3-8781-61a8a053fa99"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 24, 15, 31, 59, 536, DateTimeKind.Local).AddTicks(9224), new DateTime(2024, 8, 24, 15, 31, 59, 536, DateTimeKind.Local).AddTicks(9225) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("564d0272-92c8-4108-82b2-0f98882058d4"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 24, 15, 31, 59, 536, DateTimeKind.Local).AddTicks(9228), new DateTime(2024, 8, 24, 15, 31, 59, 536, DateTimeKind.Local).AddTicks(9239) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 24, 15, 31, 59, 536, DateTimeKind.Local).AddTicks(9247), new DateTime(2024, 8, 24, 15, 31, 59, 536, DateTimeKind.Local).AddTicks(9248) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("c1cb273c-570a-42f5-b563-66bac08911cc"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 24, 15, 31, 59, 536, DateTimeKind.Local).AddTicks(9250), new DateTime(2024, 8, 24, 15, 31, 59, 536, DateTimeKind.Local).AddTicks(9251) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("c1cb273c-570a-42f5-b563-66bac08911cd"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 24, 15, 31, 59, 536, DateTimeKind.Local).AddTicks(9260), new DateTime(2024, 8, 24, 15, 31, 59, 536, DateTimeKind.Local).AddTicks(9260) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc1"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 24, 15, 31, 59, 536, DateTimeKind.Local).AddTicks(9257), new DateTime(2024, 8, 24, 15, 31, 59, 536, DateTimeKind.Local).AddTicks(9257) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("18a79217-9fa7-460d-bccc-e74285b07531"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 9, 24, 15, 31, 59, 538, DateTimeKind.Local).AddTicks(8656), new DateTime(2024, 9, 24, 15, 31, 59, 538, DateTimeKind.Local).AddTicks(8657) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("f2cf879b-34f3-41da-9445-ee3bc590f224"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 9, 24, 15, 31, 59, 538, DateTimeKind.Local).AddTicks(8660), new DateTime(2024, 9, 24, 15, 31, 59, 538, DateTimeKind.Local).AddTicks(8660) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("fcddbf6b-88b8-4fae-ade7-63150ce1f1ec"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 9, 24, 15, 31, 59, 538, DateTimeKind.Local).AddTicks(8647), new DateTime(2024, 9, 24, 15, 31, 59, 538, DateTimeKind.Local).AddTicks(8652) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("1a157bf0-4748-4589-91cc-1450e0c06596"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 24, 15, 31, 59, 536, DateTimeKind.Local).AddTicks(9889), new DateTime(2024, 8, 24, 15, 31, 59, 536, DateTimeKind.Local).AddTicks(9890) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 24, 15, 31, 59, 536, DateTimeKind.Local).AddTicks(9905), new DateTime(2024, 8, 24, 15, 31, 59, 536, DateTimeKind.Local).AddTicks(9906) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("3fa85f64-5717-4562-b3fc-2c963f66afa6"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 24, 15, 31, 59, 536, DateTimeKind.Local).AddTicks(9902), new DateTime(2024, 8, 24, 15, 31, 59, 536, DateTimeKind.Local).AddTicks(9903) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 24, 15, 31, 59, 536, DateTimeKind.Local).AddTicks(9877), new DateTime(2024, 8, 24, 15, 31, 59, 536, DateTimeKind.Local).AddTicks(9879) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 24, 15, 31, 59, 536, DateTimeKind.Local).AddTicks(9886), new DateTime(2024, 8, 24, 15, 31, 59, 536, DateTimeKind.Local).AddTicks(9887) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("3ff4f468-53ef-48a3-8781-61a8a053fa99"), new Guid("1a157bf0-4748-4589-91cc-1450e0c06596") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 24, 15, 31, 59, 537, DateTimeKind.Local).AddTicks(1211), new DateTime(2024, 8, 24, 15, 31, 59, 537, DateTimeKind.Local).AddTicks(1212) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("564d0272-92c8-4108-82b2-0f98882058d4"), new Guid("1a157bf0-4748-4589-91cc-1450e0c06596") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 24, 15, 31, 59, 537, DateTimeKind.Local).AddTicks(1218), new DateTime(2024, 8, 24, 15, 31, 59, 537, DateTimeKind.Local).AddTicks(1219) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"), new Guid("1a157bf0-4748-4589-91cc-1450e0c06596") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 24, 15, 31, 59, 537, DateTimeKind.Local).AddTicks(1221), new DateTime(2024, 8, 24, 15, 31, 59, 537, DateTimeKind.Local).AddTicks(1221) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("564d0272-92c8-4108-82b2-0f98882058d4"), new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 24, 15, 31, 59, 537, DateTimeKind.Local).AddTicks(1224), new DateTime(2024, 8, 24, 15, 31, 59, 537, DateTimeKind.Local).AddTicks(1224) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"), new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 24, 15, 31, 59, 537, DateTimeKind.Local).AddTicks(1227), new DateTime(2024, 8, 24, 15, 31, 59, 537, DateTimeKind.Local).AddTicks(1228) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("e8eb7171-de01-4a85-a955-711b211eecc1"), new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 24, 15, 31, 59, 537, DateTimeKind.Local).AddTicks(1231), new DateTime(2024, 8, 24, 15, 31, 59, 537, DateTimeKind.Local).AddTicks(1232) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("c1cb273c-570a-42f5-b563-66bac08911cc"), new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 24, 15, 31, 59, 537, DateTimeKind.Local).AddTicks(1252), new DateTime(2024, 8, 24, 15, 31, 59, 537, DateTimeKind.Local).AddTicks(1253) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("c1cb273c-570a-42f5-b563-66bac08911cd"), new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 24, 15, 31, 59, 537, DateTimeKind.Local).AddTicks(1255), new DateTime(2024, 8, 24, 15, 31, 59, 537, DateTimeKind.Local).AddTicks(1256) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("2aa84ed4-a495-47c8-913f-fa5928c1b4b8"), new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 24, 15, 31, 59, 537, DateTimeKind.Local).AddTicks(1243), new DateTime(2024, 8, 24, 15, 31, 59, 537, DateTimeKind.Local).AddTicks(1243) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("564d0272-92c8-4108-82b2-0f98882058d4"), new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 24, 15, 31, 59, 537, DateTimeKind.Local).AddTicks(1246), new DateTime(2024, 8, 24, 15, 31, 59, 537, DateTimeKind.Local).AddTicks(1247) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"), new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 24, 15, 31, 59, 537, DateTimeKind.Local).AddTicks(1249), new DateTime(2024, 8, 24, 15, 31, 59, 537, DateTimeKind.Local).AddTicks(1250) });

            migrationBuilder.UpdateData(
                table: "trTask",
                keyColumn: "Id",
                keyValue: new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 24, 15, 31, 59, 537, DateTimeKind.Local).AddTicks(524), new DateTime(2024, 8, 24, 15, 31, 59, 537, DateTimeKind.Local).AddTicks(525) });

            migrationBuilder.UpdateData(
                table: "trTask",
                keyColumn: "Id",
                keyValue: new Guid("4422cc3c-0ea5-4d73-a31e-a42485a81003"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 24, 15, 31, 59, 537, DateTimeKind.Local).AddTicks(533), new DateTime(2024, 8, 24, 15, 31, 59, 537, DateTimeKind.Local).AddTicks(534) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("1a157bf0-4748-4589-91cc-1450e0c06596"), new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 24, 15, 31, 59, 537, DateTimeKind.Local).AddTicks(813), new DateTime(2024, 8, 24, 15, 31, 59, 537, DateTimeKind.Local).AddTicks(814) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5"), new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 24, 15, 31, 59, 537, DateTimeKind.Local).AddTicks(820), new DateTime(2024, 8, 24, 15, 31, 59, 537, DateTimeKind.Local).AddTicks(821) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911"), new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 24, 15, 31, 59, 537, DateTimeKind.Local).AddTicks(823), new DateTime(2024, 8, 24, 15, 31, 59, 537, DateTimeKind.Local).AddTicks(824) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496"), new Guid("4422cc3c-0ea5-4d73-a31e-a42485a81003") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 24, 15, 31, 59, 537, DateTimeKind.Local).AddTicks(835), new DateTime(2024, 8, 24, 15, 31, 59, 537, DateTimeKind.Local).AddTicks(836) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "trMarcomCMSExplore");

            migrationBuilder.DropTable(
                name: "trMarcomCMSExploreContent");

            migrationBuilder.DropTable(
                name: "trMarcomCMSTag");

            migrationBuilder.DropTable(
                name: "trMarcomCMSWhatHappenCategory");

            migrationBuilder.DropTable(
                name: "trMarcomCMSWhatHappenContent");

            migrationBuilder.DropTable(
                name: "trMarcomCMSWhatHappenSub");

            migrationBuilder.DropTable(
                name: "trMarcomConfig");

            migrationBuilder.DropTable(
                name: "trMarcomPRBanner");

            migrationBuilder.DropTable(
                name: "trMarcomSpecialEvent");

            migrationBuilder.UpdateData(
                table: "Location",
                keyColumn: "LID",
                keyValue: new Guid("2c055101-2271-44e0-95fe-bcf2c59a459a"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 9, 20, 11, 46, 33, 692, DateTimeKind.Local).AddTicks(1933), new DateTime(2024, 9, 20, 11, 46, 33, 692, DateTimeKind.Local).AddTicks(1936) });

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("4199e4de-bdf8-48f8-a8a8-a5b31756a748"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 9, 20, 11, 46, 33, 687, DateTimeKind.Local).AddTicks(2856), new DateTime(2024, 9, 20, 11, 46, 33, 687, DateTimeKind.Local).AddTicks(7598) });

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("caa4ebec-15c8-4d6b-9985-6d6b66f94e63"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 9, 20, 11, 46, 33, 687, DateTimeKind.Local).AddTicks(7973), new DateTime(2024, 9, 20, 11, 46, 33, 687, DateTimeKind.Local).AddTicks(7976) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc2"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 20, 11, 46, 33, 691, DateTimeKind.Local).AddTicks(5945), new DateTime(2024, 8, 20, 11, 46, 33, 691, DateTimeKind.Local).AddTicks(6019) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc3"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 20, 11, 46, 33, 691, DateTimeKind.Local).AddTicks(6043), new DateTime(2024, 8, 20, 11, 46, 33, 691, DateTimeKind.Local).AddTicks(6045) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc4"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 20, 11, 46, 33, 691, DateTimeKind.Local).AddTicks(6048), new DateTime(2024, 8, 20, 11, 46, 33, 691, DateTimeKind.Local).AddTicks(6049) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc5"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 20, 11, 46, 33, 691, DateTimeKind.Local).AddTicks(6052), new DateTime(2024, 8, 20, 11, 46, 33, 691, DateTimeKind.Local).AddTicks(6053) });

            migrationBuilder.UpdateData(
                table: "mtShiftManPowerRequest",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedDate", "StartDateTime", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 20, 11, 46, 33, 693, DateTimeKind.Local).AddTicks(5515), new DateTime(2024, 8, 20, 11, 46, 33, 693, DateTimeKind.Local).AddTicks(5335), new DateTime(2024, 8, 20, 11, 46, 33, 693, DateTimeKind.Local).AddTicks(5518) });

            migrationBuilder.UpdateData(
                table: "mtShiftManPowerRequest",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedDate", "StartDateTime", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 20, 11, 46, 33, 693, DateTimeKind.Local).AddTicks(5528), new DateTime(2024, 8, 20, 11, 46, 33, 693, DateTimeKind.Local).AddTicks(5526), new DateTime(2024, 8, 20, 11, 46, 33, 693, DateTimeKind.Local).AddTicks(5529) });

            migrationBuilder.UpdateData(
                table: "mtShiftManPowerRequest",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedDate", "StartDateTime", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 20, 11, 46, 33, 693, DateTimeKind.Local).AddTicks(5532), new DateTime(2024, 8, 20, 11, 46, 33, 693, DateTimeKind.Local).AddTicks(5531), new DateTime(2024, 8, 20, 11, 46, 33, 693, DateTimeKind.Local).AddTicks(5532) });

            migrationBuilder.UpdateData(
                table: "mtShiftManPowerRequest",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedDate", "StartDateTime", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 20, 11, 46, 33, 693, DateTimeKind.Local).AddTicks(5535), new DateTime(2024, 8, 20, 11, 46, 33, 693, DateTimeKind.Local).AddTicks(5534), new DateTime(2024, 8, 20, 11, 46, 33, 693, DateTimeKind.Local).AddTicks(5537) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("2aa84ed4-a495-47c8-913f-fa5928c1b4b8"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 20, 11, 46, 33, 691, DateTimeKind.Local).AddTicks(7169), new DateTime(2024, 8, 20, 11, 46, 33, 691, DateTimeKind.Local).AddTicks(7171) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("3ff4f468-53ef-48a3-8781-61a8a053fa99"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 20, 11, 46, 33, 691, DateTimeKind.Local).AddTicks(7192), new DateTime(2024, 8, 20, 11, 46, 33, 691, DateTimeKind.Local).AddTicks(7193) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("564d0272-92c8-4108-82b2-0f98882058d4"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 20, 11, 46, 33, 691, DateTimeKind.Local).AddTicks(7197), new DateTime(2024, 8, 20, 11, 46, 33, 691, DateTimeKind.Local).AddTicks(7199) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 20, 11, 46, 33, 691, DateTimeKind.Local).AddTicks(7204), new DateTime(2024, 8, 20, 11, 46, 33, 691, DateTimeKind.Local).AddTicks(7205) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("c1cb273c-570a-42f5-b563-66bac08911cc"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 20, 11, 46, 33, 691, DateTimeKind.Local).AddTicks(7208), new DateTime(2024, 8, 20, 11, 46, 33, 691, DateTimeKind.Local).AddTicks(7209) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("c1cb273c-570a-42f5-b563-66bac08911cd"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 20, 11, 46, 33, 691, DateTimeKind.Local).AddTicks(7221), new DateTime(2024, 8, 20, 11, 46, 33, 691, DateTimeKind.Local).AddTicks(7222) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc1"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 20, 11, 46, 33, 691, DateTimeKind.Local).AddTicks(7217), new DateTime(2024, 8, 20, 11, 46, 33, 691, DateTimeKind.Local).AddTicks(7218) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("18a79217-9fa7-460d-bccc-e74285b07531"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 9, 20, 11, 46, 33, 694, DateTimeKind.Local).AddTicks(1229), new DateTime(2024, 9, 20, 11, 46, 33, 694, DateTimeKind.Local).AddTicks(1230) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("f2cf879b-34f3-41da-9445-ee3bc590f224"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 9, 20, 11, 46, 33, 694, DateTimeKind.Local).AddTicks(1233), new DateTime(2024, 9, 20, 11, 46, 33, 694, DateTimeKind.Local).AddTicks(1233) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("fcddbf6b-88b8-4fae-ade7-63150ce1f1ec"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 9, 20, 11, 46, 33, 694, DateTimeKind.Local).AddTicks(1221), new DateTime(2024, 9, 20, 11, 46, 33, 694, DateTimeKind.Local).AddTicks(1225) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("1a157bf0-4748-4589-91cc-1450e0c06596"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 20, 11, 46, 33, 691, DateTimeKind.Local).AddTicks(8319), new DateTime(2024, 8, 20, 11, 46, 33, 691, DateTimeKind.Local).AddTicks(8321) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 20, 11, 46, 33, 691, DateTimeKind.Local).AddTicks(8330), new DateTime(2024, 8, 20, 11, 46, 33, 691, DateTimeKind.Local).AddTicks(8332) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("3fa85f64-5717-4562-b3fc-2c963f66afa6"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 20, 11, 46, 33, 691, DateTimeKind.Local).AddTicks(8325), new DateTime(2024, 8, 20, 11, 46, 33, 691, DateTimeKind.Local).AddTicks(8327) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 20, 11, 46, 33, 691, DateTimeKind.Local).AddTicks(8278), new DateTime(2024, 8, 20, 11, 46, 33, 691, DateTimeKind.Local).AddTicks(8281) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 20, 11, 46, 33, 691, DateTimeKind.Local).AddTicks(8313), new DateTime(2024, 8, 20, 11, 46, 33, 691, DateTimeKind.Local).AddTicks(8314) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("3ff4f468-53ef-48a3-8781-61a8a053fa99"), new Guid("1a157bf0-4748-4589-91cc-1450e0c06596") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 20, 11, 46, 33, 692, DateTimeKind.Local).AddTicks(577), new DateTime(2024, 8, 20, 11, 46, 33, 692, DateTimeKind.Local).AddTicks(579) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("564d0272-92c8-4108-82b2-0f98882058d4"), new Guid("1a157bf0-4748-4589-91cc-1450e0c06596") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 20, 11, 46, 33, 692, DateTimeKind.Local).AddTicks(590), new DateTime(2024, 8, 20, 11, 46, 33, 692, DateTimeKind.Local).AddTicks(591) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"), new Guid("1a157bf0-4748-4589-91cc-1450e0c06596") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 20, 11, 46, 33, 692, DateTimeKind.Local).AddTicks(595), new DateTime(2024, 8, 20, 11, 46, 33, 692, DateTimeKind.Local).AddTicks(596) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("564d0272-92c8-4108-82b2-0f98882058d4"), new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 20, 11, 46, 33, 692, DateTimeKind.Local).AddTicks(600), new DateTime(2024, 8, 20, 11, 46, 33, 692, DateTimeKind.Local).AddTicks(601) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"), new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 20, 11, 46, 33, 692, DateTimeKind.Local).AddTicks(604), new DateTime(2024, 8, 20, 11, 46, 33, 692, DateTimeKind.Local).AddTicks(605) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("e8eb7171-de01-4a85-a955-711b211eecc1"), new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 20, 11, 46, 33, 692, DateTimeKind.Local).AddTicks(624), new DateTime(2024, 8, 20, 11, 46, 33, 692, DateTimeKind.Local).AddTicks(625) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("c1cb273c-570a-42f5-b563-66bac08911cc"), new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 20, 11, 46, 33, 692, DateTimeKind.Local).AddTicks(646), new DateTime(2024, 8, 20, 11, 46, 33, 692, DateTimeKind.Local).AddTicks(647) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("c1cb273c-570a-42f5-b563-66bac08911cd"), new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 20, 11, 46, 33, 692, DateTimeKind.Local).AddTicks(650), new DateTime(2024, 8, 20, 11, 46, 33, 692, DateTimeKind.Local).AddTicks(651) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("2aa84ed4-a495-47c8-913f-fa5928c1b4b8"), new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 20, 11, 46, 33, 692, DateTimeKind.Local).AddTicks(629), new DateTime(2024, 8, 20, 11, 46, 33, 692, DateTimeKind.Local).AddTicks(630) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("564d0272-92c8-4108-82b2-0f98882058d4"), new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 20, 11, 46, 33, 692, DateTimeKind.Local).AddTicks(635), new DateTime(2024, 8, 20, 11, 46, 33, 692, DateTimeKind.Local).AddTicks(637) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"), new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 20, 11, 46, 33, 692, DateTimeKind.Local).AddTicks(640), new DateTime(2024, 8, 20, 11, 46, 33, 692, DateTimeKind.Local).AddTicks(641) });

            migrationBuilder.UpdateData(
                table: "trTask",
                keyColumn: "Id",
                keyValue: new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 20, 11, 46, 33, 691, DateTimeKind.Local).AddTicks(9351), new DateTime(2024, 8, 20, 11, 46, 33, 691, DateTimeKind.Local).AddTicks(9354) });

            migrationBuilder.UpdateData(
                table: "trTask",
                keyColumn: "Id",
                keyValue: new Guid("4422cc3c-0ea5-4d73-a31e-a42485a81003"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 20, 11, 46, 33, 691, DateTimeKind.Local).AddTicks(9371), new DateTime(2024, 8, 20, 11, 46, 33, 691, DateTimeKind.Local).AddTicks(9373) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("1a157bf0-4748-4589-91cc-1450e0c06596"), new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 20, 11, 46, 33, 691, DateTimeKind.Local).AddTicks(9867), new DateTime(2024, 8, 20, 11, 46, 33, 691, DateTimeKind.Local).AddTicks(9869) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5"), new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 20, 11, 46, 33, 691, DateTimeKind.Local).AddTicks(9879), new DateTime(2024, 8, 20, 11, 46, 33, 691, DateTimeKind.Local).AddTicks(9901) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911"), new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 20, 11, 46, 33, 691, DateTimeKind.Local).AddTicks(9904), new DateTime(2024, 8, 20, 11, 46, 33, 691, DateTimeKind.Local).AddTicks(9905) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496"), new Guid("4422cc3c-0ea5-4d73-a31e-a42485a81003") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 20, 11, 46, 33, 691, DateTimeKind.Local).AddTicks(9908), new DateTime(2024, 8, 20, 11, 46, 33, 691, DateTimeKind.Local).AddTicks(9909) });
        }
    }
}
