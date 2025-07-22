namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.Close;
public class CloseResult
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
	public string AckedBy { get; set; } = null!;
	public DateTime AckedOn { get; set; }
	public int EstimatedTotalDuration { get; set; }
	public DateTime TargetStart { get; set; }
	public DateTime TargetCompletion { get; set; }
	public DateTime ActualStart { get; set; }
	public DateTime ActualCompletion { get; set; }
	public string CompletedBy { get; set; } = null!;
	public string CompletionComment { get; set; } = null!;
	public string CompletionVerifiedBy { get; set; } = null!;
	public int StatusId { get; set; }
	public string CreatedBy { get; set; } = null!;
	public DateTime CreatedOn { get; set; }
	public DateTime ModifiedOn { get; set; }
	public bool IsActive { get; set; }
	public DateTime ClosedOn { get; set; }
	public string ClosedBy { get; set; } = null!;
	public string ClosureComment { get; set; } = null!;
	public bool IsReworkRequested { get; set; }
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
	public string ClientVerifiedBy { get; set; } = null!;
	public string ClientVerificationComment { get; set; } = null!;
	public string ClientVerificationSubmittedBy { get; set; } = null!;
	public DateTime ClientVerificationSubmittedOn { get; set; }
	public string AcknowledgementSignature { get; set; } = null!;
	public string CompletionSignature { get; set; } = null!;
	public string ClosureSignature { get; set; } = null!;
	public string ClientVerificationSignature { get; set; } = null!;
}