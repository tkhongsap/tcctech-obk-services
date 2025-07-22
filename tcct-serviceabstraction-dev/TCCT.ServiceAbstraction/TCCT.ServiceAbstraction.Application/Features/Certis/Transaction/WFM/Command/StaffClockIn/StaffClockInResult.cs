using System.Text.Json.Serialization;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.WFM.Command.StaffClockIn;
public class StaffClockInResult
{
    public int? Id { get; set; }
    public int? DutyShiftId { get; set; }
    public DutyShift? DutyShift { get; set; }
    public DateTime? ShiftDate { get; set; }
    public DateTime? ShiftStart { get; set; }
    public DateTime? ShiftEnd { get; set; }
    public bool? OTApplicable { get; set; }
    public int? StaffId { get; set; }
    public string? StaffName { get; set; }
    public int? FunctionRoleId { get; set; }
    public string? FunctionRoleName { get; set; }
    public DateTime? ClockIn { get; set; }
    public bool? IsLate { get; set; }
}

public class DutyShift
{
    public int? Id { get; set; }
    public string? Code { get; set; }
    public string? Name { get; set; }
    public DateTime? EffectiveStartDate { get; set; }
    public string? StartTime { get; set; }
    public int? DurationMin { get; set; }
    public bool? OTApplicable { get; set; }
    public int? LocationKey { get; set; }
    public string? LocationName { get; set; }
    public string? ColorCode { get; set; }
    public List<Staff>? Staff { get; set; }
    public List<Task>? Tasks { get; set; }
    public RepeatConfig? RepeatConfig { get; set; }
    public List<Attendance>? Attendance { get; set; }
}

public class Staff
{
    public int? FunctionRoleId { get; set; }
    public int? Quantity { get; set; }
}

public class Task
{
    public float? SeqNo { get; set; }
    public string? Description { get; set; }
    public int? LocationId { get; set; }
}

public class RepeatConfig
{
    public string? RepeatType { get; set; }
    public int? Frequency { get; set; }
    public DateTime? EndDate { get; set; }
}

public class Attendance
{
}

