using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Features.LBS.Wayfinding.Model;

namespace TCCTOBK.OperationBackend.Application.Features.LBS.Wayfinding.Query.GetBeaconByUUID;

public class GetBeaconByUUIDQuery : IQuery<BeaconModel>
{
	public string UUID { get; set; } = default!;

	public GetBeaconByUUIDQuery(string uUID)
	{
		UUID = uUID;
	}
}
