
namespace TCCTOBK.OperationBackend.Application.Contracts.DataModel.LocationRepository;
public class UpdateLocationModel
{
	public Guid LID { get; set; }
	public string? SiteName { get; set; }
	public string? ZoneName { get; set; }
	public string? BuildingName { get; set; }
	public string? BuildingZoneName { get; set; }
	public string? FloorName { get; set; }
	public string? Type { get; set; }
	public UpdateLocationModel(Guid lid, string? siteName, string? zoneName, string? buildingName, string? buildingZoneName, string? floorName, string? type)
	{
		LID = lid;
		SiteName = siteName;
		ZoneName = zoneName;
		BuildingName = buildingName;
		BuildingZoneName = buildingZoneName;
		FloorName = floorName;
		Type = type;
	}
}
