using System;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.MasterData.Query.UpsertLocations;

public class UpsertLocationsResult
{
	public int UpdatedRow { get; set; } = 0;
	public int InsertedRow { get; set; } = 0;
}
