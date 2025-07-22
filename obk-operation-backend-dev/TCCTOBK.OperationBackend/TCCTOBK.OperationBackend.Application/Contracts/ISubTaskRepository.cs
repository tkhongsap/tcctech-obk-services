using TCCTOBK.OperationBackend.Application.Contracts.DataModel.SubtaskRepository;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;
using TCCTOBK.OperationBackend.Application.Helper.Table;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Application.Contracts;
public interface ISubtaskRepository
{
	Task<List<trSubtask>> GetAll(string? filter, List<Guid>? idList, TableState state);
	Task<int> GetAllCount(string? filter, List<Guid>? idList);
	Task<Guid> CreateSubtask(CreateSubtaskModel action, AuditableModel auditable);
	Task UpdateSubtask(UpdateSubtaskModel action, AuditableModel auditable);
	Task RemoveSubtask(List<Guid> stids);
	Task<trSubtask> GetById(Guid id, bool scope);
	Task<List<Guid>> BulkCreateSubtask(List<CreateSubtaskModel> subtasks, AuditableModel auditable);
}
