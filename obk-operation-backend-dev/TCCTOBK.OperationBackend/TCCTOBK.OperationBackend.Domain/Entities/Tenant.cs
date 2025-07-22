using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using TCCTOBK.OperationBackend.Domain.Common;

namespace TCCTOBK.OperationBackend.Domain.Entities;

[Table("Tenant")]
public class Tenant : Auditable
{
  [Key]
  [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
  public Guid TID { get; set; }
  [Required]
  [MaxLength(500)]
  [Column(TypeName = "character varying")]
  public string Name { get; set; } = default!;

  [Column(TypeName = "character varying")]
  public string description { get; set; } = default!;
  [DefaultValue(true)]
  public bool IsActive { get; set; } = true;
  public List<TenantMember> tenantMembers { get; set; } = new();
}
