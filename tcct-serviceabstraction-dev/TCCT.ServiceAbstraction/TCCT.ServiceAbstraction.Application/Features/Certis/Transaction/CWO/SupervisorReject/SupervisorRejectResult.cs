using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.Utils;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.SupervisorReject;
public class SupervisorRejectResult
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
	public string Name { get; set; }
	public int CwoTypeId { get; set; }
	public int ProblemTypeId { get; set; }
	public int PriorityId { get; set; }
	public int ServiceCategoryId { get; set; }
	public int LocationId { get; set; }
	public string Description { get; set; }
	public string CreatedBy { get; set; }
	public DateTime CreatedOn { get; set; }
	public string ModifiedBy { get; set; }
	public DateTime ModifiedOn { get; set; }
	public int RequesterId { get; set; }
	public DateTime RequestedOn { get; set; }
	public bool IsActive { get; set; }
	public int StatusId { get; set; }
	public int AssetId { get; set; }
	public DateTime SlaStartDateTime { get; set; }
	public DateTime SlatoRespond { get; set; }
	public int EstimatedTotalDuration { get; set; }
	public DateTime EstimatedCompletion { get; set; }
	public string OperatorNote { get; set; }
	public bool IsTaskCompletionConfirmed { get; set; }
	public bool IsCancelled { get; set; }
	public int ServiceProviderId { get; set; }
	public int SlaTriggerPoint { get; set; }
	public bool IsReworkRequested { get; set; }
	public bool IsPrevSupervisorRejected { get; set; }
	public string PrevRejectedSupervisorId { get; set; }
	public bool IsPrevTechnicianRejected { get; set; }
	public string PrevRejectedTechnicianId { get; set; }
	public bool IsWorkingOffline { get; set; }
	public bool IsPaused { get; set; }
	public bool IsSynced { get; set; }
	public int ParentId { get; set; }
	public List<CwoTransaction> CwoTransactions { get; set; } = new List<CwoTransaction>();
}