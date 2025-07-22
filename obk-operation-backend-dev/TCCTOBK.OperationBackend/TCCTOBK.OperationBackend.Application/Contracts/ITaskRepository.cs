using TCCTOBK.OperationBackend.Application.Contracts.DataModel.TaskRepository;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;
using TCCTOBK.OperationBackend.Application.Helper.Table;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Application.Contracts;
public interface ITaskRepository
{
	Task<List<trTask>> GetAll(Guid? memberId, string? filter, List<Guid>? idList, string? dateStart, string? dateEnd, TableState state, int? status);
	Task<int> GetAllCount(Guid? memberId, string? filter, List<Guid>? idList, string? dateStart, string? dateEnd, int? status);
	Task<Dictionary<int, int>> GetStatusCount(Guid? memberId, string? filter, List<Guid>? idList, string? dateStart, string? dateEnd, int? status);
	Task<Guid> UpdateTaskById(UpdateTaskModel task, AuditableModel auditable);
	Task<trTask> GetById(Guid id, bool scope);
	Task<bool> CheckDuplicate(string name);
	Task<bool> CheckDuplicate(Guid id, string name);
	Task<Guid> CreateTask(CreateTaskModel task, AuditableModel auditable);
	Task RemoveTask(Guid tid);
}
