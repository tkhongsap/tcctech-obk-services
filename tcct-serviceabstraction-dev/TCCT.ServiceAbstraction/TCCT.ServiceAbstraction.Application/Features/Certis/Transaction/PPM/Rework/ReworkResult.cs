namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.Rework;
public class ReworkResult
{
	public Result Result { get; set; } = new Result();
	public int Id { get; set; }
	public int Status { get; set; }
	public bool IsCanceled { get; set; }
	public bool IsCompleted { get; set; }
	public bool IsCompletedSuccessfully { get; set; }
	public int CreationOptions { get; set; }
	public bool IsFaulted { get; set; }
}

public class Result
{
	public int Id { get; set; }
	public string Name { get; set; } = null!;
	public int MWOId { get; set; }
	public int LocationId { get; set; }
	public int ChecklistId { get; set; }
	public int ServiceCategoryId { get; set; }
	public int ServiceProviderId { get; set; }
	public int ServicingGroupId { get; set; }
	public int EstimatedTotalDuration { get; set; }
	public DateTime TargetStart { get; set; }
	public DateTime TargetCompletion { get; set; }
	public DateTime ActualStart { get; set; }
	public int StatusId { get; set; }
	public string CreatedBy { get; set; } = null!;
	public DateTime CreatedOn { get; set; }
	public DateTime ModifiedOn { get; set; }
	public bool IsActive { get; set; }
	public DateTime ClosedOn { get; set; }
	public bool IsReworkRequested { get; set; }
	public DateTime ReworkRequestedOn { get; set; }
	public string ReworkRequestedBy { get; set; } = null!;
	public string ReasonToRework { get; set; } = null!;
	public string SupervisorId { get; set; } = null!;
	public string SupervisorAssignedBy { get; set; } = null!;
	public DateTime SupervisorAssignedOn { get; set; }
	public bool IsTechniciansAssigned { get; set; }
	public string TechniciansAssignedBy { get; set; } = null!;
	public DateTime TechniciansAssignedOn { get; set; }
	public bool IsCancelled { get; set; }
	public int WorkflowId { get; set; }
	public bool IsAdhoc { get; set; }
	public bool IsPrevSupervisorRejected { get; set; }
	public bool IsPrevTechnicianRejected { get; set; }
	public string PrevRejectedBySupervisorId { get; set; } = null!;
}
