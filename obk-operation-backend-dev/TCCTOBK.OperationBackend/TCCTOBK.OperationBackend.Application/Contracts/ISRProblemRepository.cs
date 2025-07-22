using TCCTOBK.OperationBackend.Application.Helper.Auditable;
using TCCTOBK.OperationBackend.Domain.Entities;
using TCCTOBK.OperationBackend.Application.Helper.Table;
using TCCTOBK.OperationBackend.Application.Features.Operation.PPM.Model;

namespace TCCTOBK.OperationBackend.Application;

public interface ISRProblemRepository
{
    Task<mtSRProblem> GetByName(string name);
    Task<List<mtSRProblem>> Paginate(TableState state);
    Task<List<mtSRProblem>> GetFromList(List<Guid> names);
    Task Add(mtSRProblem entity);


}
