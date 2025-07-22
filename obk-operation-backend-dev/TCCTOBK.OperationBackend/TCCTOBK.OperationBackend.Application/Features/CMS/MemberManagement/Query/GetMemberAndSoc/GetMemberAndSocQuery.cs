using TCCTOBK.OperationBackend.Application.Configuration.Queries;

namespace TCCTOBK.OperationBackend.Application.Features.CMS.MemberManagement.Query.GetMemberAndSoc;

public class GetMemberAndSocQuery : IQuery<GetMemberAndSocResult>
{
	public string MID { get; set; }
	public GetMemberAndSocQuery(string mid)
	{
		MID = mid;
	}
}
