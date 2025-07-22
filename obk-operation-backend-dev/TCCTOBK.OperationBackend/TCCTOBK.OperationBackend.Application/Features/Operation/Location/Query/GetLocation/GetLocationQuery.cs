using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Domain;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Query.GetLocation;
public class GetLocationQuery : IQuery<Location>
{
	public string LID { get; set; }
	public GetLocationQuery(string lid)
	{
		LID = lid;
	}
}