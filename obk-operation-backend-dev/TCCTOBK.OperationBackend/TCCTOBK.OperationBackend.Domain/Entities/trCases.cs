using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using TCCTOBK.OperationBackend.Domain.Common;

namespace TCCTOBK.OperationBackend.Domain.Entities;

[Table("trCases")]
public class trCases
{ 
  [Required]
  public required int Id { get; set; }
  [Required]
  public Guid CSID { get; set; } = Constant.OBK_CLIENT_SITE;
  public string? ShortDesc { get; set; }
  [MaxLength(100)]
  public string? CaseNo { get; set; }
  [Required]
  public required int EventTypeId { get; set; }
  [MaxLength(100)]
  public string? EventTypeCode { get; set; }
  [Required]
  public required int LocationId { get; set; }
  [MaxLength(100)]
  public string? LocationCode { get; set; }
  public string? LocationName { get; set; }
   [Required]
  public int PriorityLevelId { get; set; }
  public int? SiteHandler { get; set; }
  public int? StatusCode { get; set; }
  [Required]
  [MaxLength(100)]
  public required string Timestamp { get; set; }
  [MaxLength(100)]
  [Column(TypeName = "timestamp without time zone")]
  public DateTime? CreatedOn { get; set; }
  [MaxLength(100)]
  public string? ModifiedBy { get; set; }
  [Column(TypeName = "timestamp without time zone")]
  public DateTime? ModifiedOn { get; set; }
  public string? Requester { get; set; }
  public int? SlaConfigId { get; set; }
  public int? CaseTypeId { get; set; }
  [MaxLength(100)]
  public string? CreatedBy { get; set; }
  public bool? SlaFailed { get; set; }
  [MaxLength(100)]
  [Column(TypeName = "timestamp without time zone")]
  public DateTime? SlaDate { get; set; }
  public string? Description { get; set; }
  [MaxLength(100)]
  public string? EquipmentTag { get; set; }
  [MaxLength(100)]
  public string? ExternalRefNo { get; set; }
  public bool? IsCritical { get; set; }
  public string? PriorityText { get; set; } = "";
	public int SyncStatus { get; set; } = 0;
  public int SyncUtcTs { get; set; } = 0;

  public List<trCaseTasks> trCaseTasks { get; set; } = new();
  public List<trCaseMedias> trCaseMedias { get; set; } = new();

}

