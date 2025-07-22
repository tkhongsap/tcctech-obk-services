using TCCTOBK.OperationBackend.Application.Configuration.Queries;

namespace TCCTOBK.OperationBackend.Application;

public class GetReportAttendantQuery : IQuery<GetReportAttendantResult>
{
    public required string ShiftName { get; set; }
    public DateTime? Date { get; set; } 
}
