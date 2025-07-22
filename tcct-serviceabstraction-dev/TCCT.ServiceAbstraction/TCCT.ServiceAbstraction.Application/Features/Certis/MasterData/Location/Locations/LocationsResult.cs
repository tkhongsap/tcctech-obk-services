namespace TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.Location.Locations;
public class LocationsResult
{
	public int Id { get; set; }
	public string LocationCode { get; set; } = null!;
	public int LocationTypeId { get; set; }
	public string Name { get; set; } = null!;
	public string FullName { get; set; } = string.Empty;
	public int TopLocationId { get; set; }
	public string Description { get; set; } = string.Empty;
	public string CreatedBy { get; set; } = string.Empty;
	public DateTime CreatedOn { get; set; }
	public string ModifiedBy { get; set; } = string.Empty;
	public DateTime ModifiedOn { get; set; }
	public int ParentLocationId { get; set; }
}
