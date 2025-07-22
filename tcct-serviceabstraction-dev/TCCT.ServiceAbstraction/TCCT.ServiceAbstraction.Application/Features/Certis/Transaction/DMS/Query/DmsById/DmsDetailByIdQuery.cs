using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.DMS.Query.DmsById;
public class DmsDetailByIdQuery : IQuery<DmsDetailByIdResult>
{
	public int Id { get; set; }
	public DmsDetailByIdQuery(int id)
	{
		Id = id;
	}
}

