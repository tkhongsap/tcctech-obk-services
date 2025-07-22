
namespace TCCTOBK.OperationBackend.Application;

public class AssetResult
{
  public int Id { get; set; }
  public string Name { get; set; }
  public string Description { get; set; }
  public int AssetCategoryId { get; set; }
  public int LocationId { get; set; }
  public LocationsResult Location { get; set; } = new();
  public bool OperationalStatus { get; set; }
  public string Supplier { get; set; }
  public string Model { get; set; }
  public string? CreatedBy { get; set; }
  public string? ModifiedBy { get; set; }
  public List<ClosestCamera> ClosestCameras { get; set; } = new();
}

public class LocationsTypeResult
{
  public int Id { get; set; }
  public string Name { get; set; }
}

public class LocationsResult
{
  public int id { get; set; }
  public string? locationCode { get; set; }
  public int locationTypeId { get; set; }
  public string name { get; set; }
  public string fullName { get; set; }
  public int topLocationId { get; set; }
  public string description { get; set; }
  public string createdBy { get; set; }
  public string modifiedBy { get; set; }
  public int parentLocationId { get; set; }
}

public class ClosestCamera
{
  public int seqNo { get; set; }
  public int cameraId { get; set; }
  public bool isPrimaryCamera { get; set; }
  public bool isSnapshotEnable { get; set; }
  public bool isFootageEnable { get; set; }
}
