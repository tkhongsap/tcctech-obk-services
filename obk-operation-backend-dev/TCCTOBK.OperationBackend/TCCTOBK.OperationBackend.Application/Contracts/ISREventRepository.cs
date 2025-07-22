using TCCTOBK.OperationBackend.Domain.Entities;
using TCCTOBK.OperationBackend.Application.Helper.Table;

namespace TCCTOBK.OperationBackend.Application;

public interface ISREventRepository
{
    Task<mtSREvent> GetByName(string name);
    Task<List<mtSREvent>> Paginate(TableState state);
    Task Add(mtSREvent entity);
    Task<List<mtSREvent>> GetFromList(List<Guid> names);
}
