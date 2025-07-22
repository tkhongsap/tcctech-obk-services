using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.VisualBasic;
using TCCTOBK.OperationBackend.Domain.Common;

namespace TCCTOBK.OperationBackend.Domain.Entities;

[Table("trServiceRequest")]
public class trServiceRequest : Auditable
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid Id { get; set; }
    // public int Id { get; set; }

    [MaxLength(255)]
    [Column(TypeName = "character varying")]
    public string? Title { get; set; }

    [MaxLength(255)]
    [Column(TypeName = "character varying")]
    public string? Description { get; set; }

    [MaxLength(255)]
    [Column(TypeName = "character varying")]
    public Guid Acc_id { get; set; }

    [MaxLength(255)]
    [Column(TypeName = "character varying")]
    public string Status { get; set; }

    [MaxLength(255)]
    [Column(TypeName = "character varying")]
    public string? Comment { get; set; }

    [MaxLength(255)]
    [Column(TypeName = "character varying")]
    public string? Location { get; set; }

    [MaxLength(255)]
    [Column(TypeName = "character varying")]
    public string? Image { get; set; }

    [MaxLength(255)]
    [Column(TypeName = "character varying")]
    public string? Priority { get; set; }

    public string? SREventId { get; set; }
    public string? SREventOther { get; set; }
    public string? SRProblemId { get; set; }
    public string? SRProblemOther { get; set; }
    public string? LocationType { get; set; }
}

// public enum ServiceRequestStatus
// {
//     Pending,
//     InProgress,
//     Completed,
//     Cancelled
// }
