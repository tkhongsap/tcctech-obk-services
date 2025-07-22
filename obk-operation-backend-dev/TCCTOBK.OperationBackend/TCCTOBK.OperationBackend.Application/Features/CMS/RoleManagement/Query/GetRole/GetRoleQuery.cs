using TCCTOBK.OperationBackend.Application.Configuration.Queries;

namespace TCCTOBK.OperationBackend.Application.Features.CMS.RoleManagement.Query.GetRole;

public class GetRoleQuery : IQuery<GetRoleResult>
{
	public string Id { get; set; } = default!;
	public GetRoleQuery(string id)
	{
		Id = id;
	}
}
