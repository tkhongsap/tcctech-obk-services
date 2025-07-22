using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using TCCTOBK.OperationBackend.Domain.Common;

namespace TCCTOBK.OperationBackend.Domain.Entities;

[Table("trMarcomSurveyAnswer")]
public class trMarcomSurveyAnswer : Auditable
{
  [Key]
  [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
  public Guid MSAID { get; set; }
  [ForeignKey(nameof(trMarcomSurvey))]
  public Guid MSID { get; set; } // Foreign key to trMarcomSurvey
  public List<trMarcomSurveyAnswerDetail> trMarcomSurveyAnswerDetails { get; set; } = new List<trMarcomSurveyAnswerDetail>();
  public DateTime SubmitDate { get; set; }
  public Guid? UserId { get; set; }
  public string? UserName { get; set; }
}

