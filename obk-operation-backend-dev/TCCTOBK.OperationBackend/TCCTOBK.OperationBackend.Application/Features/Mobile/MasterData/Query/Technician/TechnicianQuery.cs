using TCCTOBK.OperationBackend.Application.Configuration.Queries;

namespace TCCTOBK.OperationBackend.Application;

public class TechnicianQuery : IQuery<TechnicianResult>
{
    public int? ServiceType { get; set; }
}
