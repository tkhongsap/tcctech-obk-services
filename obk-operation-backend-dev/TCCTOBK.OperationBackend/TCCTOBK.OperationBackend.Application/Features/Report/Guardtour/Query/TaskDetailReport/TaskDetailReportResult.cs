using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Query.GetSubtask;

namespace TCCTOBK.OperationBackend.Application;

public class TaskDetailReportResult
{
	public required string Path { get; set; }
}

// public class GetSubtask
// {
// 	public Guid Id { get; set; }
// 	public string Name { get; set; } = default!;
// 	public List<Action> Action { get; set; } = new();
// }

public class Action
{
	public Guid ActionId { get; set; }
	public string? Name { get; set; }
	public string? Description { get; set; }
	public int Status { get; set; }
	public int IsRequired { get; set; }
	public string? ActionType { get; set; }
}

public class SubtaskData
{
	public string TotalDidRecords { get; set; }
	public int TotalRecords { get; set; }
	public float ProgressSuccess { get; set; }
	public string ProgressSuccessText { get; set; } = "0%";
	public float ProgressFail { get; set; }
	public List<GetSubtask>? Data { get; set; }
}

public class GetTaskResultReport
{
	public Guid Id { get; set; }
	public string Name { get; set; } = "";
	public int Status { get; set; }
	public string Member { get; set; }
	public string LocationName { get; set; } = "";
	public string StartDate { get; set; } = "";
	public string StartTime { get; set; } = "";
	public string EndDate { get; set; } = "";
	public string EndTime { get; set; } = "";
	public int AcknowleageBeforeMinutes { get; set; } = 0;
	public SubtaskData? Subtasks { get; internal set; }
	public string? CompleteDate { get; set; } = "";
	public string? CompleteTime { get; set; } = "";
	public string? Duration { get; set; } = "";
	public string? AcknowleageDateTime { get; set; } = "";
	public string? CancelReason { get; set; } = "-";
}
