using TCCTOBK.OperationBackend.Application.Contracts.DataModel.ActivityProcedureRepository;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;
using TCCTOBK.OperationBackend.Application.Helper.Table;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Application.Contracts;
public interface IActivityProcedureRepository
{
	Task<bool> CheckDuplicate(string code);
	Task<List<trActivityProcedure>> GetAll(string? filter, bool scope, TableState state);
	Task<int> GetAllCount(string? filter, bool scope);
	Task<trActivityProcedure> GetById(Guid id, bool scope);
	Task<Guid> CreateActivityProcedure(CreateActivityProcedureModel ap, AuditableModel auditable);
	Task UpdateActivityProcedure(UpdateActivityProcedureModel ap, AuditableModel auditable);
	Task<int> DeleteActivityProcedure(Guid id, AuditableModel auditable);

}
