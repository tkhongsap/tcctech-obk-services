using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using TCCTOBK.OperationBackend.Domain.Common;

namespace TCCTOBK.OperationBackend.Domain.Entities;

[Table("trMarcomSurveyAnswerDetail")]
public class trMarcomSurveyAnswerDetail : Auditable
{
  [Key]
  [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
  public Guid MSADID { get; set; }
  [ForeignKey(nameof(trMarcomSurveyAnswer))]
  public Guid MSAID { get; set; } // Foreign key to trMarcomSurveyAnswer
}
