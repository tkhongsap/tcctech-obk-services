using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.Utils;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.CWO;
public class CWOResult
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
public class CwoTaskMap
{
	public int Id { get; set; }
	public int CwoId { get; set; }
	public int TaskId { get; set; }
	public FmChecklistTask FmChecklistTask { get; set; } = new FmChecklistTask();
	public int TaskNo { get; set; }
	public string Description { get; set; } = null!;
	public int ChecklistId { get; set; }
	public bool IsMandatory { get; set; }
	public bool IsAttachmentRequired { get; set; }
	public bool IsReadingRequired { get; set; }
	public bool IsRatingRequired { get; set; }
	public string CreatedBy { get; set; } = null!;
	public DateTime CreatedOn { get; set; }
	public string ModifiedBy { get; set; } = null!;
	public DateTime ModifiedOn { get; set; }
}

public class FmChecklistTask
{
	public int Id { get; set; }
	public int TaskNo { get; set; }
	public string Description { get; set; } = null!;
	public int ChecklistId { get; set; }
	public bool IsMandatory { get; set; }
	public bool IsAttachmentRequired { get; set; }
	public bool IsReadingRequired { get; set; }
	public int Duration { get; set; }
	public bool IsRatingRequired { get; set; }
}

public class FmProblemType
{
	public int Id { get; set; }
	public string Name { get; set; } = null!;
	public int PriorityId { get; set; }
	public int ServiceCategoryId { get; set; }
	public int ChecklistId { get; set; }
	public List<object> Cwos { get; set; } = new List<object>();
}

public class Result
{
	public int Id { get; set; }
	public string Name { get; set; } = null!;
	public int CwoTypeId { get; set; }
	public int ProblemTypeId { get; set; }
	public FmProblemType FmProblemType { get; set; } = new FmProblemType();
	public int PriorityId { get; set; }
	public int ServiceCategoryId { get; set; }
	public int LocationId { get; set; }
	public string Description { get; set; } = null!;
	public string CreatedBy { get; set; } = null!;
	public DateTime CreatedOn { get; set; }
	public string ModifiedBy { get; set; } = null!;
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
	public bool IsTaskCompletionConfirmed { get; set; }
	public bool IsCancelled { get; set; }
	public int SlaTriggerPoint { get; set; }
	public bool IsReworkRequested { get; set; }
	public bool IsPrevSupervisorRejected { get; set; }
	public bool IsPrevTechnicianRejected { get; set; }
	public bool IsWorkingOffline { get; set; }
	public bool IsPaused { get; set; }
	public bool IsSynced { get; set; }
	public int ParentId { get; set; }
	public List<CwoTaskMap> CwoTaskMaps { get; set; } = new List<CwoTaskMap>();
	public List<CwoTransaction> CwoTransactions { get; set; } = new List<CwoTransaction>();
}