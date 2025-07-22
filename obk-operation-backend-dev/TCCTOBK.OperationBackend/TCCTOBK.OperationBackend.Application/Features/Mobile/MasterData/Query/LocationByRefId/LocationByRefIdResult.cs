using System;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.MasterData.Query.LocationByRefId;

public class LocationByRefIdResult
{
	public required Guid LID { get; set; }
	public string LocationCode { get; set; } = string.Empty;
	public string Name { get; set; } = string.Empty;
	public int? TypeId { get; set; }
	public string? Type { get; set; }
	public int? ParentId { get; set; }
	public int? RefId { get; set; }
}
