using Microsoft.EntityFrameworkCore;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Helper.Service;
using TCCTOBK.OperationBackend.Domain;
using TCCTOBK.OperationBackend.Domain.Entities;
using TCCTOBK.OperationBackend.Infrastructure.SeedData;
//using TCCTOBK.OperationBackend.Infrastructure.Interceptors;

namespace TCCTOBK.OperationBackend.Infrastructure.Database;

public class TCCTOBKContext : DbContext, ITCCTOBKContext
{
	private readonly IClientSiteService _clientSiteService;
	public DbSet<mtAppConfig> AppConfig => Set<mtAppConfig>();
	public DbSet<mtMenu> AppMenu => Set<mtMenu>();
	public DbSet<mtPrivilege> Privileges => Set<mtPrivilege>();
	public DbSet<mtPrivilegeItem> PrivilegeItems => Set<mtPrivilegeItem>();
	public DbSet<trRole> Roles => Set<trRole>();
	public DbSet<trFunctionRoleLocationSOC> FunctionRoleLocationSOC => Set<trFunctionRoleLocationSOC>();
	public DbSet<trFunctionRoleLocationMember> FunctionRoleLocationMember => Set<trFunctionRoleLocationMember>();
	public DbSet<trRoleMember> RoleMembers => Set<trRoleMember>();
	public DbSet<trRolePrivilegeItem> RolePrivilegesItem => Set<trRolePrivilegeItem>();
	public DbSet<taMember> Member => Set<taMember>();
	public DbSet<trInviteMember> InviteMember => Set<trInviteMember>();
	public DbSet<mtHomeContent> HomeContent => Set<mtHomeContent>();
	public DbSet<trResetPassword> ResetPassword => Set<trResetPassword>();
	public DbSet<TimeSheet> TimeSheets => Set<TimeSheet>();
	public DbSet<TimeCardEntries> TimeCardEntries => Set<TimeCardEntries>();

	public DbSet<trAction> Action => Set<trAction>();
	public DbSet<mtActionType> ActionType => Set<mtActionType>();
	public DbSet<trActivityProcedure> ActivityProcedure => Set<trActivityProcedure>();
	public DbSet<trSubtaskAction> SubtaskAction => Set<trSubtaskAction>();
	public DbSet<trSubtask> Subtask => Set<trSubtask>();
	public DbSet<trTaskSubtask> TaskSubtask => Set<trTaskSubtask>();
	public DbSet<trTask> Task => Set<trTask>();
	public DbSet<mtShift> Shift => Set<mtShift>();
	public DbSet<mtStaff> Staff => Set<mtStaff>();
	public DbSet<EventsLog> Eventslog => Set<EventsLog>();
	public DbSet<UsageLogMonitoring> UsageLogMonitoring => Set<UsageLogMonitoring>();
	public DbSet<trRoster> Roster => Set<trRoster>();
	public DbSet<mtShiftManPowerRequest> ShiftManPowerRequest => Set<mtShiftManPowerRequest>();
	public DbSet<trAttendance> Attendance => Set<trAttendance>();
	public DbContext Instance => this;

	public DbSet<Tenant> Tenant => Set<Tenant>();

	public DbSet<TenantMember> TenantMember => Set<TenantMember>();

	public DbSet<Location> Location => Set<Location>();
	public DbSet<SOCUser> SOCUser => Set<SOCUser>();

	public DbSet<SOCUserTanent> SOCUserTanent => Set<SOCUserTanent>();

	public DbSet<SpotCoordinate> SpotCoordinate => Set<SpotCoordinate>();

	public DbSet<trRoleSOCUser> RoleSOCUser => Set<trRoleSOCUser>();

	public DbSet<Unit> Unit => Set<Unit>();

	public DbSet<WorkTransaction> WorkTransaction => Set<WorkTransaction>();
	public DbSet<trSchedulePlan> SchedulePlan => Set<trSchedulePlan>();
	public DbSet<trMemberUAT> MemberUAT => Set<trMemberUAT>();
	public DbSet<taFCMDevice> FCMDevice => Set<taFCMDevice>();

	//CMS Sustainability
	public DbSet<trSustainabilityBanner> SustainabilityBanner => Set<trSustainabilityBanner>();
	public DbSet<trSustainabilityCMS> SustainabilityCMS => Set<trSustainabilityCMS>();
	public DbSet<trSustainabilityCMSContent> SustainabilityCMSContent => Set<trSustainabilityCMSContent>();
	public DbSet<trSustainabilityLibrary> SustainabilityLibrary => Set<trSustainabilityLibrary>();
	public DbSet<trSustainabilityLibraryFile> SustainabilityLibraryFile => Set<trSustainabilityLibraryFile>();
	public DbSet<trSustainabilityPRBanner> SustainabilityPRBanner => Set<trSustainabilityPRBanner>();
	public DbSet<trSustainabilityConfig> SustainabilityConfig => Set<trSustainabilityConfig>();

