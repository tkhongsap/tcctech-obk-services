using System.Text.Json;
using NPOI.Util;
using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Contracts.DataModel.EventsLogRepository;
using TCCTOBK.OperationBackend.Application.Contracts.DataModel.RosterRepository;
using TCCTOBK.OperationBackend.Application.Contracts.DataModel.StaffRepository;
using TCCTOBK.OperationBackend.Domain;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.UsageMonitoring.Query.SyncSummary;
public class SyncSummaryHandler : IQueryHandler<SyncSummaryQuery, UsageLogMonitoring>
{

	IUnitOfWork _uow;
	public SyncSummaryHandler(IUnitOfWork uow)
	{
		_uow = uow;
	}

	public async Task<UsageLogMonitoring> Handle(SyncSummaryQuery request, CancellationToken cancellationToken)
	{
		var timeReq = request.Date.AddHours(7).Date;
		var staffOpsApp = await _uow.StaffRepository.GetAllLog();
		var roster = await _uow.RosterRepository.GetRosterWithActive();
		var eventLoguser = await _uow.EventsLogRepository.CountGroupUserList(timeReq);

		var idsStaffOpsApp = new List<Guid>();
        var staffMustUseOpsAppCount = 0;
		var idsStaffNotMustUseOpsApp = new List<Guid>();
		int atcualActiveDailyUser = 0;
		int totalDailyOnGroundMustUseOpsApp = 0;
		int totalDailyOnGroundNotMustUseOpsApp = 0;
		var component = new Dictionary<string, ComponentStaffModel>();
		var fixedDailyUserTarget = new SumWeekDayWeekEndModel();
		var allStaff = new List<StaffWithLoginToDayModel>();
		foreach (var item in roster)
		{
			if (!component.ContainsKey(item.Component))
			{
				component[item.Component] = new ComponentStaffModel();
				component[item.Component].Staffs = new List<StaffWithLoginToDayModel>();
				component[item.Component].ActualLogin = 0;
				component[item.Component].WeekDay = item.WeekDay;
				component[item.Component].WeekEnd = item.WeekEnd;
				fixedDailyUserTarget.WeekDay += item.WeekDay ?? 0;
				fixedDailyUserTarget.WeekEnd += item.WeekEnd ?? 0;
			}

		}
		foreach (var item in staffOpsApp)
		{
			var staff = new StaffWithLoginToDayModel
			{
				Sfid = item.Sfid,
				Email = item.Email,
				Component = item.Component,
				KeyCloakUserId = item.KeyCloakUserId,
				StaffName = item.StaffName,
				MustUseOpsApp = item.MustUseOpsApp,
				Location = item.Location,
				Position = item.Position,
				Company = item.Company,
			};
			if (!component.ContainsKey(item.Component))
			{
				continue;
			}
			if (item.KeyCloakUserId == Guid.Empty.ToString())
			{
                if (item.MustUseOpsApp == true)
                {
                    staffMustUseOpsAppCount++;
                    totalDailyOnGroundNotMustUseOpsApp++;
                }
            
				staff.LoginToDay = false;
				allStaff.Add(staff);
				component[item.Component].Staffs.Add(staff);
			}
			else
			{
				if (item.MustUseOpsApp == true)
				{
                    staffMustUseOpsAppCount++;
                    var checkLogintoDay = eventLoguser.FirstOrDefault(x => x.Username == Guid.Parse(item.KeyCloakUserId));
                    var checkTenant = await checkMustOpsAppAsync(item.Email);
                    if (checkTenant)
                    {
                        totalDailyOnGroundMustUseOpsApp++;
                    }
                    else
                    {
                        totalDailyOnGroundNotMustUseOpsApp++;
                    }

					if (checkLogintoDay != null)
					{
						staff.LoginToDay = true;
						component[item.Component].Staffs.Add(staff);
						allStaff.Add(staff);
						component[item.Component].ActualLogin++;
					}
					else
					{
						staff.LoginToDay = false;
						component[item.Component].Staffs.Add(staff);
						allStaff.Add(staff);
					}
				}
				else
				{
                    totalDailyOnGroundNotMustUseOpsApp++;
					staff.LoginToDay = false;
					component[item.Component].Staffs.Add(staff);
					allStaff.Add(staff);
				}

			}

			idsStaffOpsApp.Add(Guid.Parse(item.KeyCloakUserId));
			var checkAtcualActiveDailyUser = eventLoguser.FirstOrDefault(x => x.Username == Guid.Parse(item.KeyCloakUserId));
			if (checkAtcualActiveDailyUser != null)
			{
				atcualActiveDailyUser++;
			}
		}

		var statisticsResult = new List<StatisticsResultModel>();
		for (int i = 1; i <= 7; i++)
		{
			var sevenDaysAgo = timeReq.AddDays(-i);
			var eventLoguser7Day = await _uow.EventsLogRepository.CountGroupUserList(sevenDaysAgo);
			var countIn7Day = 0;
			foreach (var item in idsStaffOpsApp)
			{
				if (eventLoguser7Day.FirstOrDefault(x => x.Username == item) != null)
				{
					countIn7Day++;
				}
			}
			var dInDay = new StatisticsResultModel()
			{
				Date = sevenDaysAgo.ToString("ddd") + " " + sevenDaysAgo.ToString("dd-MMM-yy"),
				Count = countIn7Day,
				TypeDay = HasWeekend(sevenDaysAgo) ? "Weekend" : "Weekday"
			};
			statisticsResult.Add(dInDay);
		}
		var save = new UsageLogMonitoring
		{
			FixedDailyUserTarget = HasWeekend(timeReq) ? fixedDailyUserTarget.WeekEnd : fixedDailyUserTarget.WeekDay,
            AtcualActiveDailyUser = atcualActiveDailyUser,
			TotlaOnGroundStaffMustUseOpsApp = staffMustUseOpsAppCount,
			TotalDalilyOnGroundStaffMustUseOpsAppWithRegister = totalDailyOnGroundMustUseOpsApp,
			TotalDalilyOnGroundStaffMustUseOpsAppWithOutRegister = totalDailyOnGroundNotMustUseOpsApp,
			Component = JsonSerializer.Serialize(component),
			Statistics = JsonSerializer.Serialize(statisticsResult),
			AllStaff = JsonSerializer.Serialize(allStaff),
			SyncDate = timeReq.ToString(),
			SumWeekDay = fixedDailyUserTarget.WeekDay,
			SumWeekEnd = fixedDailyUserTarget.WeekEnd
		};
		var checkData = await _uow.UsageMonitoringRepository.GetByDate(timeReq.ToString());
		if (checkData != null)
		{
			save.Id = checkData.Id;
			save.CreatedAt = request.Date;
			await _uow.UsageMonitoringRepository.UpdateUsageMonitoring(save, timeReq.ToString());
		}
		else
		{
			save.CreatedAt = request.Date;
			await _uow.UsageMonitoringRepository.CreateUsageMonitoring(save, timeReq);
		}

		await _uow.SaveChangeAsyncWithCommit();
		return save;

	}



	private bool HasWeekend(DateTime date)
	{
		if (date.DayOfWeek == DayOfWeek.Saturday || date.DayOfWeek == DayOfWeek.Sunday)
		{
			return true;
		}
		return false;
	}

	private async Task<bool> checkMustOpsAppAsync(string email)
	{
		var memberFind = await _uow.MemberRepository.GetByEmailLower(email);
		var socFind = await _uow.SOCUserRepository.GetByEmailLowerWithOutError(email);
		if (socFind.KeyCloakUserId == null)
		{
			if (memberFind.tenantMembers.Any(x => x.TID == Constant.TENANT_OPERATION_APP_ID))
			{
				return true;
			}
			return false;

		}
		else
		{
			var tenant = await _uow.SOCUserRepository.CheckTenant(socFind.Id, Constant.TENANT_OPERATION_APP_ID);
			if (tenant)
			{
				return true;
			}
			return false;
		}
	}
}
