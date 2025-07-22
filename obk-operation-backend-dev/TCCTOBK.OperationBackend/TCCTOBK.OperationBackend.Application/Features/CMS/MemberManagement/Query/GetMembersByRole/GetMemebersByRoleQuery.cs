using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Features.CMS.MemberManagement.Query.GetMember;

namespace TCCTOBK.OperationBackend.Application.Features.CMS.MemberManagement.Query.GetMembersByRole;

public class GetMemebersByRoleQuery : IQuery<List<GetMemberResult>>
{
	public Guid RoleId { get; set; }

	public GetMemebersByRoleQuery(string roleId)
	{
		RoleId = Guid.Parse(roleId);
	}
}