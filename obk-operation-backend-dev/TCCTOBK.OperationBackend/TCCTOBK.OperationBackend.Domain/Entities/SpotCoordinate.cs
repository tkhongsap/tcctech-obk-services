using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using TCCTOBK.OperationBackend.Domain.Common;

namespace TCCTOBK.OperationBackend.Domain;

public class SpotCoordinate : Auditable
{
  [Key]
  [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
  public Guid CID { get; set; }
  [Required]
  public required float Lat { get; set; }
  [Required]
  public required float Long { get; set; }
  [ForeignKey(nameof(Location))]
  public Guid LID { get; set; }
  public Location Location { get; set; }
  [DefaultValue(true)]
  public bool IsActive { get; set; } = true;
}
