using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Infrastructure;
using System.Diagnostics.CodeAnalysis;
using TCCTOBK.OperationBackend.Domain;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Application.Contracts;

public interface ITCCTOBKContext
{
	// Place entities here.
	public DbSet<trActivityProcedure> ActivityProcedure { get; }
	public DbSet<mtAppConfig> AppConfig { get; }
	public DbSet<mtMenu> AppMenu { get; }
	public DbSet<mtPrivilege> Privileges { get; }
	public DbSet<mtPrivilegeItem> PrivilegeItems { get; }
	public DbSet<trRole> Roles { get; }
	public DbSet<trFunctionRoleLocationSOC> FunctionRoleLocationSOC { get; }
	public DbSet<trFunctionRoleLocationMember> FunctionRoleLocationMember { get; }
	public DbSet<trRoleMember> RoleMembers { get; }
	public DbSet<trRolePrivilegeItem> RolePrivilegesItem { get; }
	public DbSet<taMember> Member { get; }
	public DbSet<trInviteMember> InviteMember { get; }
	public DbSet<trResetPassword> ResetPassword { get; }
	public DbSet<TimeSheet> TimeSheets { get; }
	public DbSet<TimeCardEntries> TimeCardEntries { get; }
	public DbSet<Tenant> Tenant { get; }
	public DbSet<TenantMember> TenantMember { get; }
	public DbSet<ClientSite> ClientSite { get; }
	public DbSet<ClientMember> ClientMember { get; }
	public DbSet<trAction> Action { get; }
	public DbSet<mtActionType> ActionType { get; }
	public DbSet<trSubtaskAction> SubtaskAction { get; }
	public DbSet<trSubtask> Subtask { get; }
	public DbSet<trTaskSubtask> TaskSubtask { get; }
	public DbSet<trTask> Task { get; }
	public DbSet<Location> Location { get; }
	public DbSet<SOCUser> SOCUser { get; }
	public DbSet<SOCUserTanent> SOCUserTanent { get; }
	public DbSet<SpotCoordinate> SpotCoordinate { get; }
	public DbSet<trRoleSOCUser> RoleSOCUser { get; }
	public DbSet<Unit> Unit { get; }
	public DbSet<WorkTransaction> WorkTransaction { get; }
	public DbSet<trSchedulePlan> SchedulePlan { get; }
	public DbSet<trMemberUAT> MemberUAT { get; }
	public DbSet<trAttendance> Attendance { get; }
	public DbSet<mtShift> Shift { get; }
	public DbSet<mtShiftManPowerRequest> ShiftManPowerRequest { get; }
	public DbSet<taFCMDevice> FCMDevice { get; }
	public DbSet<mtStaff> Staff { get; }
	public DbSet<EventsLog> Eventslog { get; }
	public DbSet<UsageLogMonitoring> UsageLogMonitoring { get; }
	public DbSet<trRoster> Roster { get; }
	//CMS Sustainability
	public DbSet<trSustainabilityBanner> SustainabilityBanner { get; }
	public DbSet<trSustainabilityCMS> SustainabilityCMS { get; }
	public DbSet<trSustainabilityCMSContent> SustainabilityCMSContent { get; }
	public DbSet<trSustainabilityLibrary> SustainabilityLibrary { get; }
	public DbSet<trSustainabilityLibraryFile> SustainabilityLibraryFile { get; }
	public DbSet<trSustainabilityPRBanner> SustainabilityPRBanner { get; }
	public DbSet<trSustainabilityConfig> SustainabilityConfig { get; }

	//Marcom
	public DbSet<trMarcomCMSExplore> MarcomCMSExplore { get; }
	public DbSet<trMarcomCMSExploreContent> MarcomCMSExploreContent { get; }
	public DbSet<trMarcomCMSTag> MarcomCMSTag { get; }
	public DbSet<trMarcomCMSWhatHappenCategory> MarcomCMSWhatHappenCategory { get; }
	public DbSet<trMarcomCMSWhatHappenContent> MarcomCMSWhatHappenContent { get; }
	public DbSet<trMarcomCMSWhatHappenSub> MarcomCMSWhatHappenSub { get; }
	public DbSet<trMarcomPRBanner> MarcomPRBanner { get; }
	public DbSet<trMarcomSpecialEvent> MarcomSpecialEvent { get; }
	public DbSet<trMarcomConfig> MarcomConfig { get; }

	//case mozart
	public DbSet<trCases> Cases { get; }
	public DbSet<trCaseMedias> CaseMedias { get; }
	public DbSet<trCaseTasks> CaseTasks { get; }

	//cwo mozart
	public DbSet<trCWOs> CWO { get; }
	//ppm mozart
	public DbSet<trPPMs> PPM { get; }

	// LBS
	public DbSet<mtBeacon> Beacons { get; }

	public DbSet<mtSREvent> SREvents { get; }
	public DbSet<mtSRProblem> SRProblems { get; }
	public DbSet<trServiceRequest> ServiceRequests { get; }

	// survey 
	public DbSet<trMarcomSurvey> MarcomSurvey { get; }
	public DbSet<trMarcomSurveySection> MarcomSurveySection { get; }
	public DbSet<trMarcomSurveyAnswer> MarcomSurveyAnswer { get; }
	public DbSet<trMarcomSurveyQuestionType> trMarcomSurveyQuestionTypes { get; }
	public DbSet<trMarcomSurveyQuestion> MarcomSurveyQuestion { get; }
	public DbSet<trMarcomSurveyAnswerDetail> MarcomSurveyAnswerDetail { get; }
	public DbSet<trMarcomSurveyQuestionSection> MarcomSurveyQuestionSection { get; }



	public DbSet<OpsAppNotification> OpsAppNotifications { get; }
	DbSet<TEntity> Set<[DynamicallyAccessedMembers(DynamicallyAccessedMemberTypes)] TEntity>() where TEntity : class;

	EntityEntry<TEntity> Entry<TEntity>(TEntity entity) where TEntity : class;

	Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);

	DbContext Instance { get; }

	public DatabaseFacade Database { get; }

	internal const DynamicallyAccessedMemberTypes DynamicallyAccessedMemberTypes =
		System.Diagnostics.CodeAnalysis.DynamicallyAccessedMemberTypes.PublicConstructors
		| System.Diagnostics.CodeAnalysis.DynamicallyAccessedMemberTypes.NonPublicConstructors
		| System.Diagnostics.CodeAnalysis.DynamicallyAccessedMemberTypes.PublicProperties
		| System.Diagnostics.CodeAnalysis.DynamicallyAccessedMemberTypes.PublicFields
		| System.Diagnostics.CodeAnalysis.DynamicallyAccessedMemberTypes.NonPublicProperties
		| System.Diagnostics.CodeAnalysis.DynamicallyAccessedMemberTypes.NonPublicFields
		| System.Diagnostics.CodeAnalysis.DynamicallyAccessedMemberTypes.Interfaces;

	void Dispose();
}
