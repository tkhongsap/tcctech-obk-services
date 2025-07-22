using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Features.CMS.MemberManagement.Query.GetMemberAndSoc;

namespace TCCTOBK.OperationBackend.Application.Features.CMS.MemberManagement.Query.GetMemberAndSocWithOutActive;

public class GetMemberAndSocWithOutActiveQuery : IQuery<GetMemberAndSocWithOutActiveResult>
{
	public string MID { get; set; }
	public GetMemberAndSocWithOutActiveQuery(string mid)
	{
		MID = mid;
	}
}
