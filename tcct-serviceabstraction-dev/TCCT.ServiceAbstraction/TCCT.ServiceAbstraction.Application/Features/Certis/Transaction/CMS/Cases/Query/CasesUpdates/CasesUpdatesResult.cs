namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.Cases.Query.CasesUpdates;
public class CasesUpdatesResult
{
	public int Id { get; set; }
	public string ShortDesc { get; set; }
	public string CaseNo { get; set; }
	public int EventTypeId { get; set; }
	public string EventTypeCode { get; set; }
	public int LocationId { get; set; }
	public string LocationCode { get; set; }
	public string LocationName { get; set; }
	public int PriorityLevelId { get; set; }
	public int SLAConfigId { get; set; }
	public int CaseTypeId { get; set; }
	public int SiteHandler { get; set; }
	public int StatusCode { get; set; }
	public DateTime Timestamp { get; set; }
	public DateTime CreatedOn { get; set; }
	public string? ModifiedBy { get; set; }
	public string? ModifiedOn { get; set; }
	public string? Requester { get; set; }
	public string CreatedBy { get; set; }
	public bool SLAFailed { get; set; }
	public DateTime SLADate { get; set; }
	public string Description { get; set; }
	public string EquipmentTag { get; set; }
	public string ExternalRefNo { get; set; }
	public bool? IsCritical { get; set; }
}
