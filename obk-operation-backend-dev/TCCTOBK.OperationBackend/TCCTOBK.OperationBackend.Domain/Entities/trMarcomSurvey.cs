using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using TCCTOBK.OperationBackend.Domain.Common;

namespace TCCTOBK.OperationBackend.Domain.Entities;

[Table("trMarcomSurvey")]
public class trMarcomSurvey : Auditable
{
  [Key]
  [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
  public Guid MSID { get; set; }
  public DateTime? FormDate { get; set; }
  public DateTime? ToDate { get; set; }
  public int Duration { get; set; }
  public string? DurationUnit { get; set; }
  public int Status { get; set; }
  [Required]
  [MaxLength(100)]
  [Column(TypeName = "character varying")]
  public string Title { get; set; } = default!;
  [MaxLength(500)]
  [Column(TypeName = "character varying")]
  public string? Description { get; set; }
  public string? BannerImage { get; set; }
  public List<trMarcomSurveySection> trMarcomSurveySection { get; set; } = new List<trMarcomSurveySection>();
  public List<trMarcomSurveyAnswer> trMarcomSurveyAnswer { get; set; } = new List<trMarcomSurveyAnswer>();
}
