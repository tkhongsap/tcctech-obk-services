using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.Cases.Query.GetCaseById;
public class GetCaseByIdQuery : IQuery<GetCaseByIdResult>
{
	public int Id { get; set; }

	public GetCaseByIdQuery(int id)
	{
		Id = id;
	}
}
