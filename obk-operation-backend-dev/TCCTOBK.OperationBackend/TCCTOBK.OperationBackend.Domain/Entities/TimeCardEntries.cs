using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using TCCTOBK.OperationBackend.Domain.Common;

namespace TCCTOBK.OperationBackend.Domain.Entities;

[Table("TimeCardEntries")]
public class TimeCardEntries : Auditable
{
  [Key]
  [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
  public Guid CAID { get; set; }
  [Required]
  public Guid TSID { get; set; }
  [Required]
  public required string KCUsername { get; set; }
  [Required]
  [MaxLength(100)]
  [Column(TypeName = "timestamp without time zone")]
  public DateTime CheckIn { get; set; }
  [MaxLength(100)]
  [Column(TypeName = "timestamp without time zone")]
  public DateTime? CheckOut { get; set; }
  public bool IsActive { get; set; }
}
