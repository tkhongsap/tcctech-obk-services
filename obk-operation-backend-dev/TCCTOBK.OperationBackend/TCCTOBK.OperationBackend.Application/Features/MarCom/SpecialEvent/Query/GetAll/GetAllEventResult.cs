
namespace TCCTOBK.OperationBackend.Application.Features.Marcom.SpecialEvent.Query.GetAll;
public class GetAllEventResult
{
	public EventResult Data { get; set; } = new EventResult();
	public int StatusCode { get; set; }
	public string? Message { get; set; }
}

public class EventResult
{
	public List<EventTable> Data { get; set; } = new List<EventTable>();
	public CmsMarcomPagination Pagination { get; set; } = new CmsMarcomPagination();
	public bool? Show { get; set; }
	public string? Time { get; set; }
}

public class CmsMarcomPagination
{
	public int Total { get; set; }
	public int Page_number { get; set; }
	public int Total_page { get; set; }
}
public class EventTable
{
	public Guid Id { get; set; }
	public string? EventName { get; set; }
	public bool IsHasEN { get; set; }
	public bool IsHasCN { get; set; }
	public bool IsHasTH { get; set; }
	public double? LastUpdate { get; set; }
	public string? Status { get; set; }
	public bool? IsPublic { get; set; }
	public EventOrder? ConfigOrder { get; set; }
	public EventDetail Content { get; set; } = new EventDetail();
	public ShowTime? ShowDate { get; set; }
}

public class ShowTime
{
	public double? Start { get; set; }
	public double? End { get; set; }
	public bool? IsAllTime { get; set; }
}


public class EventOrder
{
	public int? Current { get; set; }
	public int? Max { get; set; }
}

public class EventDetail
{
	public string? ImageURL { get; set; }
	public string? FileName { get; set; }
	public string? OriginalFileName { get; set; }
}