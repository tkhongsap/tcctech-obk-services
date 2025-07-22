namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Query.GetTaskList;
public class GetTask
{
	public Guid Id { get; set; }
	public string Name { get; set; } = "";
	public int Status { get; set; }
	public Guid MemberId { get; set; }
	public string StartDate { get; set; } = "";
	public string EndDate { get; set; } = "";
	public string StartToEndDate { get; set; } = "";
	public string UpdateAt { get; set; } = "";
	public string? CancelReason { get; set; }
}

public record GetTaskListResult(Paginate Paginate, Dictionary<string, int> TotalStatusRecords, List<GetTask> Data);