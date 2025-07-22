using TCCTOBK.OperationBackend.Application;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Repositories;
using TCCTOBK.OperationBackend.Domain;

namespace TCCTOBK.OperationBackend.Infrastructure;

public class UnitRepository : BaseRepository<Unit>, IUnitRepository
{
  public UnitRepository(ITCCTOBKContext context) : base(context)
  {

  }
}
