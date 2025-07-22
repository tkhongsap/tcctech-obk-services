using System;
using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts.API;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.PPM.Query.PPMTransection;

public class PPMTransectionHandler : IQueryHandler<PPMTransectionQuery, List<PPMTransectionResult>>
{
  private readonly IAbstractionService _apiService;

  public PPMTransectionHandler(IAbstractionService apiService)
  {
    _apiService = apiService;
  }

  public async Task<List<PPMTransectionResult>> Handle(PPMTransectionQuery request, CancellationToken cancellationToken)
  {
    var data = await _apiService.CertisTransaction.GetPPMTransaction(request.PPMID);
    var res = data.Select(x => new PPMTransectionResult()
    {
      id = x.id,
      commentTypeId = x.commentTypeId,
      woId = x.woId,
      message = x.message,
      createdOn = x.createdOn,
      createdBy = x.createdBy,
      createdDate = x.createdOn?.AddHours(7).ToString("dd MMM yyyy h:mm:sstt") ?? "-"
    }).ToList();
    res = res.OrderByDescending(x => x.createdOn).ToList();
    return res;
  }
}
