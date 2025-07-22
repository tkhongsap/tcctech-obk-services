using TCCTOBK.OperationBackend.Application.Contracts.DataModel.SubtaskActionRepository;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Application.Contracts;
public interface ISubtaskActionRepository
{
	Task<trSubtaskAction> GetById(Guid? aid, Guid? stid, string? qrId, bool scope);
	Task UpdateSubtaskAction(UpdateSubtaskActionModel updateData, AuditableModel auditable);
	Task UpdateSubtaskActionsStatus(Guid id, int statusCheck, int statusUpdate, AuditableModel auditable);
	Task CreateSubtaskAction(List<CreateSubtaskActionModel> fSubtaskActions, AuditableModel auditable);
	Task RemoveSubtaskActions(List<Guid> stids);
	Task<List<trSubtaskAction>> GetAll(Guid? stid, Guid? aid, bool scope, int? statusId, bool isSkip);
}
