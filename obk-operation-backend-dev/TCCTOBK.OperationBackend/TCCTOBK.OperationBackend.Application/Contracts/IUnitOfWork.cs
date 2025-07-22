using System.Transactions;

namespace TCCTOBK.OperationBackend.Application.Contracts;
public interface IUnitOfWork
{
	public IActivityProcedureRepository ActivityProcedureRepository { get; }
	public IAppConfigRepository AppConfigRepository { get; }
	public IMenuRepository MenuRepository { get; }
	public IMemberRepository MemberRepository { get; }
	public IPrivilegeRepository PrivilegeRepository { get; }
	public IRoleRepository RoleRepository { get; }
	public IInviteMemberRepository InviteMemberRepository { get; }
	public IHomeContentRepository HomeContentRepository { get; }
	public IResetPasswordRepository ResetPasswordRepository { get; }
	public ISubtaskRepository SubtaskRepository { get; }
	public IActionRepository ActionRepository { get; }
	public ISubtaskActionRepository SubtaskActionRepository { get; }
	public IActionTypeRepository ActionTypeRepository { get; }
	public ITaskRepository TaskRepository { get; }
	public ITaskSubtaskRepository TaskSubtaskRepository { get; }
	public ILocationRepository LocationRepository { get; }
	public ISOCUserRepository SOCUserRepository { get; }
	public ISpotCoordinateRepository SpotCoordinateRepository { get; }
	public IUnitRepository UnitRepository { get; }
	public IWorkTransactionRepository WorkTransactionRepository { get; }
	public ISchedulePlanRepository SchedulePlanRepository { get; }
	public IMemberUatRepository MemberUatRepository { get; }
	public IShiftRepository ShiftRepository { get; }
	public IStaffRepository StaffRepository { get; }
	public IEventsLogRepository EventsLogRepository { get; }
	public IRosterRepository RosterRepository { get; }
	public IShiftManPowerRequestRepository ShiftManPowerRequestRepository { get; }
	public IAttendanceRepository AttendanceRepository { get; }
	public ISustainabilityRepository SustainabilityRepository { get; }
	public ISustainabilityMobileRepository SustainabilityMobileRepository { get; }
	public IMarcomRepository MarcomRepository { get; }
	public IMarcomMobileRepository MarcomMobileRepository { get; }
	public ICasesRepository CasesRepository { get; }
	public ICaseMediasRepository CaseMediasRepository { get; }
	public ICaseTasksRepository CaseTasksRepository { get; }
	public IFCMRepository FCMRepository { get; }
	public IOpsAppNotificationRepository OpsAppNotificationRepository { get; }
	public IUsageLogMonitoringRepository UsageMonitoringRepository { get; }
	public ICWORepository CWORepository { get; }
	public IClientSiteRepository ClientSiteRepository { get; }
	public IBeaconRepository BeaconRepository { get; }
	public IPPMRepository PPMRepository { get; }
    public ISREventRepository SREventRepository { get; }
    public ISRProblemRepository SRProblemRepository { get; }

    public IServiceRequestRepository ServiceRequestRepository { get; }

	public Task SaveChangeAsyncWithCommit();
	TransactionScope CreateTransaction(IsolationLevel level = IsolationLevel.ReadCommitted);
}
