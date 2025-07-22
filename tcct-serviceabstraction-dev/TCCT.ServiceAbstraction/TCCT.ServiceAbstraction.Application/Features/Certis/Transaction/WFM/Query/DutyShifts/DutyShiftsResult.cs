using System.Text.Json.Serialization;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.WFM.Query.DutyShifts;

public class DutyShiftsResult {
    public int? Id { get; set; }
    public string? Code { get; set; }
    public string? Name { get; set; }
    public string? EffectiveStartDate { get; set; }
    public string? StartTime { get; set; }
    public int? DurationMin { get; set; }
    public bool? OTApplicable { get; set; }
    public int? LocationKey { get; set; }
    public string? LocationName { get; set; }
    public string? ColorCode { get; set; }
    public List<Staff>? Staff { get; set; }
    public List<Task>? Tasks { get; set; }
    public RepeatConfig? RepeatConfig { get; set; }
}

public class Staff {
    public int? FunctionRoleId { get; set; }
    public int? Quantity { get; set; }
}

public class Task {
    public double? SeqNo { get; set; }
    public string? Description { get; set; }
    public double? LocationId { get; set; }
}

public class RepeatConfig {
    public string? RepeatType { get; set; }
    public int? Frequency { get; set; }
    public string? EndDate { get; set; }
}