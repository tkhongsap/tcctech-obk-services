using TCCTOBK.OperationBackend.Application.Helper.Auditable;

namespace TCCTOBK.OperationBackend.Application.Contracts;
public interface IInviteMemberRepository
{
	Task<Guid?> Get(Guid mid, string invitecode);
	Task UpdateStatus(string invitecode);
	Task<string> Create(Guid mid, AuditableModel auditable);
	Task UpdateStatusMID(Guid mid);
}
