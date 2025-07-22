using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Domain.Entities;
using TCCTOBK.OperationBackend.Domain;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.UsageMonitoring.Query.Summary;
public class SummaryHandler : IQueryHandler<SummaryQuery, UsageLogMonitoring>
{

	IUnitOfWork _uow;
	public SummaryHandler(IUnitOfWork uow)
	{
		_uow = uow;
	}

	public async Task<UsageLogMonitoring> Handle(SummaryQuery request, CancellationToken cancellationToken)
	{
		var timeReq = request.Date.AddHours(7).Date;
		var checkData = await _uow.UsageMonitoringRepository.GetByDate(timeReq.ToString());
		var timeNow = DateTime.UtcNow.AddHours(7).Date;

		if (timeReq > timeNow)
		{
			throw new Exception("Date is invalid");
		}

		return new UsageLogMonitoring
		{
			Id = checkData.Id,
			FixedDailyUserTarget = checkData.FixedDailyUserTarget,
			AtcualActiveDailyUser = checkData.AtcualActiveDailyUser,
			TotlaOnGroundStaffMustUseOpsApp = checkData.TotlaOnGroundStaffMustUseOpsApp,
			TotalDalilyOnGroundStaffMustUseOpsAppWithRegister = checkData.TotalDalilyOnGroundStaffMustUseOpsAppWithRegister,
			TotalDalilyOnGroundStaffMustUseOpsAppWithOutRegister = checkData.TotalDalilyOnGroundStaffMustUseOpsAppWithOutRegister,
			Component = checkData.Component,
			Statistics = checkData.Statistics,
			SyncDate = checkData.SyncDate,
			AllStaff = checkData.AllStaff,
			CreatedAt = checkData.CreatedAt
		};
	}
}
