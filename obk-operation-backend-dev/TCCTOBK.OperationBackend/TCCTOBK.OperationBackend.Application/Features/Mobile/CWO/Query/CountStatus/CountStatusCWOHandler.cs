using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts.API;

namespace TCCTOBK.OperationBackend.Application;

public class CountStatusCWOHandler : IQueryHandler<CountStatusCWOQuery, CountStatusCWOResult>
{
  private readonly IAbstractionService _apiService;

  public CountStatusCWOHandler(IAbstractionService apiService)
  {
    _apiService = apiService;
  }

  public async Task<CountStatusCWOResult> Handle(CountStatusCWOQuery request, CancellationToken cancellationToken)
  {
    var cwo = await _apiService.CertisTransaction.GetAllCorrectiveWorkOrder();
    var result = new CountStatusCWOResult()
    {
      NewCount = cwo.Where(x => x.StatusId == 1).Count(),
      AssignedCount = cwo.Where(x => x.StatusId == 2).Count(),
      CompletedCount = cwo.Where(x => x.StatusId == 5).Count(),
      ClosedCount = cwo.Where(x => x.StatusId == 6).Count(),
      RejectedCount = cwo.Where(x => x.StatusId == 8).Count(),
    };
    return result;
  }
}
