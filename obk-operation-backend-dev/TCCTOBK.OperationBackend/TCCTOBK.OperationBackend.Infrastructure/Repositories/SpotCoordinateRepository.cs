using TCCTOBK.OperationBackend.Application;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Repositories;

namespace TCCTOBK.OperationBackend.Infrastructure;

public class SpotCoordinateRepository : BaseRepository<SpotCoordinateRepository>, ISpotCoordinateRepository
{
  public SpotCoordinateRepository(ITCCTOBKContext context) : base(context)
  {

  }
}
