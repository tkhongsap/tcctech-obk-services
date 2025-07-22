namespace TCCTOBK.OperationBackend.Application.Features.Operation.MasterData.Location.Model;
public class LocationResult
{
	public int Id { get; set; }
	public string LocationCode { get; set; }
	public int LocationTypeId { get; set; }
	public string Name { get; set; }
	public string FullName { get; set; }
	public int TopLocationId { get; set; }
	public string Description { get; set; }
	public int ParentLocationId { get; set; }
}
