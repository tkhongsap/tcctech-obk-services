namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.CaseLocations;
public class CaseLocationsResult
{
	public int LocationTypeId { get; set; }
	public int Id { get; set; }
	public string Name { get; set; }
	public string FullName { get; set; }
	public int TopLocationId { get; set; }
	public string SecondaryQrCode { get; set; }
	public string CreatedBy { get; set; }
	public DateTime CreatedOn { get; set; }
	public string ModifiedBy { get; set; }
	public DateTime ModifiedOn { get; set; }
	public string LocationCode { get; set; }
	public int? ParentLocationId { get; set; }
	public int? FloorNo { get; set; }
}


