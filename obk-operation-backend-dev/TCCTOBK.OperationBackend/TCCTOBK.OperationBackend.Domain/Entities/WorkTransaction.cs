using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using TCCTOBK.OperationBackend.Domain.Common;

namespace TCCTOBK.OperationBackend.Domain;

public class WorkTransaction : Auditable
{
  [Key]
  [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
  public Guid TID { get; set; }
  [Required]
  public required int Transactiontype { get; set; }
  public DateTime? CheckIn { get; set; }
  public DateTime? CheckOut { get; set; }
  public string? HoneywellResponeDataJson { get; set; }
  [Required]
  public required Guid SID { get; set; }
  [DefaultValue(true)]
  public bool IsActive { get; set; } = true;
}