	//Marcom
	public DbSet<trMarcomCMSExplore> MarcomCMSExplore => Set<trMarcomCMSExplore>();
	public DbSet<trMarcomCMSExploreContent> MarcomCMSExploreContent => Set<trMarcomCMSExploreContent>();
	public DbSet<trMarcomCMSTag> MarcomCMSTag => Set<trMarcomCMSTag>();
	public DbSet<trMarcomCMSWhatHappenCategory> MarcomCMSWhatHappenCategory => Set<trMarcomCMSWhatHappenCategory>();
	public DbSet<trMarcomCMSWhatHappenContent> MarcomCMSWhatHappenContent => Set<trMarcomCMSWhatHappenContent>();
	public DbSet<trMarcomCMSWhatHappenSub> MarcomCMSWhatHappenSub => Set<trMarcomCMSWhatHappenSub>();
	public DbSet<trMarcomPRBanner> MarcomPRBanner => Set<trMarcomPRBanner>();
	public DbSet<trMarcomSpecialEvent> MarcomSpecialEvent => Set<trMarcomSpecialEvent>();
	public DbSet<trMarcomConfig> MarcomConfig => Set<trMarcomConfig>();

	//case mozart
	public DbSet<trCases> Cases => Set<trCases>();
	public DbSet<trCaseMedias> CaseMedias => Set<trCaseMedias>();
	public DbSet<trCaseTasks> CaseTasks => Set<trCaseTasks>();
	public DbSet<ClientSite> ClientSite => Set<ClientSite>();
	public DbSet<ClientMember> ClientMember => Set<ClientMember>();
	public DbSet<OpsAppNotification> OpsAppNotifications => Set<OpsAppNotification>();

	public DbSet<mtBeacon> Beacons => Set<mtBeacon>();

	// cwo mozart
	public DbSet<trCWOs> CWO => Set<trCWOs>();
	// ppm mozart
	public DbSet<trPPMs> PPM => Set<trPPMs>();

	public DbSet<mtSREvent> SREvents => Set<mtSREvent>();
	public DbSet<mtSRProblem> SRProblems => Set<mtSRProblem>();
	public DbSet<trServiceRequest> ServiceRequests => Set<trServiceRequest>();


	// survey 
	public DbSet<trMarcomSurvey> MarcomSurvey => Set<trMarcomSurvey>();
	public DbSet<trMarcomSurveySection> MarcomSurveySection => Set<trMarcomSurveySection>();
	public DbSet<trMarcomSurveyAnswer> MarcomSurveyAnswer => Set<trMarcomSurveyAnswer>();
	public DbSet<trMarcomSurveyQuestionType> trMarcomSurveyQuestionTypes => Set<trMarcomSurveyQuestionType>();
	public DbSet<trMarcomSurveyQuestion> MarcomSurveyQuestion => Set<trMarcomSurveyQuestion>();
	public DbSet<trMarcomSurveyAnswerDetail> MarcomSurveyAnswerDetail => Set<trMarcomSurveyAnswerDetail>();
	public DbSet<trMarcomSurveyQuestionSection> MarcomSurveyQuestionSection => Set<trMarcomSurveyQuestionSection>();


	DbSet<Domain.WorkTransaction> ITCCTOBKContext.WorkTransaction => throw new NotImplementedException();


	public TCCTOBKContext(DbContextOptions<TCCTOBKContext> options, IClientSiteService clientSiteService)
				: base(options)
	{
		_clientSiteService = clientSiteService;

	}

	protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
	{
	}

