namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.EventTypes;
public class EventTypesResult
{
	public int Id { get; set; }
	public string Code { get; set; }
	public string Description { get; set; }
	public int PriorityLevelId { get; set; }
	public int EventCategoryId { get; set; }
	public bool IsCritical { get; set; }
	public bool IsManualEvent { get; set; }
	public int SiteHandler { get; set; }
	public List<int> CaseActions { get; set; }
	public List<Task> Tasks { get; set; }
}

public class Task
{
	public int SeqNo { get; set; }
	public string Name { get; set; }
	public bool IsCritical { get; set; }
	public int TaskCategoryId { get; set; }
	public bool IsAutoCreate { get; set; }
}
