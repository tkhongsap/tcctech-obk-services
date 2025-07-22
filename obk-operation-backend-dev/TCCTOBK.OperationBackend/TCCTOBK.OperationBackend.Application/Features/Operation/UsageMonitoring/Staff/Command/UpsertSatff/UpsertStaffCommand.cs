using MediatR;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.UsageMonitoring.Staff.Command.UpsertStaff;

public class UpsertStaffCommand : AuditableModel, IRequest<UpsertStaffResult>
{
	public required List<ListStaff> Data { get; set; }
}
public class ListStaff
{
	public Guid? Sfid { get; set; }
	public string? StaffName { get; set; }
	public string? Email { get; set; }
	public string? Component { get; set; }
	public string? Position { get; set; }
	public string? Company { get; set; }
	public string? Location { get; set; }
	public bool? MustUseOpsApp { get; set; }
	public string? KeyCloakUserId { get; set; }
	public bool? IsDeleted { get; set; } = false;
	public bool? IsActive { get; set; } = true;
}
