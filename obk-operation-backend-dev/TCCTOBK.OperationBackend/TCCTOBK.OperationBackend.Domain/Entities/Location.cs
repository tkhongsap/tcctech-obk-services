using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;
using TCCTOBK.OperationBackend.Domain.Common;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Domain;

public class Location : Auditable
{
	[Key]
	public required Guid LID { get; set; }
	public string LocationCode { get; set; } = "";
	public required string SiteName { get; set; }
	[AllowNull]
	public string? ZoneName { get; set; }
	[AllowNull]
	public string? BuildingName { get; set; } // AssetClass
	[AllowNull]
	public string? BuildingZoneName { get; set; } // Component
	[AllowNull]
	public string? FloorName { get; set; }

	public string? Space { get; set; }
	public string? Subspace { get; set; }

	public int? TypeId { get; set; }
	public string? Type { get; set; }

	public int? RefId { get; set; }
	public int? ParentLocationId { get; set; }
	//[ForeignKey(nameof(Unit))]
	public List<Unit> Unit { get; set; } = new();
	//[ForeignKey(nameof(SpotCoordinate))]
	public List<SpotCoordinate> SpotCoordinate { get; set; } = new();

	public Guid? CSID { get; set; } = Constant.OBK_CLIENT_SITE;
}