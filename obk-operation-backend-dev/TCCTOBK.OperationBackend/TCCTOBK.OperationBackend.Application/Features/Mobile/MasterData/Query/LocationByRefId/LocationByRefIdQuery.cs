using System;
using TCCTOBK.OperationBackend.Application.Configuration.Queries;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.MasterData.Query.LocationByRefId;

public class LocationByRefIdQuery : IQuery<LocationByRefIdResult>
{
	public int RefId { get; set; }
}
