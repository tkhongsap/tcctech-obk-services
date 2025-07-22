using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Helper.Table;

namespace TCCTOBK.OperationBackend.Application.Features.CMS.MemberManagement.Query.GetMembers;

public class GetMembersQuery : TableState, IQuery<GetMembersResult>
{
	public string? Filter { get; set; }
	public List<Guid> Roles { get; set; } = new();
	public int? Status { get; set; }
	public bool IsAvailable { get; set; } = false;
	public List<Guid>? TenantIds { get; set; }
}
