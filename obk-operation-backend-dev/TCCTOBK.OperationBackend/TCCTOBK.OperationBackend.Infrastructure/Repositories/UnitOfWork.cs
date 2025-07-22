using Minio;
using System.Transactions;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Contracts.Minio;
using TCCTOBK.OperationBackend.Application.Helper.Service;
using TCCTOBK.OperationBackend.Domain.Entities;
using TCCTOBK.OperationBackend.Infrastructure;
using TCCTOBK.OperationBackend.Infrastructure.ObjectStorage;
using TCCTOBK.OperationBackend.Infrastructure.Repositories;

namespace TCCTOBK.OperationBackend.Application.Repositories;
public class UnitOfWork : IUnitOfWork
{
	private readonly ITCCTOBKContext _context;
	private readonly IMinioService _minioService;

	private readonly IClientSiteService _clientSiteService;

	private Lazy<ActivityProcedureRepository> _activityProcedureRepository => new Lazy<ActivityProcedureRepository>(() => new ActivityProcedureRepository(_context, _clientSiteService));
	private Lazy<AppConfigRepository> _appConfigRepository => new Lazy<AppConfigRepository>(() => new AppConfigRepository(_context));
	private Lazy<MenuRepository> _menuRepository => new Lazy<MenuRepository>(() => new MenuRepository(_context));
	private Lazy<MemberRepository> _memberRepository => new Lazy<MemberRepository>(() => new MemberRepository(_context, _clientSiteService));
	private Lazy<PrivilegeRepository> _privilegeRepository => new Lazy<PrivilegeRepository>(() => new PrivilegeRepository(_context));
	private Lazy<RoleRepository> _roleRepository => new Lazy<RoleRepository>(() => new RoleRepository(_context, _clientSiteService));
	private Lazy<InviteMemberRepository> _invitememberRepository => new Lazy<InviteMemberRepository>(() => new InviteMemberRepository(_context, _clientSiteService));
	private Lazy<HomeContentRepository> _homecontentRepository => new Lazy<HomeContentRepository>(() => new HomeContentRepository(_context));
	private Lazy<ResetPasswordRepository> _resetpasswordRepository => new Lazy<ResetPasswordRepository>(() => new ResetPasswordRepository(_context));
	private Lazy<SubtaskRepository> _subtaskRepository => new Lazy<SubtaskRepository>(() => new SubtaskRepository(_context));
	private Lazy<ActionRepository> _actionRepository => new Lazy<ActionRepository>(() => new ActionRepository(_context, _clientSiteService));
	private Lazy<SubtaskActionRepository> _subtaskActionRepository => new Lazy<SubtaskActionRepository>(() => new SubtaskActionRepository(_context, _minioService));
	private Lazy<ActionTypeRepository> _actionTypeRepository => new Lazy<ActionTypeRepository>(() => new ActionTypeRepository(_context));
	private Lazy<TaskRepository> _taskRepository => new Lazy<TaskRepository>(() => new TaskRepository(_context, _clientSiteService));
	private Lazy<TaskSubtaskRepository> _taskSubtaskRepository => new Lazy<TaskSubtaskRepository>(() => new TaskSubtaskRepository(_context));
	private Lazy<ILocationRepository> _locationRepository => new Lazy<ILocationRepository>(() => new LocationRepository(_context, _clientSiteService));
	private Lazy<ISOCUserRepository> _socUserRepository => new Lazy<ISOCUserRepository>(() => new SOCUserRepository(_context));
	private Lazy<ISpotCoordinateRepository> _spotCoordinateRepository => new Lazy<ISpotCoordinateRepository>(() => new SpotCoordinateRepository(_context));
	private Lazy<IUnitRepository> _unitRepository => new Lazy<IUnitRepository>(() => new UnitRepository(_context));
	private Lazy<IShiftRepository> _shiftRepository => new Lazy<IShiftRepository>(() => new ShiftRepository(_context, _clientSiteService));
	private Lazy<IShiftManPowerRequestRepository> _shiftManPowerRequestRepository => new Lazy<IShiftManPowerRequestRepository>(() => new ShiftManPowerRequestRepository(_context, _clientSiteService));

	private Lazy<IStaffRepository> _staffRepository => new Lazy<IStaffRepository>(() => new StaffRepository(_context, _clientSiteService));

