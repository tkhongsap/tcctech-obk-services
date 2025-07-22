using Microsoft.EntityFrameworkCore;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Repositories;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Infrastructure.Repositories;
internal class AppConfigRepository : BaseRepository<mtAppConfig>, IAppConfigRepository
{
	public AppConfigRepository(ITCCTOBKContext context) : base(context)
	{
	}

	public Task<string> GetValueByName(string name)
	{
		return Db.Where(x => x.Name == name && x.IsActive).Select(x => x.Value).FirstOrDefaultAsync();
	}
}
