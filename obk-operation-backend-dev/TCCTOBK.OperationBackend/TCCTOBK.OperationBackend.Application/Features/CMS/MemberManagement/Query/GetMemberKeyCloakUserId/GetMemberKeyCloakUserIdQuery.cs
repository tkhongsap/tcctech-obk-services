using TCCTOBK.OperationBackend.Application.Configuration.Queries;

namespace TCCTOBK.OperationBackend.Application.Features.CMS.MemberManagement.Query.GetMemberKeyCloakUserId;

public record GetMemberKeyCloakUserIdQuery(string keyCloakUserId) : IQuery<GetMemberKeyCloakUserIdResult>;