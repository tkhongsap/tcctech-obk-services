namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.Assets;
public class CaseAssetResult
{
	public int Id { get; set; }
	public string Name { get; set; } = string.Empty;
	public int AssetCategoryId { get; set; }
	public int LocationId { get; set; }
	public bool OperationalStatus { get; set; }
	public string CreatedBy { get; set; } = string.Empty;
	public DateTime CreatedOn { get; set; }
	public string ModifiedBy { get; set; } = string.Empty;
	public DateTime ModifiedOn { get; set; }
	public string EquipmentTag { get; set; } = string.Empty;
	public List<ClosestCamera> ClosestCameras { get; set; } = new List<ClosestCamera>();
}

public class ClosestCamera
{
	public int SeqNo { get; set; }
	public int CameraId { get; set; }
	public bool IsPrimaryCamera { get; set; }
	public bool IsSnapshotEnable { get; set; }
	public bool IsFootageEnable { get; set; }
}
