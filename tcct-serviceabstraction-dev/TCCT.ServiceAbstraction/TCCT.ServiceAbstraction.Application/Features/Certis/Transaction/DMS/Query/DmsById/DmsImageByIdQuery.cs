using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.DMS.Query.DmsById;
public class DmsImageByIdQuery : IQuery<DmsImageByIdResult>
{
	public int Id { get; set; }

	public DmsImageByIdQuery(int id)
	{
		Id = id;
	}
}
