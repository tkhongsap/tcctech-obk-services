using Microsoft.EntityFrameworkCore;
using TCCTOBK.OperationBackend.Application.Contracts;

namespace TCCTOBK.OperationBackend.Application.Repositories;
public class BaseRepository
{
	protected readonly ITCCTOBKContext Context;

	public BaseRepository(ITCCTOBKContext context)
	{
		Context = context;
	}
}

public class BaseRepository<T> where T : class
{
	protected readonly ITCCTOBKContext Context;
	public DbSet<T> Db { get; }

	public BaseRepository(ITCCTOBKContext context)
	{
		Context = context;
		Db = context.Set<T>();
	}
}
