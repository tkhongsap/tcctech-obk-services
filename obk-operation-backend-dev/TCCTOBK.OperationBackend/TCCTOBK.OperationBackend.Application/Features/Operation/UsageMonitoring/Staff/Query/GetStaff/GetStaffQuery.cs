using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Domain;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.UsageMonitoring.Staff.Query.GetStaff;
public class GetStaffQuery : IQuery<mtStaff>
{
	public Guid Sfid { get; set; }
	public GetStaffQuery(Guid sfid)
	{
		Sfid = sfid;
	}
}