using TCCTOBK.OperationBackend.Application.Configuration.Queries;

namespace TCCTOBK.OperationBackend.Application;

public class TaskDetailReportQuery : IQuery<TaskDetailReportResult>
{
   public required string TID { get; set; }
}
