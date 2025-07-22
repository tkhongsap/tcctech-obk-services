using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using TCCTOBK.OperationBackend.Domain.Common;

namespace TCCTOBK.OperationBackend.Domain.Entities;

[Table("trMarcomSurveySection")]
public class trMarcomSurveySection : Auditable
{
  [Key]
  [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
  public Guid MSSID { get; set; }
  public List<trMarcomSurveyQuestion> trMarcomSurveyQuestion { get; set; } = new List<trMarcomSurveyQuestion>();
  public string Title { get; set; } = default!;
  public string? Description { get; set; }
  public int Order { get; set; }
  public string? BannerImage { get; set; }
}
