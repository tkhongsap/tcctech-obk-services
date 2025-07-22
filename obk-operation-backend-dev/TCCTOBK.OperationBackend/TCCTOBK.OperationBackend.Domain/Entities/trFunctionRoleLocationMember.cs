using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Domain;

[Table("trFunctionRoleLocationMember")]
public class trFunctionRoleLocationMember
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid FRLID { get; set; }
    public int LocationId { get; set; } = default!;

    public int FunctionRoleId { get; set; } = default!;


    [ForeignKey(nameof(taMember))]
    public Guid MID { get; set; }

    public taMember taMember { get; set; } = default!;
    public Guid CSID { get; set; } = Constant.OBK_CLIENT_SITE;
}
