using System.Text.Json;
using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Contracts.API;
using TCCTOBK.OperationBackend.Application.Contracts.DataModel.RosterRepository;
using TCCTOBK.OperationBackend.Application.Contracts.DataModel.StaffRepository;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.UsageMonitoring.Roster.Query.GetRosterStaff;
public class GetRosterStaffHandler : IQueryHandler<GetRosterStaffQuery, List<StaffWithLoginToDayModel>>
{
	IUnitOfWork _uow;
	public GetRosterStaffHandler(IUnitOfWork uow)
	{
		_uow = uow;

	}
	public async Task<List<StaffWithLoginToDayModel>> Handle(GetRosterStaffQuery request, CancellationToken cancellationToken)
	{
		var timeReq = request.Date.AddHours(7).Date;
		var checkData = await _uow.UsageMonitoringRepository.GetByDate(timeReq.ToString());
		var timeNow = DateTime.UtcNow.AddHours(7).Date;

		if (timeReq > timeNow)
		{
			throw new Exception("Date is invalid");
		}
		var componentStaffDict = JsonSerializer.Deserialize<Dictionary<string, ComponentStaffModel>>(checkData.Component);
		List<StaffWithLoginToDayModel> staff = componentStaffDict[request.Component].Staffs;
        return staff;
	}
}
