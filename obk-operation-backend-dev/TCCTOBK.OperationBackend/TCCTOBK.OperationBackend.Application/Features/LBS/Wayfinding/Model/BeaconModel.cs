using System;

namespace TCCTOBK.OperationBackend.Application.Features.LBS.Wayfinding.Model;

public class BeaconModel
{
	public string UUID { get; set; } = default!;
	public int Major { get; set; }
	public int Minor { get; set; }
	public double Latitude { get; set; }
	public double Longitude { get; set; }
	public string FloorName { get; set; } = default!;
	public string ParkName { get; set; } = default!;
	public string SpaceNo { get; set; } = default!;
	public string SpaceType { get; set; } = default!;
	public string ZoneName { get; set; } = default!;
}
