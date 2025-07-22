using TCCTOBK.OperationBackend.Application;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Repositories;
using TCCTOBK.OperationBackend.Domain;

namespace TCCTOBK.OperationBackend.Infrastructure;

public class WorkTransactionRepository : BaseRepository<WorkTransaction>, IWorkTransactionRepository
{
	public WorkTransactionRepository(ITCCTOBKContext context) : base(context)
	{
	}
}

