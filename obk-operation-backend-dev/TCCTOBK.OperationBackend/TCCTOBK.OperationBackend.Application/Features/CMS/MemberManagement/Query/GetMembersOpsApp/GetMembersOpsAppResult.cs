using TCCTOBK.OperationBackend.Application.Features.CMS.MemberManagement.Query.GetMember;

namespace TCCTOBK.OperationBackend.Application.Features.CMS.MemberManagement.Query.GetMembersOpsApp;
public record GetMembersOpsAppResult(int TotalRecords, List<GetMemberResult> Data);