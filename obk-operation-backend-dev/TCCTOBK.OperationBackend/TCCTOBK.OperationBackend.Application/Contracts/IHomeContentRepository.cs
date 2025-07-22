using TCCTOBK.OperationBackend.Application.Helper.Auditable;
using TCCTOBK.OperationBackend.Application.Helper.Table;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Application;

public interface IHomeContentRepository
{
	Task<List<mtHomeContent>> GetList(TableState state);
	Task<int> GetListCount();
	Task<mtHomeContent> Get(Guid id);
	Task<mtHomeContent> GetCurrentVersion();
	Task Create(HomeContentUpsert data, AuditableModel auditable);
	// Task SetIsVisible()

}
