using TCCTOBK.OperationBackend.Application.Contracts.DataModel.TaskSubtaskRepository;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Application.Contracts;
public interface ITaskSubtaskRepository
{
	Task CreateTaskSubtask(List<CreateTaskSubtaskModel> fTaskSubtasks, AuditableModel auditable);
	Task RemoveTaskSubtasks(Guid tid);
	Task<List<trTaskSubtask>> GetAll(Guid? tid, Guid? stid, bool scope);
}
