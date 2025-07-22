using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts.API;

namespace TCCTOBK.OperationBackend.Application;

public class CountStatusPPMHandler : IQueryHandler<CountStatusPPMQuery, CountStatusPPMResult>
{
  private readonly IAbstractionService _apiService;

  public CountStatusPPMHandler(IAbstractionService apiService)
  {
    _apiService = apiService;
  }

  public async Task<CountStatusPPMResult> Handle(CountStatusPPMQuery request, CancellationToken cancellationToken)
  {
    var ppm = await _apiService.CertisTransaction.GetAllPPMWorkOrderList();
    var result = new CountStatusPPMResult()
    {
      NewCount = ppm.Where(x => x.StatusId == 1).Count(),
      AssignedCount = ppm.Where(x => x.StatusId == 2).Count(),
      CompletedCount = ppm.Where(x => x.StatusId == 5).Count(),
      ClosedCount = ppm.Where(x => x.StatusId == 6).Count(),
      RejectedCount = ppm.Where(x => x.StatusId == 8).Count(),
    };
    return result;
  }
}
