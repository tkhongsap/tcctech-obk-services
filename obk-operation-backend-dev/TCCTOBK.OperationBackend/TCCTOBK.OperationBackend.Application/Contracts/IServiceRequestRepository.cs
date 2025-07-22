using TCCTOBK.OperationBackend.Application.Helper.Auditable;
using TCCTOBK.OperationBackend.Domain.Entities;
using TCCTOBK.OperationBackend.Application.Helper.Table;
using TCCTOBK.OperationBackend.Application.Features.Operation.PPM.Model;

namespace TCCTOBK.OperationBackend.Application;

public interface IServiceRequestRepository
{
    Task<trServiceRequest> GetByName(string name);
    Task<List<trServiceRequest>> Paginate(string? status, TableState state);
    Task Add(trServiceRequest serviceRequest);
    Task Update(trServiceRequest serviceRequest);
    Task<trServiceRequest> GetById(Guid id);
    Task<int> GetCount(string? status);
}
