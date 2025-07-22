using TCCTOBK.OperationBackend.Application.Configuration.Queries;

namespace TCCTOBK.OperationBackend.Application.Features.CMS.RoleManagement.Query.GetPrivileges;

public class GetPrivilegesQuery : IQuery<List<GetPrivilegesResult>>
{
	public string? Filter { get; set; } = default!;
	public Guid? Privileges { get; set; } = default!;
	public int Skip { get; set; } = 0;
	public int? Take { get; set; }
}
