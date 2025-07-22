namespace TCCTOBK.OperationBackend.Application;

public class CWOComplteTaskResult
{

  // public CWOCComplteResult Result { get; set; }
  public int Id { get; set; }
  public int Status { get; set; }
  public bool IsCanceled { get; set; }
  public bool IsCompleted { get; set; }
  public bool IsCompletedSuccessfully { get; set; }
  public int CreationOptions { get; set; }
  public bool IsFaulted { get; set; }
}

public class CWOCComplteResult
{
  public int id { get; set; }
  public string name { get; set; }
  public int cwoTypeId { get; set; }
  public int problemTypeId { get; set; }
  public int priorityId { get; set; }
  public int serviceCategoryId { get; set; }
  public int locationId { get; set; }
  public string description { get; set; }
  public string createdBy { get; set; }
  public DateTime createdOn { get; set; }
  public string modifiedBy { get; set; }
  public DateTime modifiedOn { get; set; }
  public int requesterId { get; set; }
  public DateTime requestedOn { get; set; }
  public bool isActive { get; set; }
  public int statusId { get; set; }
  public int assetId { get; set; }
  public DateTime ackedOn { get; set; }
  public string ackedBy { get; set; }
  public DateTime slaStartDateTime { get; set; }
  public DateTime slatoResolve { get; set; }
  public DateTime slatoRespond { get; set; }
  public int estimatedTotalDuration { get; set; }
  public DateTime estimatedCompletion { get; set; }
  public string supervisorId { get; set; }
  public DateTime supervisorAssignedOn { get; set; }
  public string supervisorAssignedBy { get; set; }
  public string technicianId { get; set; }
  public DateTime technicianAssignedOn { get; set; }
  public string technicianAssignedBy { get; set; }
  public string operatorNote { get; set; }
  public DateTime actualStartDateTime { get; set; }
  public DateTime actualCompletionDateTime { get; set; }
  public string completedBy { get; set; }
  public bool isTaskCompletionConfirmed { get; set; }
  public string taskCompletionConfirmedBy { get; set; }
  public DateTime taskCompletionConfirmedOn { get; set; }
  public bool isCancelled { get; set; }
  public int serviceProviderId { get; set; }
  public string completionComment { get; set; }
  public int slaTriggerPoint { get; set; }
  public bool isReworkRequested { get; set; }
  public bool isPrevSupervisorRejected { get; set; }
  public bool isPrevTechnicianRejected { get; set; }
  public string acknowledgementVerifiedBy { get; set; }
  public string completionAckedBy { get; set; }
  public bool isWorkingOffline { get; set; }
  public bool isPaused { get; set; }
  public string acknowledgementSignature { get; set; }
  public string completionSignature { get; set; }
  public bool isSynced { get; set; }
  public int parentId { get; set; }

}

public class cwoComments
{
  public int id { get; set; }
  public int commentTypeId { get; set; }
  public commentType commentType { get; set; }
  public int cwoId { get; set; }
  public string comment { get; set; }
  public bool isSynced { get; set; }
  public string createdBy { get; set; }
  public DateTime createdOn { get; set; }
}

public class commentType
{
  public int id { get; set; }
  public string name { get; set; }
}

public class cwoTaskMaps
{
  public int id { get; set; }
  public int cwoId { get; set; }
  public int taskId { get; set; }
  public string taskStatus { get; set; }
  public string remarks { get; set; }
  public string reading { get; set; }
  public int taskNo { get; set; }
  public string description { get; set; }
  public int checklistId { get; set; }
  public int isMandatory { get; set; }
  public int isAttachmentRequired { get; set; }
  public int isReadingRequired { get; set; }
  public int isRatingRequired { get; set; }
  public string createdBy { get; set; }
  public DateTime createdOn { get; set; }
  public string modifiedBy { get; set; }
  public DateTime modifiedOn { get; set; }
}

public class cwoTransactionsComplete
{
  public int id { get; set; }
  public int cwoId { get; set; }
  public string message { get; set; }
  public string createdBy { get; set; }
  public DateTime createdOn { get; set; }
}