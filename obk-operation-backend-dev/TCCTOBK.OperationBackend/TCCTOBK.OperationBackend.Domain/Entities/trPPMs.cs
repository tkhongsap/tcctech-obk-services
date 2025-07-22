using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TCCTOBK.OperationBackend.Domain.Entities;

[Table("trPPMs")]
public class trPPMs
{ 
  [Required]
  public int Id { get; set; }
  [Required]
  public Guid CSID { get; set; } = Constant.OBK_CLIENT_SITE;
  public string? Name { get; set; }
  public int? MWOId { get; set; }
  public int? LocationId { get; set; }
  public int? ChecklistId { get; set; }
  public int? ServiceCategoryId { get; set; }
  public int? ServiceProviderId { get; set; }
  public int? ServicingGroupId { get; set; }
  [MaxLength(100)]
  public string? AckedBy { get; set; }
  public DateTime? AckedOn { get; set; }
  public int? EstimatedTotalDuration { get; set; }
  public DateTime? TargetStart { get; set; }
  public DateTime? TargetCompletion { get; set; }
  public DateTime? ActualStart { get; set; }
  public DateTime? ActualCompletion { get; set; }
  [MaxLength(100)]
  public string? CompletedBy { get; set; }
  public string? CompletionComment { get; set; }
  [MaxLength(100)]
  public string? CompletionVerifiedBy { get; set; }
  public int? FrequencyTypeId { get; set; }
  public int? StatusId { get; set; }
  [MaxLength(100)]
  public string? CreatedBy { get; set; }
  public DateTime? CreatedOn { get; set; }
  public DateTime? ModifiedOn { get; set; }
  public bool? IsActive { get; set; }
  public DateTime? ClosedOn { get; set; }
  [MaxLength(100)]
  public string? ClosedBy { get; set; }
  public string? ClosureComment { get; set; }
  public bool? IsReworkRequested { get; set; }
  [MaxLength(100)]
  public string? SupervisorId { get; set; }
  [MaxLength(100)]
  public string? SupervisorAssignedBy { get; set; }
  public DateTime? SupervisorAssignedOn { get; set; }
  public bool? IsTechniciansAssigned { get; set; }
  [MaxLength(100)]
  public string? TechniciansAssignedBy { get; set; }
  public DateTime? TechniciansAssignedOn { get; set; }
  public bool? IsCancelled { get; set; }
  public int? WorkflowId { get; set; }
  public bool? IsAdhoc { get; set; }
  public bool? IsPrevSupervisorRejected { get; set; }
  public bool? IsPrevTechnicianRejected { get; set; }
  [MaxLength(100)]
  public string? ClientVerifiedBy { get; set; }
  public string? ClientVerificationComment { get; set; }
  [MaxLength(100)]
  public string? ClientVerificationSubmittedBy { get; set; }
  public DateTime? ClientVerificationSubmittedOn { get; set; }
  public string? AcknowledgementSignature { get; set; }
  public string? CompletionSignature { get; set; }
  public string? ClosureSignature { get; set; }
  public string? ClientVerificationSignature { get; set; }
}

