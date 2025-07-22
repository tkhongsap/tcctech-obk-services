using System;
using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Domain;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.MasterData.Query.LocationsByType;

public class LocationsByTypeQuery : IQuery<List<LocationsByTypeResult>>
{
	public int? TypeId { get; set; }
	public int? ParentId { get; set; }
	public string? Types { get; set; }
}
