using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using TCCTOBK.OperationBackend.Domain.Common;

namespace TCCTOBK.OperationBackend.Domain;

public class Unit : Auditable
{
  [Key]
  [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
  [Required]
  public required Guid UID { get; set; }
  [Required]
  public required string UnitNo { get; set; }
  public float? Area { get; set; }
  public float? InlineAreaIndoorZone { get; set; }
  public float? InlineAreaOutdoorZone { get; set; }
  public int? IndoorSpillOutSeating { get; set; }
  public int UnitType { get; set; }
  public float? Lat { get; set; }
  public float? Long { get; set; }
  [ForeignKey(nameof(Location))]
  public Guid LID { get; set; }
  public Location Location { get; set; }
  [DefaultValue(true)]
  public bool IsActive { get; set; } = true;
}
