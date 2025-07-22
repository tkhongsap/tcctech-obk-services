namespace TCCTOBK.OperationBackend.Application;

public class PPMDetailResult
{
	public int PPMID { get; set; }
	public string WOID { get; set; }
	public int MasterWorkId { get; set; }
	public string? MasterWorkTitle { get; set; }
	public string? MasterWork { get; set; }
	public int FrequencyId { get; set; }
	public string Frequency { get; set; } = "";
	public string? Location { get; set; }
	public int LocationId { get; set; }
	public string? ServiceCategory { get; set; }
	public int ServiceCategoryId { get; set; }
	public string IssueType { get; set; } = "";
	public int IssueTypeId { get; set; }
	public string? Description { get; set; }
	public string TargetStart { get; set; } = "";
	public string ActualStart { get; set; } = "";
	public string TargetCompletion { get; set; } = "";
	public string ActualCompletion { get; set; } = "";
	public string? ServiceProvider { get; set; }
	public string? CreatedBy { get; set; }
	public string? Supervisor { get; set; }
	public string? SupervisorId { get; set; }
	public string? AcknowledgedTechnician { get; set; }
	public string? AssignedTechnician { get; set; }
	public string? AssignedTechnicianId { get; set; }
	public int? Status { get; set; }
	public string? StatusText { get; set; }
	public float Progression { get; set; } = .0f;
	public string ProgressionText => $"{Math.Round(Progression * 100)} %";
	public List<TaskInPPM> TaskPPM { get; set; } = new();
	public List<DocumentWork> Documents { get; set; } = new();
	public List<DocumentWork> DocumentAll { get; set; } = new();
}

public class TaskInPPM
{
	public int Id { get; set; }
	public int TaskNo { get; set; }
	public string Description { get; set; } = string.Empty;
	public int ChecklistId { get; set; }
	public bool IsMandatory { get; set; }
	public bool IsAttachmentRequired { get; set; }
	public bool IsReadingRequired { get; set; }
	public int Duration { get; set; }
	public string IconData { get; set; } = null!;
	public string IconMimeType { get; set; } = null!;
	public string IconName { get; set; } = null!;
	public bool IsRatingRequired { get; set; }
	public int ServicingObjectId { get; set; }
	public string TaskStatus { get; set; }
	public int? TaskStatusId { get; set; }
	public string? LocationName { get; set; } = null!;
	public List<DocumentWork> Documents { get; set; } = new();
	public int DocumentCount { get; set; }
}
