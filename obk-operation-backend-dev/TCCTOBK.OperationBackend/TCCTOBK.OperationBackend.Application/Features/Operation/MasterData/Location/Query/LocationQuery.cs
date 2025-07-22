using TCCTOBK.OperationBackend.Application.Configuration.Queries;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.MasterData.Location.Query;
public class LocationQuery : IQuery<LocationResult>
{
	public int? LocationId { get; set; }

	public LocationQuery(int id)
	{
		LocationId = id;
	}
	public LocationQuery()
	{
	}
}