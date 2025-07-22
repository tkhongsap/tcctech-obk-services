using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using TCCTOBK.OperationBackend.Domain.Common;

namespace TCCTOBK.OperationBackend.Domain.Entities;

[Table("UsageLogMonitoring")]
public class UsageLogMonitoring
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid Id { get; set; }
    public int? FixedDailyUserTarget { get; set; }
    public int? AtcualActiveDailyUser { get; set; }
    public int? TotlaOnGroundStaffMustUseOpsApp { get; set; }
    public int? TotalDalilyOnGroundStaffMustUseOpsAppWithRegister { get; set; }
    public int? TotalDalilyOnGroundStaffMustUseOpsAppWithOutRegister { get; set; }

    [Column(TypeName = "character varying")]
    public string? Component { get; set; }
    [Column(TypeName = "character varying")]
    public string? Statistics { get; set; }
    [Column(TypeName = "character varying")]
    public string? AllStaff { get; set; }

    public int? SumWeekDay { get; set; }
    public int? SumWeekEnd { get; set; }
    public required string SyncDate { get; set; }

    [Column(TypeName = "timestamp without time zone")]
    public DateTime? CreatedAt { get; set; }

    public Guid? CSID { get; set; }

}
