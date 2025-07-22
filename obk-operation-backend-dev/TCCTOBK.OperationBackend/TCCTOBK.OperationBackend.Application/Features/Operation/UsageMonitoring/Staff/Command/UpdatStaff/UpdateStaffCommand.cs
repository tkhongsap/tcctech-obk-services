using MediatR;
using Org.BouncyCastle.Asn1.Cms;
using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Model;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.UsageMonitoring.Staff.Query.UpdateStaff;

public class UpdateStaffCommand : AuditableModel, IRequest<UpdateStaffResult>
{
	public required Guid Sfid { get; set; }
	public string? StaffName { get; set; }
	public string? Email { get; set; }
	public string? Component { get; set; }
	public string? Position { get; set; }
	public string? Company { get; set; }
	public string? Location { get; set; }
	public bool? MustUseOpsApp { get; set; }
}
