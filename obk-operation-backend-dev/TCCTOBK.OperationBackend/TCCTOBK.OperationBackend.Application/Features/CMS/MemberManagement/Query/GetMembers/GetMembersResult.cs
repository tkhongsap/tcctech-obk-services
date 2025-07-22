using TCCTOBK.OperationBackend.Application.Features.CMS.MemberManagement.Query.GetMember;

namespace TCCTOBK.OperationBackend.Application.Features.CMS.MemberManagement.Query.GetMembers;
public record GetMembersResult(int TotalRecords, List<GetMemberResult> Data);