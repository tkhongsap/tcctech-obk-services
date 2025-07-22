namespace TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.Asset.Assets;
public class AssetResult
{
	public int Id { get; set; }
	public string Name { get; set; } = string.Empty;
	public int AssetCategoryId { get; set; }
	public int LocationId { get; set; }
	public Location Location { get; set; } = null!;
	public bool OperationalStatus { get; set; }
	public string CreatedBy { get; set; } = string.Empty;
	public DateTime CreatedOn { get; set; }
	public string ModifiedBy { get; set; } = string.Empty;
	public DateTime ModifiedOn { get; set; }
	public string EquipmentTag { get; set; } = string.Empty;
	public List<ClosestCamera> ClosestCameras { get; set; } = new List<ClosestCamera>();
}

public class Location
{
	public int Id { get; set; }
	public string LocationCode { get; set; } = string.Empty;
	public int LocationTypeId { get; set; }
	public string Name { get; set; } = string.Empty;
	public string FullName { get; set; } = string.Empty;
	public int TopLocationId { get; set; }
	public string Description { get; set; } = string.Empty;
	public int ParentLocationId { get; set; }
	public string CreatedBy { get; set; } = string.Empty;
	public DateTime CreatedOn { get; set; }
	public string ModifiedBy { get; set; } = string.Empty;
	public DateTime ModifiedOn { get; set; }
	public int? FloorNo { get; set; }
}
