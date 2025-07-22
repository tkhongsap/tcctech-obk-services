using TCCTOBK.OperationBackend.Application.Configuration.Queries;

namespace TCCTOBK.OperationBackend.Application;

public class GetReportCheckInCheckOutQuery : IQuery<GetReportCheckInCheckOutResult>
{
    public required string ShiftName { get; set; }
    public DateTime? Date { get; set; } 
}
