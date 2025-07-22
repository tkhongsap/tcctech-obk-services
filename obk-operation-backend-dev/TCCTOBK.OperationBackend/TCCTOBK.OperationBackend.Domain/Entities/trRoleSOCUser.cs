using System.ComponentModel;
using System.ComponentModel.DataAnnotations.Schema;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Domain;

[Table("trRoleSOCUser")]
public class trRoleSOCUser
{
  [ForeignKey(nameof(trRole))]
  public Guid RID { get; set; }

  public trRole trRole { get; set; } = default!;

  [ForeignKey(nameof(SOCUser))]
  public Guid SID { get; set; }

  public SOCUser SOCUser { get; set; } = default!;

  [DefaultValue(true)]
  public bool IsActive { get; set; } = true;
}
