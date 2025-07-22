namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.Comment.Command;
public class CommentResult
{
	public List<Result> Result { get; set; } = new List<Result>();
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
	public int CommentTypeId { get; set; }
	public int CwoId { get; set; }
	public Cwo Cwo { get; set; } = new Cwo();
	public string Comment { get; set; } = null!;
	public bool IsSynced { get; set; }
	public string CreatedBy { get; set; } = null!;
	public DateTime CreatedOn { get; set; }
}

public class Cwo
{
	public int Id { get; set; }
	public string Name { get; set; } = null!;
	public int CwoTypeId { get; set; }
	public int ProblemTypeId { get; set; }
	public int PriorityId { get; set; }
	public int ServiceCategoryId { get; set; }
	public int LocationId { get; set; }
	public string Description { get; set; } = null!;
	public string CreatedBy { get; set; } = null!;
	public DateTime CreatedOn { get; set; }
	public string ModifiedBy { get; set; } = null!;
	public DateTime ModifiedOn { get; set; }
	public DateTime RequestedOn { get; set; }
	public bool IsActive { get; set; }
	public int StatusId { get; set; }
	public int AssetId { get; set; }
	public DateTime AckedOn { get; set; }
	public string AckedBy { get; set; } = null!;
	public DateTime SlaStartDateTime { get; set; }
	public DateTime SlatoResolve { get; set; }
	public DateTime SlatoRespond { get; set; }
	public int EstimatedTotalDuration { get; set; }
	public DateTime EstimatedCompletion { get; set; }
	public string SupervisorId { get; set; } = null!;
	public DateTime SupervisorAssignedOn { get; set; }
	public string SupervisorAssignedBy { get; set; } = null!;
	public string TechnicianId { get; set; } = null!;
	public DateTime TechnicianAssignedOn { get; set; }
	public string TechnicianAssignedBy { get; set; } = null!;
	public string OperatorNote { get; set; } = null!;
	public DateTime ActualStartDateTime { get; set; }
	public DateTime ActualCompletionDateTime { get; set; }
	public string CompletedBy { get; set; } = null!;
	public DateTime ClosedOn { get; set; }
	public string ClosedBy { get; set; } = null!;
	public bool IsTaskCompletionConfirmed { get; set; }
	public string TaskCompletionConfirmedBy { get; set; } = null!;
	public DateTime TaskCompletionConfirmedOn { get; set; }
	public bool IsCancelled { get; set; }
	public int ServiceProviderId { get; set; }
	public string ClosureComment { get; set; } = null!;
	public int SlaTriggerPoint { get; set; }
	public bool IsReworkRequested { get; set; }
	public bool IsPrevSupervisorRejected { get; set; }
	public string PrevRejectedSupervisorId { get; set; } = null!;
	public bool IsPrevTechnicianRejected { get; set; }
	public string AcknowledgementVerifiedBy { get; set; } = null!;
	public string CompletionAckedBy { get; set; } = null!;
	public string CompletionVerifiedBy { get; set; } = null!;
	public string ClientVerificationSubmittedBy { get; set; } = null!;
	public DateTime ClientVerificationSubmittedOn { get; set; }
	public string ClientVerificationComment { get; set; } = null!;
	public string ClientVerifiedUser { get; set; } = null!;
	public bool IsWorkingOffline { get; set; }
	public bool IsPaused { get; set; }
	public string AcknowledgementSignature { get; set; } = null!;
	public string CompletionSignature { get; set; } = null!;
	public string ClosureSignature { get; set; } = null!;
	public string ClientVerificationSignature { get; set; } = null!;
	public bool IsSynced { get; set; }
	public int ParentId { get; set; }
	public int IncidentId { get; set; }
	public List<object> CwoComments { get; set; } = new List<object>();
}
