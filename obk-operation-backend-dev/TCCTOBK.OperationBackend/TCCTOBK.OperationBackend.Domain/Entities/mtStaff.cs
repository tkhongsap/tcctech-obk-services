using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.VisualBasic;
using TCCTOBK.OperationBackend.Domain.Common;

namespace TCCTOBK.OperationBackend.Domain.Entities;

[Table("mtStaff")]
public class mtStaff : Auditable
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid Sfid { get; set; }
    // public int Id { get; set; }

    [MaxLength(255)]
    [Column(TypeName = "character varying")]
    public string? StaffName { get; set; }


    [Required]
    [MaxLength(255)]
    [Column(TypeName = "character varying")]
    public required string Email { get; set; }

    [MaxLength(255)]
    [Column(TypeName = "character varying")]

    public required string Component { get; set; }


    [MaxLength(255)]
    [Column(TypeName = "character varying")]
    public string? Position { get; set; }


    [MaxLength(255)]
    [Column(TypeName = "character varying")]
    public string? Company { get; set; }

    [Column(TypeName = "character varying")]
    public string? Location { get; set; }

    [Required]
    [Column(TypeName = "boolean")]
    [DefaultValue(false)]
    public bool MustUseOpsApp { get; set; } = false;

    [Required]
    [Column(TypeName = "integer")]
    [DefaultValue(false)]
    public bool isDelete { get; set; } = false;

    [Column(TypeName = "boolean")]
    [DefaultValue(true)]
    public bool IsActive { get; set; } = true;

    [Column(TypeName = "timestamp without time zone")]
    public DateTime? UpdatedDate { get; set; }

    public int? Seq { get; set; }
	[Column(TypeName = "character varying")]
	public string? KeyCloakUserId { get; set; }

	public Guid? CSID { get; set; } = Constant.OBK_CLIENT_SITE;
}

