using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TCCTOBK.OperationBackend.Infrastructure.Database.Migrations
{
	/// <inheritdoc />
	public partial class InitiateCreated : Migration
	{
		/// <inheritdoc />
		protected override void Up(MigrationBuilder migrationBuilder)
		{
			migrationBuilder.CreateTable(
					name: "HomeContent",
					columns: table => new
					{
						HCID = table.Column<Guid>(type: "uuid", nullable: false),
						Version = table.Column<string>(type: "character varying", maxLength: 500, nullable: false),
						ImageURL = table.Column<string>(type: "character varying", nullable: false),
						IsVisible = table.Column<bool>(type: "boolean", nullable: false),
						Note = table.Column<string>(type: "text", nullable: true),
						RemoteConfigDataJson = table.Column<string>(type: "character varying", nullable: false),
						RemoteConfigResponseDataJson = table.Column<string>(type: "text", nullable: false),
						OriginalFileName = table.Column<string>(type: "character varying", nullable: false),
						FileName = table.Column<string>(type: "character varying", nullable: false),
						CreatedBy = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
						CreatedByName = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
						CreatedDate = table.Column<DateTime>(type: "timestamp without time zone", maxLength: 100, nullable: false),
						UpdatedBy = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
						UpdatedByName = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
						UpdatedDate = table.Column<DateTime>(type: "timestamp without time zone", maxLength: 100, nullable: false)
					},
					constraints: table =>
					{
						table.PrimaryKey("PK_HomeContent", x => x.HCID);
					});

			migrationBuilder.CreateTable(
					name: "mtAppConfig",
					columns: table => new
					{
						Id = table.Column<Guid>(type: "uuid", nullable: false),
						Name = table.Column<string>(type: "character varying", maxLength: 200, nullable: false),
						Value = table.Column<string>(type: "character varying", maxLength: 200, nullable: false),
						IsActive = table.Column<bool>(type: "boolean", nullable: false)
					},
					constraints: table =>
					{
						table.PrimaryKey("PK_mtAppConfig", x => x.Id);
					});

			migrationBuilder.CreateTable(
					name: "mtMenu",
					columns: table => new
					{
						Id = table.Column<Guid>(type: "uuid", nullable: false),
						ParentId = table.Column<Guid>(type: "uuid", nullable: true),
						Label = table.Column<string>(type: "character varying", maxLength: 200, nullable: true),
						Header = table.Column<string>(type: "character varying", maxLength: 200, nullable: true),
						Class = table.Column<string>(type: "character varying", maxLength: 2000, nullable: true),
						IconName = table.Column<string>(type: "character varying", maxLength: 2000, nullable: true),
						IconClass = table.Column<string>(type: "character varying", maxLength: 2000, nullable: true),
						To = table.Column<string>(type: "character varying", maxLength: 2000, nullable: true),
						Url = table.Column<string>(type: "character varying", maxLength: 2000, nullable: true),
						Separator = table.Column<bool>(type: "boolean", nullable: false),
						Type = table.Column<string>(type: "character varying", maxLength: 100, nullable: true),
						Visible = table.Column<bool>(type: "boolean", nullable: false),
						Disabled = table.Column<bool>(type: "boolean", nullable: false),
						IsActive = table.Column<bool>(type: "boolean", nullable: false),
						Breadcrumb = table.Column<string>(type: "character varying", maxLength: 5000, nullable: true),
						PTID = table.Column<Guid>(type: "uuid", nullable: true),
						DisplayOrder = table.Column<int>(type: "integer", nullable: false)
					},
					constraints: table =>
					{
						table.PrimaryKey("PK_mtMenu", x => x.Id);
						table.ForeignKey(
											name: "FK_mtMenu_mtMenu_ParentId",
											column: x => x.ParentId,
											principalTable: "mtMenu",
											principalColumn: "Id");
					});

			migrationBuilder.CreateTable(
					name: "mtPrivilege",
					columns: table => new
					{
						PID = table.Column<Guid>(type: "uuid", nullable: false),
						Name = table.Column<string>(type: "character varying", maxLength: 500, nullable: false),
						Description = table.Column<string>(type: "character varying", maxLength: 1000, nullable: true),
						IsActive = table.Column<bool>(type: "boolean", nullable: false)
					},
					constraints: table =>
					{
						table.PrimaryKey("PK_mtPrivilege", x => x.PID);
					});

			migrationBuilder.CreateTable(
					name: "taMember",
					columns: table => new
					{
						MID = table.Column<Guid>(type: "uuid", nullable: false),
						Email = table.Column<string>(type: "character varying", maxLength: 500, nullable: false),
						Name = table.Column<string>(type: "character varying", maxLength: 500, nullable: true),
						Status = table.Column<int>(type: "integer", nullable: false),
						KeyCloakUserId = table.Column<string>(type: "character varying", nullable: true),
						DataJson = table.Column<string>(type: "character varying", nullable: true),
						IsActive = table.Column<bool>(type: "boolean", nullable: false),
						CreatedBy = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
						CreatedByName = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
						CreatedDate = table.Column<DateTime>(type: "timestamp without time zone", maxLength: 100, nullable: false),
						UpdatedBy = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
						UpdatedByName = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
						UpdatedDate = table.Column<DateTime>(type: "timestamp without time zone", maxLength: 100, nullable: false)
					},
					constraints: table =>
					{
						table.PrimaryKey("PK_taMember", x => x.MID);
					});

			migrationBuilder.CreateTable(
					name: "trRole",
					columns: table => new
					{
						RID = table.Column<Guid>(type: "uuid", nullable: false),
						Name = table.Column<string>(type: "character varying", maxLength: 500, nullable: false),
						Description = table.Column<string>(type: "character varying", maxLength: 1000, nullable: false),
						IsActive = table.Column<bool>(type: "boolean", nullable: false),
						CreatedBy = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
						CreatedByName = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
						CreatedDate = table.Column<DateTime>(type: "timestamp without time zone", maxLength: 100, nullable: false),
						UpdatedBy = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
						UpdatedByName = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
						UpdatedDate = table.Column<DateTime>(type: "timestamp without time zone", maxLength: 100, nullable: false)
					},
					constraints: table =>
					{
						table.PrimaryKey("PK_trRole", x => x.RID);
					});

			migrationBuilder.CreateTable(
					name: "mtPrivilegeItem",
					columns: table => new
					{
						PTID = table.Column<Guid>(type: "uuid", nullable: false),
						PID = table.Column<Guid>(type: "uuid", nullable: false),
						Name = table.Column<string>(type: "character varying", maxLength: 500, nullable: false),
						Description = table.Column<string>(type: "character varying", maxLength: 1000, nullable: true),
						Code = table.Column<string>(type: "character varying", maxLength: 1000, nullable: false),
						IsActive = table.Column<bool>(type: "boolean", nullable: false)
					},
					constraints: table =>
					{
						table.PrimaryKey("PK_mtPrivilegeItem", x => x.PTID);
						table.ForeignKey(
											name: "FK_mtPrivilegeItem_mtPrivilege_PID",
											column: x => x.PID,
											principalTable: "mtPrivilege",
											principalColumn: "PID",
											onDelete: ReferentialAction.Cascade);
					});

			migrationBuilder.CreateTable(
					name: "trInviteMember",
					columns: table => new
					{
						IMID = table.Column<Guid>(type: "uuid", nullable: false),
						MID = table.Column<Guid>(type: "uuid", nullable: false),
						InviteCode = table.Column<string>(type: "character varying", maxLength: 250, nullable: false),
						IsActive = table.Column<bool>(type: "boolean", nullable: false),
						CreatedBy = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
						CreatedByName = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
						CreatedDate = table.Column<DateTime>(type: "timestamp without time zone", maxLength: 100, nullable: false),
						UpdatedBy = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
						UpdatedByName = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
						UpdatedDate = table.Column<DateTime>(type: "timestamp without time zone", maxLength: 100, nullable: false)
					},
					constraints: table =>
					{
						table.PrimaryKey("PK_trInviteMember", x => x.IMID);
						table.ForeignKey(
											name: "FK_trInviteMember_taMember_MID",
											column: x => x.MID,
											principalTable: "taMember",
											principalColumn: "MID",
											onDelete: ReferentialAction.Cascade);
					});

			migrationBuilder.CreateTable(
					name: "trResetPassword",
					columns: table => new
					{
						RPID = table.Column<Guid>(type: "uuid", nullable: false),
						MID = table.Column<Guid>(type: "uuid", nullable: false),
						ResetPasswordCode = table.Column<string>(type: "character varying", maxLength: 250, nullable: false),
						IsActive = table.Column<bool>(type: "boolean", nullable: false),
						CreatedBy = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
						CreatedByName = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
						CreatedDate = table.Column<DateTime>(type: "timestamp without time zone", maxLength: 100, nullable: false),
						UpdatedBy = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
						UpdatedByName = table.Column<string>(type: "character varying", maxLength: 100, nullable: false),
						UpdatedDate = table.Column<DateTime>(type: "timestamp without time zone", maxLength: 100, nullable: false)
					},
					constraints: table =>
					{
						table.PrimaryKey("PK_trResetPassword", x => x.RPID);
						table.ForeignKey(
											name: "FK_trResetPassword_taMember_MID",
											column: x => x.MID,
											principalTable: "taMember",
											principalColumn: "MID",
											onDelete: ReferentialAction.Cascade);
					});

			migrationBuilder.CreateTable(
					name: "trRoleMember",
					columns: table => new
					{
						RID = table.Column<Guid>(type: "uuid", nullable: false),
						MID = table.Column<Guid>(type: "uuid", nullable: false),
						IsActive = table.Column<bool>(type: "boolean", nullable: false)
					},
					constraints: table =>
					{
						table.PrimaryKey("PK_trRoleMember", x => new { x.RID, x.MID });
						table.ForeignKey(
											name: "FK_trRoleMember_taMember_MID",
											column: x => x.MID,
											principalTable: "taMember",
											principalColumn: "MID",
											onDelete: ReferentialAction.Cascade);
						table.ForeignKey(
											name: "FK_trRoleMember_trRole_RID",
											column: x => x.RID,
											principalTable: "trRole",
											principalColumn: "RID",
											onDelete: ReferentialAction.Cascade);
					});

			migrationBuilder.CreateTable(
					name: "trRolePrivilegeItem",
					columns: table => new
					{
						RID = table.Column<Guid>(type: "uuid", nullable: false),
						PTID = table.Column<Guid>(type: "uuid", nullable: false),
						IsActive = table.Column<bool>(type: "boolean", nullable: false)
					},
					constraints: table =>
					{
						table.PrimaryKey("PK_trRolePrivilegeItem", x => new { x.RID, x.PTID });
						table.ForeignKey(
											name: "FK_trRolePrivilegeItem_mtPrivilegeItem_PTID",
											column: x => x.PTID,
											principalTable: "mtPrivilegeItem",
											principalColumn: "PTID",
											onDelete: ReferentialAction.Cascade);
						table.ForeignKey(
											name: "FK_trRolePrivilegeItem_trRole_RID",
											column: x => x.RID,
											principalTable: "trRole",
											principalColumn: "RID",
											onDelete: ReferentialAction.Cascade);
					});

			migrationBuilder.CreateIndex(
					name: "IX_mtMenu_ParentId",
					table: "mtMenu",
					column: "ParentId");

			migrationBuilder.CreateIndex(
					name: "IX_mtPrivilegeItem_PID",
					table: "mtPrivilegeItem",
					column: "PID");

			migrationBuilder.CreateIndex(
					name: "IX_trInviteMember_MID",
					table: "trInviteMember",
					column: "MID");

			migrationBuilder.CreateIndex(
					name: "IX_trResetPassword_MID",
					table: "trResetPassword",
					column: "MID");

			migrationBuilder.CreateIndex(
					name: "IX_trRoleMember_MID",
					table: "trRoleMember",
					column: "MID");

			migrationBuilder.CreateIndex(
					name: "IX_trRolePrivilegeItem_PTID",
					table: "trRolePrivilegeItem",
					column: "PTID");
		}

		/// <inheritdoc />
		protected override void Down(MigrationBuilder migrationBuilder)
		{
			migrationBuilder.DropTable(
					name: "HomeContent");

			migrationBuilder.DropTable(
					name: "mtAppConfig");

			migrationBuilder.DropTable(
					name: "mtMenu");

			migrationBuilder.DropTable(
					name: "trInviteMember");

			migrationBuilder.DropTable(
					name: "trResetPassword");

			migrationBuilder.DropTable(
					name: "trRoleMember");

			migrationBuilder.DropTable(
					name: "trRolePrivilegeItem");

			migrationBuilder.DropTable(
					name: "taMember");

			migrationBuilder.DropTable(
					name: "mtPrivilegeItem");

			migrationBuilder.DropTable(
					name: "trRole");

			migrationBuilder.DropTable(
					name: "mtPrivilege");
		}
	}
}
