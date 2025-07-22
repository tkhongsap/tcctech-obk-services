using TCCTOBK.OperationBackend.Application.Features.LBS.Wayfinding.Model;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Application.Features.LBS.Wayfinding.Query.GetBeaconsList;

public class GetBeaconsListResult
{
	public List<BeaconModel> Data { get; set; } = new();
}
