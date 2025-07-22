using TCCTOBK.OperationBackend.Application.Features.CMS.MemberManagement.Query.GetMember;

namespace TCCTOBK.OperationBackend.Application.Features.CMS.MemberManagement.Query.GetMemberKeyCloakUserId;

public class GetMemberKeyCloakUserIdResult : GetMemberResult
{
    public List<Guid> CSID { get; set; }
}