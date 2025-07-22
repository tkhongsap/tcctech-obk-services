using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Domain;

[Table("trCaseTasks")]
public class trCaseTasks
{
  [Required]
  public required int Id { get; set; }
  [Required]
  public  Guid  CSID { get; set; } = Constant.OBK_CLIENT_SITE;
  public string? Name { get; set; }
  
  public int CaseId { get; set; }
  public trCases trCases { get; set; } = default!;

  public int StatusCode { get; set; } = 0;

  public int Sequence { get; set; } = 0;
  [MaxLength(100)]
  public string? CreatedBy { get; set; }
  [Column(TypeName = "timestamp without time zone")]
  public DateTime CreatedOn { get; set; }
  [MaxLength(100)]

  public string? ModifiedBy { get; set; }
  [Column(TypeName = "timestamp without time zone")]
  public DateTime ModifiedOn { get; set; }
  [DefaultValue(null)]
  public int? AssignedStaffId { get; set; } = null;
  [DefaultValue(null)]
  public string? AssignedStaffDisplayName { get; set;} = null;
  public bool IsCritical { get; set; }

  public int TaskCategoryId { get; set; } = 0;
}