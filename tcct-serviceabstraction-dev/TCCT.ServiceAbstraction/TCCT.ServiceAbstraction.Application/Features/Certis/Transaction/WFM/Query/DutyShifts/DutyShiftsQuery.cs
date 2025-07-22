using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.WFM.Query.DutyShifts;
public class DutyShiftsQuery : IQuery<List<DutyShiftsResult>>
{
    public int? StaffId { get; set; }
    public int? LocationId { get; set; }
    public string? StartDate { get; set; }
    public string? EndDate { get; set; }
    public string? CategoryId { get; set; }
}
