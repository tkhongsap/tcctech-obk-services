using System.ComponentModel.DataAnnotations.Schema;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Domain;

[Table("SOCUserTanent")]
public class SOCUserTanent
{
  [ForeignKey(nameof(SOCUser))]
  public Guid SID { get; set; }
  public SOCUser SOCUser = default!;

  [ForeignKey(nameof(Tenant))]
  public Guid TID { get; set; }
  public Tenant Tenant { get; set; } = default!;

}
