using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Domain;

[Table("trCaseMedias")]
public class trCaseMedias
{
  [Key]
  [Required]
  public int Id { get; set; }
  public int CaseId { get; set; }

  [Required]
  public required string FileName { get; set; }
  [Required]
  public required string Data { get; set; }
  [Required]
  public required string MimeType { get; set; }
}