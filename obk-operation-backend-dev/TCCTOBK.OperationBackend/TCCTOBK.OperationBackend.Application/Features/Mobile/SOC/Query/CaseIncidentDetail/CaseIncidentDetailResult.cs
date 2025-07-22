namespace TCCTOBK.OperationBackend.Application;

public class CaseIncidentDetailResult
{
  public int Id { get; set; }
  public string? ShortDesc { get; set; }
  public string? Description { get; set; }
  public string? CaseNo { get; set; }
  public string? EquipmentTag { get; set; }
  public int EventTypeId { get; set; }
  public string? EventTypeCode { get; set; }
  public int LocationId { get; set; }
  public string? LocationCode { get; set; }
  public string? LocationName { get; set; }
  public int PriorityLevelId { get; set; }
  public int SlaConfigId { get; set; }
  public int CaseTypeId { get; set; }
  public int SiteHandler { get; set; }
  public int StatusCode { get; set; }
  public DateTime Timestamp { get; set; }
  public string? DeviceData { get; set; }
  public DateTime CreatedOn { get; set; }
  public string? CreatedBy { get; set; }
  public bool SlaFailed { get; set; }
  public DateTime SlaDate { get; set; }

  public string PriorityText => GetPriorityText(PriorityLevelId);

	private string GetPriorityText(int id)
	{
		switch (id)
		{
			case 1: return "cat 1";
			case 2: return "cat 2";
			case 3: return "cat 3";
			default: return "";
		}
	}
}