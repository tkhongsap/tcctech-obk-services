using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using TCCTOBK.OperationBackend.Domain.Common;

namespace TCCTOBK.OperationBackend.Domain.Entities;

[Table("trMarcomSurveyQuestionType")]
public class trMarcomSurveyQuestionType : Auditable
{
  [Key]
  [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
  public Guid MSQID { get; set; }
  public int Type { get; set; }
  [MaxLength(100)]
  [Column(TypeName = "character varying")]
  public string Title { get; set; } = default!;

  [MaxLength(500)]
  [Column(TypeName = "character varying")]
  public string? Description { get; set; }

  [Required]
  [Column(TypeName = "character varying")]
  public string TypeConfig { get; set; } = default!;
}