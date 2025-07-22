using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.VisualBasic;

namespace TCCTOBK.OperationBackend.Domain.Entities;

[Table("ClientMember")]
public class ClientMember
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid CSMID { get; set; }

    [ForeignKey(nameof(taMember))]
    public Guid MID { get; set; }
    public taMember taMember { get; set; } = default!;

    public Guid CSID { get; set; }
    
    public int? StaffId { get; set; } = null;

    [Column(TypeName = "character varying")]
	public string? DataJson { get; set; }

}

