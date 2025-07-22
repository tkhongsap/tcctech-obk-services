using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts.API;
using TCCTOBK.OperationBackend.Application.Features.Operation.MasterData.Location.Model;

namespace TCCTOBK.OperationBackend.Application;

public class PPMFrequencyTypesHandler : IQueryHandler<PPMFrequencyTypesQuery, PPMFrequencyTypesResult>
{

  private readonly IAbstractionService _apiService;

  public PPMFrequencyTypesHandler(IAbstractionService apiService)
  {
    _apiService = apiService;
  }
  public async Task<PPMFrequencyTypesResult> Handle(PPMFrequencyTypesQuery request, CancellationToken cancellationToken)
  {
    var res = new PPMFrequencyTypesResult{};
		return res;

  }

}

