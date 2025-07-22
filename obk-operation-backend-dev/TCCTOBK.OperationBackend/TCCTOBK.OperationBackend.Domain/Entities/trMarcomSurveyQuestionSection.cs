using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using TCCTOBK.OperationBackend.Domain.Common;

namespace TCCTOBK.OperationBackend.Domain.Entities;

[Table("trMarcomSurveyQuestionSection")]
public class trMarcomSurveyQuestionSection
{
  [ForeignKey(nameof(trMarcomSurveyQuestion))]
  public Guid MSQID { get; set; }
  public trMarcomSurveyQuestion trMarcomSurveyQuestion { get; set; } = new trMarcomSurveyQuestion();
  [ForeignKey(nameof(trMarcomSurveySection))]
  public Guid MSSID { get; set; }
  public trMarcomSurveySection trMarcomSurveySection { get; set; } = new trMarcomSurveySection();
}
