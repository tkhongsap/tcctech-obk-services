using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TCCTOBK.OperationBackend.Domain.Entities;

[Table("mtBeacon")]
public class mtBeacon
{
	[Key]
	public Guid BID { get; set; }
	[MaxLength(50)]
	public string UUID { get; set; } = default!;
	public int Major { get; set; }
	public int Minor { get; set; }
	public double Latitude { get; set; }
	public double Longitude { get; set; }
	[MaxLength(100)]
	public string FloorName { get; set; } = default!;
	[MaxLength(200)]
	public string ParkName { get; set; } = default!;
	[MaxLength(200)]
	public string SpaceNo { get; set; } = default!;
	[MaxLength(200)]
	public string SpaceType { get; set; } = default!;
	[MaxLength(200)]
	public string ZoneName { get; set; } = default!;
	public bool IsActive { get; set; }
}
