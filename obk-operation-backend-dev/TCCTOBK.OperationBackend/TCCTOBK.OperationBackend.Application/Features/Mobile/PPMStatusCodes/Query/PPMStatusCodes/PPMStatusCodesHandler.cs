using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts.API;
using TCCTOBK.OperationBackend.Application.Features.Operation.MasterData.Location.Model;

namespace TCCTOBK.OperationBackend.Application;

public class PPMStatusCodesHandler : IQueryHandler<PPMStatusCodesQuery, PPMStatusCodesResult>
{

  private readonly IAbstractionService _apiService;

  public PPMStatusCodesHandler(IAbstractionService apiService)
  {
    _apiService = apiService;
  }
  public async Task<PPMStatusCodesResult> Handle(PPMStatusCodesQuery request, CancellationToken cancellationToken)
  {
    var res = new PPMStatusCodesResult{};
		return res;

  }

}

