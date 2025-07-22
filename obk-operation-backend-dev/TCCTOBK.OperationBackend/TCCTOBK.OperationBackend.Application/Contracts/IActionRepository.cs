using TCCTOBK.OperationBackend.Application.Contracts.DataModel.ActionRepository;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;
using TCCTOBK.OperationBackend.Application.Helper.Table;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Application.Contracts;
public interface IActionRepository
{
	Guid CreateAction(CreateActionModel action, AuditableModel auditable);
	Task UpdateAction(UpdateActionModel action, AuditableModel auditable);
	Task<int> RemoveAction(Guid aid);
	Task<List<trAction>> GetAll(Guid? actionId, Guid? actionTypeId, string? filter, List<Guid>? idList, TableState state);
	Task<int> GetAllCount(Guid? actionId, Guid? actionTypeId, string? filter, List<Guid>? idList);
	Task<trAction> GetById(Guid id, bool scope);
}
