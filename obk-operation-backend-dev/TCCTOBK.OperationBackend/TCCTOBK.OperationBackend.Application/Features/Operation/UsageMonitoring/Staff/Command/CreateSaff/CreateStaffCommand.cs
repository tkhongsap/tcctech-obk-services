using MediatR;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.UsageMonitoring.Staff.Query.CreateStaff;

public class CreateStaffCommand : AuditableModel, IRequest<CreateStaffResult>
{
	public string? StaffName { get; set; }
	public string? Email { get; set; }
	public string? Component { get; set; }
	public string? Position { get; set; }
	public string? Company { get; set; }
	public string? Location { get; set; }
	public bool? MustUseOpsApp { get; set; }
}
