using TCCTOBK.OperationBackend.Application.Contracts.DataModel.ActionTypeRepository;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;
using TCCTOBK.OperationBackend.Application.Helper.Table;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Application.Contracts;
public interface IActionTypeRepository
{
	Task<Guid> CreateActionType(CreateActionTypeModel action, AuditableModel auditable);
	Task UpdateActionType(UpdateActionTypeModel action, AuditableModel auditable);
	Task<int> RemoveActionType(Guid aid);
	Task<List<mtActionType>> GetAll(Guid? atid, string? filter, List<Guid>? idList, TableState state);
	Task<int> GetAllCount(Guid? atid, string? filter, List<Guid>? idList);
	Task<mtActionType> GetById(Guid id);
}
