using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TCCTOBK.OperationBackend.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class AddTableSustainability : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "trSustainabilityBanner",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Type = table.Column<int>(type: "integer", nullable: false),
                    ImageURL = table.Column<string>(type: "character varying", nullable: false),
                    FileName = table.Column<string>(type: "character varying", nullable: false),
                    OriginalFileName = table.Column<string>(type: "character varying", nullable: false),
                    LabelLevel1 = table.Column<string>(type: "character varying", maxLength: 50, nullable: true),
                    LabelLevel2 = table.Column<string>(type: "character varying", maxLength: 50, nullable: true),
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
                    table.PrimaryKey("PK_trSustainabilityBanner", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "trSustainabilityCMS",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    IsSubMenu = table.Column<bool>(type: "boolean", nullable: false),
                    ParentId = table.Column<Guid>(type: "uuid", nullable: true),
                    IsShowRelatedLink = table.Column<bool>(type: "boolean", nullable: true),
                    TitleRelatedEN = table.Column<string>(type: "character varying", maxLength: 200, nullable: true),
                    TitleRelatedTH = table.Column<string>(type: "character varying", maxLength: 200, nullable: true),
                    TitleRelatedCN = table.Column<string>(type: "character varying", maxLength: 200, nullable: true),
                    Order = table.Column<int>(type: "integer", nullable: false),
                    LayoutType = table.Column<int>(type: "integer", nullable: true),
                    MenuNameEn = table.Column<string>(type: "character varying", maxLength: 500, nullable: false),
                    MenuNameTH = table.Column<string>(type: "character varying", maxLength: 500, nullable: true),
                    MenuNameCN = table.Column<string>(type: "character varying", maxLength: 500, nullable: true),
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
                    table.PrimaryKey("PK_trSustainabilityCMS", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "trSustainabilityCMSContent",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    MenuId = table.Column<Guid>(type: "uuid", nullable: false),
                    Language = table.Column<string>(type: "character varying", nullable: false),
                    ContentType = table.Column<int>(type: "integer", nullable: false),
                    Order = table.Column<int>(type: "integer", nullable: false),
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
                    table.PrimaryKey("PK_trSustainabilityCMSContent", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "trSustainabilityLibrary",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Order = table.Column<int>(type: "integer", nullable: false),
                    TopicEN = table.Column<string>(type: "character varying", maxLength: 500, nullable: false),
                    TopicTH = table.Column<string>(type: "character varying", maxLength: 500, nullable: true),
                    TopicCN = table.Column<string>(type: "character varying", maxLength: 500, nullable: true),
                    IntroduceEN = table.Column<string>(type: "character varying", maxLength: 500, nullable: false),
                    IntroduceTH = table.Column<string>(type: "character varying", maxLength: 500, nullable: true),
                    IntroduceCN = table.Column<string>(type: "character varying", maxLength: 500, nullable: true),
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
                    table.PrimaryKey("PK_trSustainabilityLibrary", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "trSustainabilityLibraryFile",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TopicId = table.Column<Guid>(type: "uuid", nullable: false),
                    Language = table.Column<string>(type: "character varying", nullable: false),
                    Order = table.Column<int>(type: "integer", nullable: false),
                    CoverImageURL = table.Column<string>(type: "character varying", nullable: true),
                    CoverFileName = table.Column<string>(type: "character varying", nullable: true),
                    CoverOriginalFileName = table.Column<string>(type: "character varying", nullable: true),
                    AttachFileURL = table.Column<string>(type: "character varying", nullable: false),
                    AttachFileName = table.Column<string>(type: "character varying", nullable: false),
                    AttachOriginalFileName = table.Column<string>(type: "character varying", nullable: false),
                    AttachFileType = table.Column<string>(type: "character varying", maxLength: 50, nullable: false),
                    AttachFileSize = table.Column<string>(type: "character varying", maxLength: 50, nullable: false),
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
                    table.PrimaryKey("PK_trSustainabilityLibraryFile", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "trSustainabilityPRBanner",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Order = table.Column<int>(type: "integer", nullable: false),
                    BannerName = table.Column<string>(type: "character varying", nullable: false),
                    ImageURLEN = table.Column<string>(type: "character varying", nullable: false),
                    FileNameEN = table.Column<string>(type: "character varying", nullable: false),
                    OriginalFileNameEN = table.Column<string>(type: "character varying", nullable: false),
                    ImageURLTH = table.Column<string>(type: "character varying", nullable: true),
                    FileNameTH = table.Column<string>(type: "character varying", nullable: true),
                    OriginalFileNameTH = table.Column<string>(type: "character varying", nullable: true),
                    ImageURLCN = table.Column<string>(type: "character varying", nullable: true),
                    FileNameCN = table.Column<string>(type: "character varying", nullable: true),
                    OriginalFileNameCN = table.Column<string>(type: "character varying", nullable: true),
                    Type = table.Column<int>(type: "integer", nullable: false),
                    LinkToURL = table.Column<string>(type: "character varying", nullable: true),
                    TextEN = table.Column<string>(type: "character varying", nullable: true),
                    TextTH = table.Column<string>(type: "character varying", nullable: true),
                    TextCN = table.Column<string>(type: "character varying", nullable: true),
                    IsShowRelatedLink = table.Column<bool>(type: "boolean", nullable: true),
                    HeaderImageURLEN = table.Column<string>(type: "character varying", nullable: false),
                    HeaderFileNameEN = table.Column<string>(type: "character varying", nullable: false),
                    HeaderOriginalFileNameEN = table.Column<string>(type: "character varying", nullable: false),
                    HeaderImageURLTH = table.Column<string>(type: "character varying", nullable: true),
                    HeaderFileNameTH = table.Column<string>(type: "character varying", nullable: true),
                    HeaderOriginalFileNameTH = table.Column<string>(type: "character varying", nullable: true),
                    HeaderImageURLCN = table.Column<string>(type: "character varying", nullable: true),
                    HeaderFileNameCN = table.Column<string>(type: "character varying", nullable: true),
                    HeaderOriginalFileNameCN = table.Column<string>(type: "character varying", nullable: true),
                    TitleEN = table.Column<string>(type: "character varying", nullable: false),
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
                    table.PrimaryKey("PK_trSustainabilityPRBanner", x => x.Id);
                });

            migrationBuilder.UpdateData(
                table: "Location",
                keyColumn: "LID",
                keyValue: new Guid("2c055101-2271-44e0-95fe-bcf2c59a459a"),
                columns: new[] { "BuildingName", "BuildingZoneName", "CreatedByName", "CreatedDate", "FloorName", "SiteName", "Type", "UpdatedByName", "UpdatedDate", "ZoneName" },
                values: new object[] { "O2", "O2T1", "System", new DateTime(2024, 8, 27, 17, 29, 0, 450, DateTimeKind.Local).AddTicks(2414), "1B", "OBK", "floor", "System", new DateTime(2024, 8, 27, 17, 29, 0, 450, DateTimeKind.Local).AddTicks(2416), "R1" });

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("4199e4de-bdf8-48f8-a8a8-a5b31756a748"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 27, 17, 29, 0, 446, DateTimeKind.Local).AddTicks(1566), new DateTime(2024, 8, 27, 17, 29, 0, 446, DateTimeKind.Local).AddTicks(5028) });

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("caa4ebec-15c8-4d6b-9985-6d6b66f94e63"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 27, 17, 29, 0, 446, DateTimeKind.Local).AddTicks(5240), new DateTime(2024, 8, 27, 17, 29, 0, 446, DateTimeKind.Local).AddTicks(5241) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc2"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 27, 17, 29, 0, 449, DateTimeKind.Local).AddTicks(8168), new DateTime(2024, 7, 27, 17, 29, 0, 449, DateTimeKind.Local).AddTicks(8255) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc3"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 27, 17, 29, 0, 449, DateTimeKind.Local).AddTicks(8276), new DateTime(2024, 7, 27, 17, 29, 0, 449, DateTimeKind.Local).AddTicks(8278) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc4"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 27, 17, 29, 0, 449, DateTimeKind.Local).AddTicks(8281), new DateTime(2024, 7, 27, 17, 29, 0, 449, DateTimeKind.Local).AddTicks(8282) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc5"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 27, 17, 29, 0, 449, DateTimeKind.Local).AddTicks(8284), new DateTime(2024, 7, 27, 17, 29, 0, 449, DateTimeKind.Local).AddTicks(8285) });

            migrationBuilder.UpdateData(
                table: "mtShiftManPowerRequest",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedDate", "StartDateTime", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 27, 17, 29, 0, 450, DateTimeKind.Local).AddTicks(9570), new DateTime(2024, 7, 27, 17, 29, 0, 450, DateTimeKind.Local).AddTicks(9373), new DateTime(2024, 7, 27, 17, 29, 0, 450, DateTimeKind.Local).AddTicks(9573) });

            migrationBuilder.UpdateData(
                table: "mtShiftManPowerRequest",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedDate", "StartDateTime", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 27, 17, 29, 0, 450, DateTimeKind.Local).AddTicks(9583), new DateTime(2024, 7, 27, 17, 29, 0, 450, DateTimeKind.Local).AddTicks(9582), new DateTime(2024, 7, 27, 17, 29, 0, 450, DateTimeKind.Local).AddTicks(9584) });

            migrationBuilder.UpdateData(
                table: "mtShiftManPowerRequest",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedDate", "StartDateTime", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 27, 17, 29, 0, 450, DateTimeKind.Local).AddTicks(9587), new DateTime(2024, 7, 27, 17, 29, 0, 450, DateTimeKind.Local).AddTicks(9586), new DateTime(2024, 7, 27, 17, 29, 0, 450, DateTimeKind.Local).AddTicks(9588) });

            migrationBuilder.UpdateData(
                table: "mtShiftManPowerRequest",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedDate", "StartDateTime", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 27, 17, 29, 0, 450, DateTimeKind.Local).AddTicks(9591), new DateTime(2024, 7, 27, 17, 29, 0, 450, DateTimeKind.Local).AddTicks(9590), new DateTime(2024, 7, 27, 17, 29, 0, 450, DateTimeKind.Local).AddTicks(9592) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("2aa84ed4-a495-47c8-913f-fa5928c1b4b8"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 27, 17, 29, 0, 449, DateTimeKind.Local).AddTicks(9114), new DateTime(2024, 7, 27, 17, 29, 0, 449, DateTimeKind.Local).AddTicks(9115) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("3ff4f468-53ef-48a3-8781-61a8a053fa99"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 27, 17, 29, 0, 449, DateTimeKind.Local).AddTicks(9123), new DateTime(2024, 7, 27, 17, 29, 0, 449, DateTimeKind.Local).AddTicks(9124) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("564d0272-92c8-4108-82b2-0f98882058d4"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 27, 17, 29, 0, 449, DateTimeKind.Local).AddTicks(9131), new DateTime(2024, 7, 27, 17, 29, 0, 449, DateTimeKind.Local).AddTicks(9131) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 27, 17, 29, 0, 449, DateTimeKind.Local).AddTicks(9135), new DateTime(2024, 7, 27, 17, 29, 0, 449, DateTimeKind.Local).AddTicks(9136) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("c1cb273c-570a-42f5-b563-66bac08911cc"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 27, 17, 29, 0, 449, DateTimeKind.Local).AddTicks(9149), new DateTime(2024, 7, 27, 17, 29, 0, 449, DateTimeKind.Local).AddTicks(9150) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("c1cb273c-570a-42f5-b563-66bac08911cd"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 27, 17, 29, 0, 449, DateTimeKind.Local).AddTicks(9165), new DateTime(2024, 7, 27, 17, 29, 0, 449, DateTimeKind.Local).AddTicks(9166) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc1"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 27, 17, 29, 0, 449, DateTimeKind.Local).AddTicks(9161), new DateTime(2024, 7, 27, 17, 29, 0, 449, DateTimeKind.Local).AddTicks(9162) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("18a79217-9fa7-460d-bccc-e74285b07531"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 27, 17, 29, 0, 451, DateTimeKind.Local).AddTicks(5997), new DateTime(2024, 8, 27, 17, 29, 0, 451, DateTimeKind.Local).AddTicks(5997) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("f2cf879b-34f3-41da-9445-ee3bc590f224"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 27, 17, 29, 0, 451, DateTimeKind.Local).AddTicks(6000), new DateTime(2024, 8, 27, 17, 29, 0, 451, DateTimeKind.Local).AddTicks(6000) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("fcddbf6b-88b8-4fae-ade7-63150ce1f1ec"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 8, 27, 17, 29, 0, 451, DateTimeKind.Local).AddTicks(5989), new DateTime(2024, 8, 27, 17, 29, 0, 451, DateTimeKind.Local).AddTicks(5992) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("1a157bf0-4748-4589-91cc-1450e0c06596"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 27, 17, 29, 0, 449, DateTimeKind.Local).AddTicks(9885), new DateTime(2024, 7, 27, 17, 29, 0, 449, DateTimeKind.Local).AddTicks(9886) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 27, 17, 29, 0, 449, DateTimeKind.Local).AddTicks(9891), new DateTime(2024, 7, 27, 17, 29, 0, 449, DateTimeKind.Local).AddTicks(9901) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("3fa85f64-5717-4562-b3fc-2c963f66afa6"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 27, 17, 29, 0, 449, DateTimeKind.Local).AddTicks(9888), new DateTime(2024, 7, 27, 17, 29, 0, 449, DateTimeKind.Local).AddTicks(9889) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 27, 17, 29, 0, 449, DateTimeKind.Local).AddTicks(9871), new DateTime(2024, 7, 27, 17, 29, 0, 449, DateTimeKind.Local).AddTicks(9873) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 27, 17, 29, 0, 449, DateTimeKind.Local).AddTicks(9882), new DateTime(2024, 7, 27, 17, 29, 0, 449, DateTimeKind.Local).AddTicks(9882) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("3ff4f468-53ef-48a3-8781-61a8a053fa99"), new Guid("1a157bf0-4748-4589-91cc-1450e0c06596") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 27, 17, 29, 0, 450, DateTimeKind.Local).AddTicks(1447), new DateTime(2024, 7, 27, 17, 29, 0, 450, DateTimeKind.Local).AddTicks(1455) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("564d0272-92c8-4108-82b2-0f98882058d4"), new Guid("1a157bf0-4748-4589-91cc-1450e0c06596") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 27, 17, 29, 0, 450, DateTimeKind.Local).AddTicks(1462), new DateTime(2024, 7, 27, 17, 29, 0, 450, DateTimeKind.Local).AddTicks(1463) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"), new Guid("1a157bf0-4748-4589-91cc-1450e0c06596") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 27, 17, 29, 0, 450, DateTimeKind.Local).AddTicks(1466), new DateTime(2024, 7, 27, 17, 29, 0, 450, DateTimeKind.Local).AddTicks(1467) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("564d0272-92c8-4108-82b2-0f98882058d4"), new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 27, 17, 29, 0, 450, DateTimeKind.Local).AddTicks(1469), new DateTime(2024, 7, 27, 17, 29, 0, 450, DateTimeKind.Local).AddTicks(1470) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"), new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 27, 17, 29, 0, 450, DateTimeKind.Local).AddTicks(1473), new DateTime(2024, 7, 27, 17, 29, 0, 450, DateTimeKind.Local).AddTicks(1474) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("e8eb7171-de01-4a85-a955-711b211eecc1"), new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 27, 17, 29, 0, 450, DateTimeKind.Local).AddTicks(1477), new DateTime(2024, 7, 27, 17, 29, 0, 450, DateTimeKind.Local).AddTicks(1478) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("c1cb273c-570a-42f5-b563-66bac08911cc"), new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 27, 17, 29, 0, 450, DateTimeKind.Local).AddTicks(1499), new DateTime(2024, 7, 27, 17, 29, 0, 450, DateTimeKind.Local).AddTicks(1500) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("c1cb273c-570a-42f5-b563-66bac08911cd"), new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 27, 17, 29, 0, 450, DateTimeKind.Local).AddTicks(1502), new DateTime(2024, 7, 27, 17, 29, 0, 450, DateTimeKind.Local).AddTicks(1503) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("2aa84ed4-a495-47c8-913f-fa5928c1b4b8"), new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 27, 17, 29, 0, 450, DateTimeKind.Local).AddTicks(1481), new DateTime(2024, 7, 27, 17, 29, 0, 450, DateTimeKind.Local).AddTicks(1481) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("564d0272-92c8-4108-82b2-0f98882058d4"), new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 27, 17, 29, 0, 450, DateTimeKind.Local).AddTicks(1484), new DateTime(2024, 7, 27, 17, 29, 0, 450, DateTimeKind.Local).AddTicks(1485) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"), new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 27, 17, 29, 0, 450, DateTimeKind.Local).AddTicks(1494), new DateTime(2024, 7, 27, 17, 29, 0, 450, DateTimeKind.Local).AddTicks(1495) });

            migrationBuilder.UpdateData(
                table: "trTask",
                keyColumn: "Id",
                keyValue: new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 27, 17, 29, 0, 450, DateTimeKind.Local).AddTicks(600), new DateTime(2024, 7, 27, 17, 29, 0, 450, DateTimeKind.Local).AddTicks(602) });

            migrationBuilder.UpdateData(
                table: "trTask",
                keyColumn: "Id",
                keyValue: new Guid("4422cc3c-0ea5-4d73-a31e-a42485a81003"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 27, 17, 29, 0, 450, DateTimeKind.Local).AddTicks(610), new DateTime(2024, 7, 27, 17, 29, 0, 450, DateTimeKind.Local).AddTicks(611) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("1a157bf0-4748-4589-91cc-1450e0c06596"), new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 27, 17, 29, 0, 450, DateTimeKind.Local).AddTicks(929), new DateTime(2024, 7, 27, 17, 29, 0, 450, DateTimeKind.Local).AddTicks(931) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5"), new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 27, 17, 29, 0, 450, DateTimeKind.Local).AddTicks(936), new DateTime(2024, 7, 27, 17, 29, 0, 450, DateTimeKind.Local).AddTicks(937) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911"), new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 27, 17, 29, 0, 450, DateTimeKind.Local).AddTicks(940), new DateTime(2024, 7, 27, 17, 29, 0, 450, DateTimeKind.Local).AddTicks(941) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496"), new Guid("4422cc3c-0ea5-4d73-a31e-a42485a81003") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 27, 17, 29, 0, 450, DateTimeKind.Local).AddTicks(943), new DateTime(2024, 7, 27, 17, 29, 0, 450, DateTimeKind.Local).AddTicks(944) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "trSustainabilityBanner");

            migrationBuilder.DropTable(
                name: "trSustainabilityCMS");

            migrationBuilder.DropTable(
                name: "trSustainabilityCMSContent");

            migrationBuilder.DropTable(
                name: "trSustainabilityLibrary");

            migrationBuilder.DropTable(
                name: "trSustainabilityLibraryFile");

            migrationBuilder.DropTable(
                name: "trSustainabilityPRBanner");

            migrationBuilder.DropColumn(
                name: "BuildingName",
                table: "Location");

            migrationBuilder.DropColumn(
                name: "BuildingZoneName",
                table: "Location");

            migrationBuilder.DropColumn(
                name: "FloorName",
                table: "Location");

            migrationBuilder.DropColumn(
                name: "SiteName",
                table: "Location");

            migrationBuilder.DropColumn(
                name: "ZoneName",
                table: "Location");

            migrationBuilder.RenameColumn(
                name: "Type",
                table: "Location",
                newName: "LocationName");

            migrationBuilder.AddColumn<int>(
                name: "LocationType",
                table: "Location",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<Guid>(
                name: "ParentLocationId",
                table: "Location",
                type: "uuid",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "Location",
                keyColumn: "LID",
                keyValue: new Guid("2c055101-2271-44e0-95fe-bcf2c59a459a"),
                columns: new[] { "CreatedByName", "CreatedDate", "LocationName", "LocationType", "ParentLocationId", "UpdatedByName", "UpdatedDate" },
                values: new object[] { "system", new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(9377), "Location 1", 1, null, "system", new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(9381) });

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("4199e4de-bdf8-48f8-a8a8-a5b31756a748"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 27, 22, 22, 54, 835, DateTimeKind.Local).AddTicks(2255), new DateTime(2024, 7, 27, 22, 22, 54, 835, DateTimeKind.Local).AddTicks(6167) });

            migrationBuilder.UpdateData(
                table: "Tenant",
                keyColumn: "TID",
                keyValue: new Guid("caa4ebec-15c8-4d6b-9985-6d6b66f94e63"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 27, 22, 22, 54, 835, DateTimeKind.Local).AddTicks(6606), new DateTime(2024, 7, 27, 22, 22, 54, 835, DateTimeKind.Local).AddTicks(6609) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc2"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(1825), new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(1912) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc3"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(1934), new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(1935) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc4"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(1937), new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(1938) });

            migrationBuilder.UpdateData(
                table: "mtActionType",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc5"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(1939), new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(1940) });

            migrationBuilder.UpdateData(
                table: "mtShiftManPowerRequest",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedDate", "StartDateTime", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 27, 22, 22, 54, 840, DateTimeKind.Local).AddTicks(9522), new DateTime(2024, 6, 27, 22, 22, 54, 840, DateTimeKind.Local).AddTicks(9200), new DateTime(2024, 6, 27, 22, 22, 54, 840, DateTimeKind.Local).AddTicks(9526) });

            migrationBuilder.UpdateData(
                table: "mtShiftManPowerRequest",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedDate", "StartDateTime", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 27, 22, 22, 54, 840, DateTimeKind.Local).AddTicks(9542), new DateTime(2024, 6, 27, 22, 22, 54, 840, DateTimeKind.Local).AddTicks(9541), new DateTime(2024, 6, 27, 22, 22, 54, 840, DateTimeKind.Local).AddTicks(9543) });

            migrationBuilder.UpdateData(
                table: "mtShiftManPowerRequest",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedDate", "StartDateTime", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 27, 22, 22, 54, 840, DateTimeKind.Local).AddTicks(9545), new DateTime(2024, 6, 27, 22, 22, 54, 840, DateTimeKind.Local).AddTicks(9544), new DateTime(2024, 6, 27, 22, 22, 54, 840, DateTimeKind.Local).AddTicks(9546) });

            migrationBuilder.UpdateData(
                table: "mtShiftManPowerRequest",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedDate", "StartDateTime", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 27, 22, 22, 54, 840, DateTimeKind.Local).AddTicks(9549), new DateTime(2024, 6, 27, 22, 22, 54, 840, DateTimeKind.Local).AddTicks(9548), new DateTime(2024, 6, 27, 22, 22, 54, 840, DateTimeKind.Local).AddTicks(9549) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("2aa84ed4-a495-47c8-913f-fa5928c1b4b8"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(3360), new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(3365) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("3ff4f468-53ef-48a3-8781-61a8a053fa99"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(3382), new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(3383) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("564d0272-92c8-4108-82b2-0f98882058d4"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(3386), new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(3406) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(3409), new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(3410) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("c1cb273c-570a-42f5-b563-66bac08911cc"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(3412), new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(3413) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("c1cb273c-570a-42f5-b563-66bac08911cd"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(3426), new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(3427) });

            migrationBuilder.UpdateData(
                table: "trAction",
                keyColumn: "Id",
                keyValue: new Guid("e8eb7171-de01-4a85-a955-711b211eecc1"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(3423), new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(3424) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("18a79217-9fa7-460d-bccc-e74285b07531"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 27, 22, 22, 54, 841, DateTimeKind.Local).AddTicks(8009), new DateTime(2024, 7, 27, 22, 22, 54, 841, DateTimeKind.Local).AddTicks(8010) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("f2cf879b-34f3-41da-9445-ee3bc590f224"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 27, 22, 22, 54, 841, DateTimeKind.Local).AddTicks(8012), new DateTime(2024, 7, 27, 22, 22, 54, 841, DateTimeKind.Local).AddTicks(8012) });

            migrationBuilder.UpdateData(
                table: "trRole",
                keyColumn: "RID",
                keyValue: new Guid("fcddbf6b-88b8-4fae-ade7-63150ce1f1ec"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 7, 27, 22, 22, 54, 841, DateTimeKind.Local).AddTicks(7998), new DateTime(2024, 7, 27, 22, 22, 54, 841, DateTimeKind.Local).AddTicks(8002) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("1a157bf0-4748-4589-91cc-1450e0c06596"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(4693), new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(4693) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(4717), new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(4718) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("3fa85f64-5717-4562-b3fc-2c963f66afa6"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(4714), new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(4715) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(4669), new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(4673) });

            migrationBuilder.UpdateData(
                table: "trSubtask",
                keyColumn: "Id",
                keyValue: new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(4689), new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(4690) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("3ff4f468-53ef-48a3-8781-61a8a053fa99"), new Guid("1a157bf0-4748-4589-91cc-1450e0c06596") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(7833), new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(7836) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("564d0272-92c8-4108-82b2-0f98882058d4"), new Guid("1a157bf0-4748-4589-91cc-1450e0c06596") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(7891), new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(7892) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"), new Guid("1a157bf0-4748-4589-91cc-1450e0c06596") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(7895), new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(7895) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("564d0272-92c8-4108-82b2-0f98882058d4"), new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(7898), new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(7899) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"), new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(7901), new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(7902) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("e8eb7171-de01-4a85-a955-711b211eecc1"), new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(7907), new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(7908) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("c1cb273c-570a-42f5-b563-66bac08911cc"), new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(7933), new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(7933) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("c1cb273c-570a-42f5-b563-66bac08911cd"), new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(7936), new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(7937) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("2aa84ed4-a495-47c8-913f-fa5928c1b4b8"), new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(7921), new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(7922) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("564d0272-92c8-4108-82b2-0f98882058d4"), new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(7925), new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(7926) });

            migrationBuilder.UpdateData(
                table: "trSubtaskAction",
                keyColumns: new[] { "Action", "Subtask" },
                keyValues: new object[] { new Guid("6d174fd6-b597-4b16-a117-08b7a84be839"), new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(7928), new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(7929) });

            migrationBuilder.UpdateData(
                table: "trTask",
                keyColumn: "Id",
                keyValue: new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(6146), new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(6150) });

            migrationBuilder.UpdateData(
                table: "trTask",
                keyColumn: "Id",
                keyValue: new Guid("4422cc3c-0ea5-4d73-a31e-a42485a81003"),
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(6167), new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(6168) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("1a157bf0-4748-4589-91cc-1450e0c06596"), new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(6895), new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(6898) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("35d4cfa7-04ea-473a-9b50-c9751843ead5"), new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(6915), new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(6916) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("eaab304c-89e1-484c-aefe-0e4e3e27e911"), new Guid("2c055101-2271-44e0-95fe-bcf2c59a459b") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(6918), new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(6919) });

            migrationBuilder.UpdateData(
                table: "trTaskSubtask",
                keyColumns: new[] { "Subtask", "Task" },
                keyValues: new object[] { new Guid("77e2f48c-8178-4df5-9b84-48bfd253a496"), new Guid("4422cc3c-0ea5-4d73-a31e-a42485a81003") },
                columns: new[] { "CreatedDate", "UpdatedDate" },
                values: new object[] { new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(6938), new DateTime(2024, 6, 27, 22, 22, 54, 839, DateTimeKind.Local).AddTicks(6939) });
        }
    }
}
