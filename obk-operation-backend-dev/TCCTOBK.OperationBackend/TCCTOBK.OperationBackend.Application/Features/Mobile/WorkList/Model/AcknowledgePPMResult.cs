namespace TCCTOBK.OperationBackend.Application;

public class AcknowledgePPMResult
{
  public int id { get; set; }
  public string? name { get; set; }
  public int mwoId { get; set; }
  public int locationId { get; set; }
  public int checklistId { get; set; }
  public int serviceCategoryId { get; set; }
  public int serviceProviderId { get; set; }
  public int servicingGroupId { get; set; }
  public string? ackedBy { get; set; }
  public DateTime ackedOn { get; set; }
  public int estimatedTotalDuration { get; set; }
  public DateTime targetStart { get; set; }
  public DateTime targetCompletion { get; set; }
  public DateTime actualStart { get; set; }
  public int statusId { get; set; }
  public string? createdBy { get; set; }
  public DateTime createdOn { get; set; }
  public DateTime modifiedOn { get; set; }
  public bool isActive { get; set; }
  public bool isReworkRequested { get; set; }
  public string? supervisorId { get; set; }
  public string? supervisorAssignedBy { get; set; }
  public DateTime supervisorAssignedOn { get; set; }
  public bool isTechniciansAssigned { get; set; }
  public string? techniciansAssignedBy { get; set; }
  public DateTime techniciansAssignedOn { get; set; }
  public bool isCancelled { get; set; }
  public int workflowId { get; set; }
  public bool isAdhoc { get; set; }
  public bool isPrevSupervisorRejected { get; set; }
  public bool isPrevTechnicianRejected { get; set; }
  public string? prevRejectedBySupervisorId { get; set; }
  public string? acknowledgementSignature { get; set; }
}
