using System.ComponentModel;
using System.ComponentModel.DataAnnotations.Schema;

namespace TCCTOBK.OperationBackend.Domain.Entities;

[Table("TenantMember")]
public class TenantMember
{
  [ForeignKey(nameof(ClientSite))]

  public Guid? CSID { get; set; } = Constant.OBK_CLIENT_SITE;
  public ClientSite? ClientSite { get; set; } = default!;

  [ForeignKey(nameof(Tenant))]
  public Guid TID { get; set; }
  public Tenant Tenant { get; set; } = default!;

  [ForeignKey(nameof(taMember))]
  public Guid MID { get; set; }
  public taMember taMember { get; set; } = default!;
}
