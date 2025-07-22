using TCCTOBK.OperationBackend.Application.Features.Mobile.CWO.Model;

namespace TCCTOBK.OperationBackend.Application;

public class AcknowledgeCWOResult
{
  public int id { get; set; }
  public string? name { get; set; }
  public int cwoTypeId { get; set; }
  public int problemTypeId { get; set; }
  public int priorityId { get; set; }
  public int serviceCategoryId { get; set; }
  public int locationId { get; set; }
  public string? description { get; set; }
  public string? createdBy { get; set; }
  public DateTime createdOn { get; set; }
  public string? modifiedBy { get; set; }
  public DateTime modifiedOn { get; set; }
  public int requesterId { get; set; }
  public DateTime requestedOn { get; set; }
  public bool isActive { get; set; }
  public int statusId { get; set; }
  public int assetId { get; set; }
  public DateTime ackedOn { get; set; }
  public string? ackedBy { get; set; }
  public DateTime slaStartDateTime { get; set; }
  public DateTime slatoResolve { get; set; }
  public DateTime slatoRespond { get; set; }
  public int estimatedTotalDuration { get; set; }
  public DateTime estimatedCompletion { get; set; }
  public string? supervisorId { get; set; }
  public DateTime supervisorAssignedOn { get; set; }
  public string? supervisorAssignedBy { get; set; }
  public string? technicianId { get; set; }
  public DateTime technicianAssignedOn { get; set; }
  public string? technicianAssignedBy { get; set; }
  public string? operatorNote { get; set; }
  public DateTime actualStartDateTime { get; set; }
  public bool isTaskCompletionConfirmed { get; set; }
  public bool isCancelled { get; set; }
  public int serviceProviderId { get; set; }
  public int slaTriggerPoint { get; set; }
  public bool isReworkRequested { get; set; }
  public bool isPrevSupervisorRejected { get; set; }
  public bool isPrevTechnicianRejected { get; set; }
  public string? acknowledgementVerifiedBy { get; set; }
  public bool isWorkingOffline { get; set; }
  public bool isPaused { get; set; }
  public string? acknowledgementSignature { get; set; }
  public bool isSynced { get; set; }
  public int parentId { get; set; }
  public CWOResultModel result { get; set; } = new();
}

public class cwoTransactions
{
  public int id { get; set; }
  public int cwoId { get; set; }
  public string? message { get; set; }
  public string? createdBy { get; set; }
  public DateTime createdOn { get; set; }
}
