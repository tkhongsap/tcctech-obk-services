namespace TCCTOBK.OperationBackend.Application.Features.Operation.MasterData.Location.Model;
public class LocationItem
{
	public int Id { get; set; }
	public string LocationCode { get; set; }
	public int LocationTypeId { get; set; }
	public string Name { get; set; }
	public string FullName { get; set; }
	public int TopLocationId { get; set; }
	public string Description { get; set; }
	public int ParentLocationId { get; set; }

	public LocationItem(LocationsResult data)
	{
		Id = data.id;
		LocationCode = data.locationCode;
		LocationTypeId = data.locationTypeId;
		Name = data.name;
		FullName = data.fullName;
		TopLocationId = data.topLocationId;
		Description = data.description;
		ParentLocationId = data.parentLocationId;
	}
}
