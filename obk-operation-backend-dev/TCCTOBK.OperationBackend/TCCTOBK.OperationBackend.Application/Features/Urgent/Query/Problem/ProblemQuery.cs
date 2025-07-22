using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Helper.Table;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Application.Features.Urgent.Query.Problem;
public class ProblemQuery  : TableState, IQuery<List<mtSRProblem>>

{
    public Guid? Id { get; set; }
    public string? Name { get; set; }
}
