using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.VisualBasic;
using TCCTOBK.OperationBackend.Domain.Common;

namespace TCCTOBK.OperationBackend.Domain.Entities;

[Table("mtSREvent")]
public class mtSREvent : Auditable
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid Id { get; set; }
    // public int Id { get; set; }

    [MaxLength(255)]
    [Column(TypeName = "character varying")]
    public string? Name_th { get; set; }
    [MaxLength(255)]
    [Column(TypeName = "character varying")]
    public string? Name_en { get; set; }

}