	private Lazy<IEventsLogRepository> _eventsLogRepository => new Lazy<IEventsLogRepository>(() => new EventsLogRepository(_context, _clientSiteService));

	private Lazy<IRosterRepository> _rosterRepository => new Lazy<IRosterRepository>(() => new RosterRepository(_context, _clientSiteService));
	private Lazy<IAttendanceRepository> _attendanceRepository => new Lazy<IAttendanceRepository>(() => new AttendanceRepository(_context, _clientSiteService));

	private Lazy<IUsageLogMonitoringRepository> _uasgeLogMonitoring => new Lazy<IUsageLogMonitoringRepository>(() => new UsageMonitoringRepository(_context, _clientSiteService));
	private Lazy<IWorkTransactionRepository> _workTransactionRepository => new Lazy<IWorkTransactionRepository>(() => new WorkTransactionRepository(_context));
	private Lazy<SchedulePlanRepository> _schedulePlanRepository => new Lazy<SchedulePlanRepository>(() => new SchedulePlanRepository(_context, _clientSiteService));
	private Lazy<MemberUatRepository> _memberUatRepository => new Lazy<MemberUatRepository>(() => new MemberUatRepository(_context));
	private Lazy<SustainabilityRepository> _sustainabilityRepository => new Lazy<SustainabilityRepository>(() => new SustainabilityRepository(_context, _minioService));
	private Lazy<SustainabilityMobileRepository> _sustainabilityMobileRepository => new Lazy<SustainabilityMobileRepository>(() => new SustainabilityMobileRepository(_context));
	private Lazy<MarcomRepository> _marComRepository => new Lazy<MarcomRepository>(() => new MarcomRepository(_context, _minioService));
	private Lazy<MarcomMobileRepository> _marcomMobileRepository => new Lazy<MarcomMobileRepository>(() => new MarcomMobileRepository(_context));
	private Lazy<CasesRepository> _casesRepository => new Lazy<CasesRepository>(() => new CasesRepository(_context, _clientSiteService));
	private Lazy<CaseMediasRepository> _caseMediasRepository => new Lazy<CaseMediasRepository>(() => new CaseMediasRepository(_context));
	private Lazy<CaseTasksRepository> _caseTasksRepository => new Lazy<CaseTasksRepository>(() => new CaseTasksRepository(_context, _clientSiteService));
	private Lazy<ClientSiteRepository> _clientSiteRepository => new Lazy<ClientSiteRepository>(() => new ClientSiteRepository(_context));
	private Lazy<FCMRepository> _fcmRepository => new Lazy<FCMRepository>(() => new FCMRepository(_context, _clientSiteService));
	private Lazy<OpsAppNotificationRepository> _opsAppNotificationRepository => new Lazy<OpsAppNotificationRepository>(() => new OpsAppNotificationRepository(_context, _clientSiteService));
	private Lazy<CWORepository> _cwoRepository => new Lazy<CWORepository>(() => new CWORepository(_context, _clientSiteService));
	private Lazy<PPMRepository> _ppmRepository => new Lazy<PPMRepository>(() => new PPMRepository(_context, _clientSiteService));

	private Lazy<IBeaconRepository> _beaconRepository => new Lazy<IBeaconRepository>(() => new BeaconRepository(_context));
    
    private Lazy<SREventRepository> _sreeventRepository => new Lazy<SREventRepository>(() => new SREventRepository(_context));

    private Lazy<SREventRepository> _SREventRepository => new Lazy<SREventRepository>(() => new SREventRepository(_context));
    private Lazy<SRProblemRepository> _SRProblemRepository => new Lazy<SRProblemRepository>(() => new SRProblemRepository(_context));
    private Lazy<ServiceRequestRepository> _serviceRequestRepository => new Lazy<ServiceRequestRepository>(() => new ServiceRequestRepository(_context));

	public UnitOfWork(ITCCTOBKContext context, IMinioService minioService, IClientSiteService clientSiteService)
    {
        _context = context;
        _minioService = minioService;
        _clientSiteService = clientSiteService;
    }
	#region Repositories
	public IActivityProcedureRepository ActivityProcedureRepository => _activityProcedureRepository.Value;
	public IAppConfigRepository AppConfigRepository => _appConfigRepository.Value;
	public IMenuRepository MenuRepository => _menuRepository.Value;
	public IMemberRepository MemberRepository => _memberRepository.Value;
	public IPrivilegeRepository PrivilegeRepository => _privilegeRepository.Value;
	public IRoleRepository RoleRepository => _roleRepository.Value;
	public IInviteMemberRepository InviteMemberRepository => _invitememberRepository.Value;