	protected override void OnModelCreating(ModelBuilder modelBuilder)
	{
		modelBuilder.Entity<trRoleMember>().HasKey(e => new { e.RID, e.MID });
		modelBuilder.Entity<trRoleSOCUser>().HasKey(e => new { e.RID, e.SID });
		modelBuilder.Entity<trRolePrivilegeItem>().HasKey(e => new { e.RID, e.PTID });
		modelBuilder.Entity<TenantMember>().HasKey(e => new { e.CSID, e.MID, e.TID });
		modelBuilder.Entity<trMarcomSurveyQuestionSection>().HasKey(e => new { e.MSQID, e.MSSID });
		modelBuilder.Entity<SOCUserTanent>().HasKey(e => new { e.SID, e.TID });
		// modelBuilder.Entity<Tenant>().HasData(TenantSeedData.OBKCMS, TenantSeedData.OPAPP);
		modelBuilder.Entity<trSubtaskAction>().HasKey(e => new { e.Subtask, e.Action });
		modelBuilder.Entity<trTaskSubtask>().HasKey(e => new { e.Task, e.Subtask });
		modelBuilder.Entity<ClientSite>(entity =>
		{
			entity.HasKey(e => e.CSID);
		});
		modelBuilder.Entity<ClientSite>().HasData(
			new ClientSite
			{
				CSID = Constant.OBK_CLIENT_SITE,
				Name = "One Bangkok"
			}
		);
		modelBuilder.Entity<ClientSite>().HasData(
			new ClientSite
			{
				CSID = new Guid("9b84961b-1de6-445b-bd19-12430950d226"),
				Name = "The PARQ",
			}
		);
		modelBuilder.Entity<trRole>(entity =>
		{
			entity.Property(e => e.CSID)
					.HasDefaultValue(Constant.OBK_CLIENT_SITE);
		});
		modelBuilder.Entity<EventsLog>(entity =>
		{
			entity.Property(e => e.CSID)
					.HasDefaultValue(Constant.OBK_CLIENT_SITE);
		});
		modelBuilder.Entity<Location>(entity =>
		{
			entity.Property(e => e.CSID)
					.HasDefaultValue(Constant.OBK_CLIENT_SITE);
		});
		modelBuilder.Entity<mtAppConfig>(entity =>
		{
			entity.Property(e => e.CSID)
					.HasDefaultValue(Constant.OBK_CLIENT_SITE);
		});
		modelBuilder.Entity<mtMenu>(entity =>
		{
			entity.Property(e => e.CSID)
					.HasDefaultValue(Constant.OBK_CLIENT_SITE);
		});
		modelBuilder.Entity<mtPrivilege>(entity =>
		{
			entity.Property(e => e.CSID)
					.HasDefaultValue(Constant.OBK_CLIENT_SITE);
		});
		modelBuilder.Entity<mtShift>(entity =>
		{
			entity.Property(e => e.CSID)
					.HasDefaultValue(Constant.OBK_CLIENT_SITE);
		});
		modelBuilder.Entity<mtShiftManPowerRequest>(entity =>
		{
			entity.Property(e => e.CSID)
					.HasDefaultValue(Constant.OBK_CLIENT_SITE);
		});
		modelBuilder.Entity<mtStaff>(entity =>
		{
			entity.Property(e => e.CSID)
					.HasDefaultValue(Constant.OBK_CLIENT_SITE);
		});
		modelBuilder.Entity<OpsAppNotification>(entity =>
		{
			entity.Property(e => e.CSID)
					.HasDefaultValue(Constant.OBK_CLIENT_SITE);
		});
		modelBuilder.Entity<taFCMDevice>(entity =>
		{
			entity.Property(e => e.CSID)
					.HasDefaultValue(Constant.OBK_CLIENT_SITE);
		});
		modelBuilder.Entity<trAction>(entity =>
		{
			entity.Property(e => e.CSID)
					.HasDefaultValue(Constant.OBK_CLIENT_SITE);
		});
		modelBuilder.Entity<trActivityProcedure>(entity =>
		{
			entity.Property(e => e.CSID)
					.HasDefaultValue(Constant.OBK_CLIENT_SITE);
		});
		modelBuilder.Entity<trAttendance>(entity =>
		{
			entity.Property(e => e.CSID)
					.HasDefaultValue(Constant.OBK_CLIENT_SITE);
		});
		modelBuilder.Entity<trCases>(entity =>
		{
			entity.Property(e => e.CSID)
					.HasDefaultValue(Constant.OBK_CLIENT_SITE);
		});
		modelBuilder.Entity<trCWOs>(entity =>
		{
			entity.Property(e => e.CSID)
					.HasDefaultValue(Constant.OBK_CLIENT_SITE);
		});
		modelBuilder.Entity<trInviteMember>(entity =>
		{
			entity.Property(e => e.CSID)
					.HasDefaultValue(Constant.OBK_CLIENT_SITE);
		});
		modelBuilder.Entity<trRoster>(entity =>
		{
			entity.Property(e => e.CSID)
					.HasDefaultValue(Constant.OBK_CLIENT_SITE);
		});
		modelBuilder.Entity<trSchedulePlan>(entity =>
		{
			entity.Property(e => e.CSID)
					.HasDefaultValue(Constant.OBK_CLIENT_SITE);
		});

		modelBuilder.Entity<trTask>(entity =>
		{
			entity.Property(e => e.CSID)
					.HasDefaultValue(Constant.OBK_CLIENT_SITE);
		});
		modelBuilder.Entity<TenantMember>(entity =>
		{
			entity.Property(e => e.CSID)
					.HasDefaultValue(Constant.OBK_CLIENT_SITE);
		});

		modelBuilder.Entity<UsageLogMonitoring>(entity =>
		{
			entity.Property(e => e.CSID)
									.HasDefaultValue(Constant.OBK_CLIENT_SITE);
		});
		modelBuilder.Entity<trCaseTasks>(entity =>
		{
			entity.Property(e => e.CSID)
									.HasDefaultValue(Constant.OBK_CLIENT_SITE);
		});
		modelBuilder.Entity<trPPMs>(entity =>
		{
			entity.Property(e => e.CSID)
					.HasDefaultValue(Constant.OBK_CLIENT_SITE);
		});

		// modelBuilder.Entity<EventsLog>().Property(e => e.CSID).HasDefaultValue(Constant.OBK_CLIENT_SITE);
		// modelBuilder.Entity<trAction>().HasData(GuardTourSeedData.Actions);
		// modelBuilder.Entity<trTask>().HasData(GuardTourSeedData.Tasks);
		// modelBuilder.Entity<trSubtask>().HasData(GuardTourSeedData.Subtasks);
		// modelBuilder.Entity<trSubtaskAction>().HasData(GuardTourSeedData.SubtaskActions);
		// modelBuilder.Entity<trTaskSubtask>().HasData(GuardTourSeedData.TaskSubtasks);
		// modelBuilder.Entity<trRole>().HasData(RoleSeedData.Data);
		modelBuilder.Entity<Location>().HasData(GuardTourSeedData.Locations);
		modelBuilder.Entity<trSchedulePlan>().Property(s => s.StartTime).HasColumnType("TIME");
		modelBuilder.Entity<trSchedulePlan>().Property(s => s.EndTime).HasColumnType("TIME");
		modelBuilder.Entity<trSchedulePlan>().HasIndex(e => new { e.MID });
		modelBuilder.Entity<trActivityProcedure>().HasKey(e => new { e.Id });
		modelBuilder.Entity<trActivityProcedure>().HasKey(e => new { e.Code, e.CSID });

		modelBuilder.Entity<trSchedulePlan>().HasKey(e => new { e.Id, e.CSID });

		modelBuilder.Entity<trSchedulePlan>()
				.HasOne(e => e.trActivityProcedure)
				.WithMany(e => e.trSchedulePlans)
				.HasForeignKey(e => new { e.Route, e.CSID });
		modelBuilder.Entity<taFCMDevice>().HasIndex(x => new { x.MemberId });
		modelBuilder.Entity<trCases>().HasIndex(e => new { e.StatusCode });
		modelBuilder.Entity<trCases>().HasIndex(e => new { e.CaseNo });
		modelBuilder.Entity<trCases>().HasIndex(e => new { e.SyncStatus });
		modelBuilder.Entity<trCases>().HasIndex(e => new { e.CreatedOn }).IsDescending();
		modelBuilder.Entity<trCases>().HasIndex(e => new { e.CreatedOn, e.Id }).IsDescending(true, false);
		modelBuilder.Entity<trCases>().HasKey(e => new { e.CSID, e.Id });
		//modelBuilder.Entity<Location>().HasKey(e => new { e.CSID, e.RefId });
		modelBuilder.Entity<trCaseTasks>().HasIndex(e => new { e.StatusCode });
		modelBuilder.Entity<trCaseTasks>().HasIndex(e => new { e.AssignedStaffId });
		modelBuilder.Entity<trCaseTasks>().HasIndex(e => new { e.CaseId, e.AssignedStaffId });
		modelBuilder.Entity<trCaseTasks>().HasKey(e => new { e.CSID, e.Id });
		modelBuilder.Entity<trCaseTasks>().HasOne(e => e.trCases).WithMany(e => e.trCaseTasks).HasForeignKey(e => new { e.CSID, e.CaseId });
		modelBuilder.Entity<trCWOs>().HasIndex(e => new { e.TechnicianId });
		modelBuilder.Entity<trCWOs>().HasIndex(e => new { e.SupervisorId });
		modelBuilder.Entity<trCWOs>().HasIndex(e => new { e.StatusId });
		modelBuilder.Entity<trCWOs>().HasKey(e => new { e.CSID, e.Id });
		//modelBuilder.Entity<trCWOs>().HasOne(e => e.Locations).WithMany(e => e.trCWOs).HasForeignKey(e => new { e.CSID, e.LocationId });
		modelBuilder.Entity<trPPMs>().HasIndex(e => new { e.SupervisorId });
		modelBuilder.Entity<trPPMs>().HasIndex(e => new { e.TechniciansAssignedBy });
		modelBuilder.Entity<trPPMs>().HasIndex(e => new { e.StatusId });
		modelBuilder.Entity<trPPMs>().HasKey(e => new { e.CSID, e.Id });
		//modelBuilder.Entity<trPPMs>().HasOne(e => e.Locations).WithMany(e => e.trPPMs).HasForeignKey(e => new { e.CSID, e.LocationId });

		// modelBuilder.Entity<mtShift>().HasData(GuardTourSeedData.Shifts);
		// modelBuilder.Entity<mtShiftManPowerRequest>().HasData(GuardTourSeedData.ShiftManPowerRequest);

		// gobal client site filter
		//modelBuilder.Entity<mtAppConfig>().HasQueryFilter(e => e.CSID == _clientSiteService.ClientSiteId);
		// modelBuilder.Entity<trRole>().HasQueryFilter(e => e.CSID == _clientSiteService.ClientSiteId);
		modelBuilder.Entity<EventsLog>().HasQueryFilter(e => e.CSID == _clientSiteService.ClientSiteId);
		modelBuilder.Entity<Location>().HasQueryFilter(e => e.CSID == _clientSiteService.ClientSiteId);
		modelBuilder.Entity<mtAppConfig>().HasQueryFilter(e => e.CSID == _clientSiteService.ClientSiteId);
		// modelBuilder.Entity<mtMenu>().HasQueryFilter(e => e.CSID == _clientSiteService.ClientSiteId);
		// modelBuilder.Entity<mtPrivilege>().HasQueryFilter(e => e.CSID == _clientSiteService.ClientSiteId);
		modelBuilder.Entity<mtShift>().HasQueryFilter(e => e.CSID == _clientSiteService.ClientSiteId);
		modelBuilder.Entity<mtShiftManPowerRequest>().HasQueryFilter(e => e.CSID == _clientSiteService.ClientSiteId);
		modelBuilder.Entity<mtStaff>().HasQueryFilter(e => e.CSID == _clientSiteService.ClientSiteId);
		//modelBuilder.Entity<OpsAppNotification>().HasQueryFilter(e => e.CSID == _clientSiteService.ClientSiteId);
		//modelBuilder.Entity<taFCMDevice>().HasQueryFilter(e => e.CSID == _clientSiteService.ClientSiteId);
		modelBuilder.Entity<trAction>().HasQueryFilter(e => e.CSID == _clientSiteService.ClientSiteId);
		modelBuilder.Entity<trActivityProcedure>().HasQueryFilter(e => e.CSID == _clientSiteService.ClientSiteId);
		modelBuilder.Entity<trAttendance>().HasQueryFilter(e => e.CSID == _clientSiteService.ClientSiteId);
		modelBuilder.Entity<trCases>().HasQueryFilter(e => e.CSID == _clientSiteService.ClientSiteId);
		modelBuilder.Entity<trCWOs>().HasQueryFilter(e => e.CSID == _clientSiteService.ClientSiteId);
		// modelBuilder.Entity<trInviteMember>().HasQueryFilter(e => e.CSID == _clientSiteService.ClientSiteId);
		modelBuilder.Entity<trRoster>().HasQueryFilter(e => e.CSID == _clientSiteService.ClientSiteId);
		modelBuilder.Entity<trSchedulePlan>().HasQueryFilter(e => e.CSID == _clientSiteService.ClientSiteId);
		modelBuilder.Entity<trPPMs>().HasQueryFilter(e => e.CSID == _clientSiteService.ClientSiteId);
		modelBuilder.Entity<trTask>().HasQueryFilter(e => e.CSID == _clientSiteService.ClientSiteId);
		//modelBuilder.Entity<TenantMember>().HasQueryFilter(e => e.CSID == _clientSiteService.ClientSiteId);
		modelBuilder.Entity<UsageLogMonitoring>().HasQueryFilter(e => e.CSID == _clientSiteService.ClientSiteId);
		modelBuilder.Entity<trCaseTasks>().HasQueryFilter(e => e.CSID == _clientSiteService.ClientSiteId);
		modelBuilder.Entity<mtMenu>().HasData(MenuSeedData.Data);
	}
}
