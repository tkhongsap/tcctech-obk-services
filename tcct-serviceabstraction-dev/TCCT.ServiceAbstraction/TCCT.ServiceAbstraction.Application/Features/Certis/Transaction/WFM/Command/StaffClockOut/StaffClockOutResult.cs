namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.WFM.Command.StaffClockOut;
public class StaffClockOutResult
{
    public int? Id { get; set; }
    public int? DutyShiftId { get; set; }
    public DateTime? ShiftDate { get; set; }
    public DateTime? ShiftStart { get; set; }
    public DateTime? ShiftEnd { get; set; }
    public bool? OTApplicable { get; set; }
    public int? StaffId { get; set; }
    public string? StaffName { get; set; }
    public int? FunctionRoleId { get; set; }
    public string? FunctionRoleName { get; set; }
    public DateTime? ClockIn { get; set; }
    public DateTime? ClockOut { get; set; }
    public bool? IsLate { get; set; }
}