	public IHomeContentRepository HomeContentRepository => _homecontentRepository.Value;

	public IResetPasswordRepository ResetPasswordRepository => _resetpasswordRepository.Value;
	public ISubtaskRepository SubtaskRepository => _subtaskRepository.Value;
	public IActionRepository ActionRepository => _actionRepository.Value;
	public ISubtaskActionRepository SubtaskActionRepository => _subtaskActionRepository.Value;
	public IActionTypeRepository ActionTypeRepository => _actionTypeRepository.Value;
	public ITaskRepository TaskRepository => _taskRepository.Value;
	public ITaskSubtaskRepository TaskSubtaskRepository => _taskSubtaskRepository.Value;
	public ILocationRepository LocationRepository => _locationRepository.Value;
	public ISOCUserRepository SOCUserRepository => _socUserRepository.Value;
	public ISpotCoordinateRepository SpotCoordinateRepository => _spotCoordinateRepository.Value;
	public IUnitRepository UnitRepository => _unitRepository.Value;
	public IWorkTransactionRepository WorkTransactionRepository => _workTransactionRepository.Value;
	public ISchedulePlanRepository SchedulePlanRepository => _schedulePlanRepository.Value;
	public IMemberUatRepository MemberUatRepository => _memberUatRepository.Value;
	public IShiftRepository ShiftRepository => _shiftRepository.Value;
	public IShiftManPowerRequestRepository ShiftManPowerRequestRepository => _shiftManPowerRequestRepository.Value;

	public IStaffRepository StaffRepository => _staffRepository.Value;
	public IEventsLogRepository EventsLogRepository => _eventsLogRepository.Value;
	public IRosterRepository RosterRepository => _rosterRepository.Value;

	public IAttendanceRepository AttendanceRepository => _attendanceRepository.Value;
	public ISustainabilityRepository SustainabilityRepository => _sustainabilityRepository.Value;
	public ISustainabilityMobileRepository SustainabilityMobileRepository => _sustainabilityMobileRepository.Value;
	public IMarcomRepository MarcomRepository => _marComRepository.Value;
	public IMarcomMobileRepository MarcomMobileRepository => _marcomMobileRepository.Value;
	public ICasesRepository CasesRepository => _casesRepository.Value;
	public ICaseMediasRepository CaseMediasRepository => _caseMediasRepository.Value;
	public ICaseTasksRepository CaseTasksRepository => _caseTasksRepository.Value;
	public IFCMRepository FCMRepository => _fcmRepository.Value;
	public IOpsAppNotificationRepository OpsAppNotificationRepository => _opsAppNotificationRepository.Value;
	public IUsageLogMonitoringRepository UsageMonitoringRepository => _uasgeLogMonitoring.Value;

	public IBeaconRepository BeaconRepository => _beaconRepository.Value;

	public ICWORepository CWORepository => _cwoRepository.Value;
	public IPPMRepository PPMRepository => _ppmRepository.Value;

    public ISREventRepository SREventRepository => _SREventRepository.Value;
    public ISRProblemRepository SRProblemRepository => _SRProblemRepository.Value;
    public IServiceRequestRepository ServiceRequestRepository => _serviceRequestRepository.Value;

	public IClientSiteRepository ClientSiteRepository => _clientSiteRepository.Value;

	#endregion



	public TransactionScope CreateTransaction(IsolationLevel level = IsolationLevel.ReadCommitted)
	{
		return new TransactionScope(TransactionScopeOption.Required,
			new TransactionOptions() { IsolationLevel = level, Timeout = new TimeSpan(0, 30, 0) },
			TransactionScopeAsyncFlowOption.Enabled);
	}

	public async Task SaveChangeAsyncWithCommit()
	{
		if (_context.Database.ProviderName != "Microsoft.EntityFrameworkCore.InMemory")
		{
			//_context.Database.SetCommandTimeout(120);
		}
		using (var trans = CreateTransaction())
		{
			await _context.SaveChangesAsync();
			trans.Complete();
		}
	}
}
