
using System.Text.Json;
using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Contracts.DataModel.StaffRepository;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.UsageMonitoring.Staff.Query.GetStaffByComponent;
public class GetStaffByComponentHandler : IQueryHandler<GetStaffByComponentQuery, List<StaffWithLoginToDayModel>>
{

	IUnitOfWork _uow;
	public GetStaffByComponentHandler(IUnitOfWork uow)
	{
		_uow = uow;
	}
	public async Task<List<StaffWithLoginToDayModel>> Handle(GetStaffByComponentQuery request, CancellationToken cancellationToken)
	{
		var timeReq = request.Date.AddHours(7).Date;
		var checkData = await _uow.UsageMonitoringRepository.GetByDate(timeReq.ToString());
		var timeNow = DateTime.UtcNow.AddHours(7).Date;

		if (timeReq > timeNow)
		{
			throw new Exception("Date is invalid");
		}
		return JsonSerializer.Deserialize<List<StaffWithLoginToDayModel>>(checkData.AllStaff);
	}
}
