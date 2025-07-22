using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using TCCTOBK.OperationBackend.Domain.Common;

namespace TCCTOBK.OperationBackend.Domain.Entities;

[Table("trMarcomSurveyQuestion")]
public class trMarcomSurveyQuestion : Auditable
{
  [Key]
  [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
  public Guid MSQID { get; set; }
  public string Title { get; set; } = default!;
  public string? Description { get; set; }
  [ForeignKey(nameof(trMarcomSurveyQuestionType))]
  public Guid MSQTID { get; set; } // Foreign key to trMarcomSurveyQuestionType
  public trMarcomSurveyQuestionType trMarcomSurveyQuestionType { get; set; } = new trMarcomSurveyQuestionType();
  public string DataJson { get; set; } = default!;

}