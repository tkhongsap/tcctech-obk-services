using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using TCCTOBK.OperationBackend.Domain.Common;

namespace TCCTOBK.OperationBackend.Domain.Entities;

[Table("TimeSheet")]
public class TimeSheet : Auditable
{
  [Key]
  [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
  public Guid TSID { get; set; }
  [Required]
  public int Location { get; set; }
  [Required]
  [Column(TypeName = "character varying")]
  public string CheckCode { get; set; } = null!;
  [DefaultValue(true)]
  public bool IsActive { get; set; } = true;
}
