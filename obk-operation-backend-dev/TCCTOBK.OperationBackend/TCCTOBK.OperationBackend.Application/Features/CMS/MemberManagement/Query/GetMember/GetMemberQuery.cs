using TCCTOBK.OperationBackend.Application.Configuration.Queries;

namespace TCCTOBK.OperationBackend.Application.Features.CMS.MemberManagement.Query.GetMember;

public class GetMemberQuery : IQuery<GetMemberResult>
{
	public string MID { get; set; }
	public GetMemberQuery(string mid)
	{
		MID = mid;
	}
}
