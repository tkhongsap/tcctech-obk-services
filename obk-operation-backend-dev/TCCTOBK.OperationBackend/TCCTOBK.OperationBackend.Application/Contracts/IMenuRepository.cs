using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Application.Contracts;
public interface IMenuRepository
{
	Task<List<mtMenu>> GetMenuByRole(string keyCloakUserId, Guid csid);
}
