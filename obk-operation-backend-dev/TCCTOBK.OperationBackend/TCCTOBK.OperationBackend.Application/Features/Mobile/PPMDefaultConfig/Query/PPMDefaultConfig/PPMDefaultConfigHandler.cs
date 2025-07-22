using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts.API;
using TCCTOBK.OperationBackend.Application.Features.Operation.MasterData.Location.Model;

namespace TCCTOBK.OperationBackend.Application;

public class PPMDefaultConfigHandler : IQueryHandler<PPMDefaultConfigQuery, PPMDefaultConfigResult>
{

  private readonly IAbstractionService _apiService;

  public PPMDefaultConfigHandler(IAbstractionService apiService)
  {
    _apiService = apiService;
  }
  public async Task<PPMDefaultConfigResult> Handle(PPMDefaultConfigQuery request, CancellationToken cancellationToken)
  {
    var res = new PPMDefaultConfigResult{};
		return res;

  }

}

