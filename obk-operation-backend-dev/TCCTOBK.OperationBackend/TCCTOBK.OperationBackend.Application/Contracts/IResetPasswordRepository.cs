using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Application.Contracts;

public interface IResetPasswordRepository
{
	public Task<trResetPassword?> Get(string resetpasswordcode);
	public Task<List<trResetPassword>> GetList(Guid mid);
	public Task<string> Create(Guid mid, taMember member);
	public Task<bool> UpdateStatus(Guid mid, string resetpasswordcode);
	public Task<bool> CloseAllMember(Guid mid);
}
