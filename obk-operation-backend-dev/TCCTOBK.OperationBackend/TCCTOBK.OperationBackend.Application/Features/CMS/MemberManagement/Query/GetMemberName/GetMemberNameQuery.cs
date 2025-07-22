using TCCTOBK.OperationBackend.Application.Configuration.Queries;

namespace TCCTOBK.OperationBackend.Application.Features.CMS.MemberManagement.Query.GetMemberName;

public class GetMemberNameQuery : IQuery<string?>
{
	public string KeyCloakUserId { get; } = default!;

	public GetMemberNameQuery(string keyCloakUserId)
	{
		KeyCloakUserId = keyCloakUserId;
	}
}