using TCCTOBK.OperationBackend.Application.Contracts.DataModel.SchedulePlanRepository;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;
using TCCTOBK.OperationBackend.Application.Helper.Table;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Application.Contracts;
public interface ISchedulePlanRepository
{
	Task<List<Guid>> CreateSchedulePlan(List<CreateSchedulePlanModel> action, AuditableModel auditable);
	Task UpdateSchedulePlan(UpdateSchedulePlanModel action, AuditableModel auditable);
	Task<int> RemoveSchedulePlan(Guid sdpid);
	Task<List<trSchedulePlan>> GetAll(Guid? sdpid, string? filter, List<Guid>? idList, string? day, System.TimeSpan? timeStart, System.TimeSpan? timeEnd, Boolean scope, TableState state, bool? status);
	Task<int> GetAllCount(Guid? sdpid, string? filter, List<Guid>? idList, bool? status);
	Task<trSchedulePlan> GetById(Guid id, bool scope);
}
