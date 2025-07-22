using System;
using MediatR;
using TCCTOBK.OperationBackend.Application.Contracts.API;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.MasterData.Query.Priority;

public class PriorityHandler : IRequestHandler<PriorityQuery, List<PriorityResult>>
{

  private readonly IAbstractionService _apiService;

  public PriorityHandler(IAbstractionService apiService)
  {
    _apiService = apiService;
  }

  public async Task<List<PriorityResult>> Handle(PriorityQuery request, CancellationToken cancellationToken)
  {
    var res = new List<PriorityResult>();
    var priority = await _apiService.MasterData.FMRelatedPriorities();
    res = priority.Select(x => new PriorityResult()
    {
      Id = x.Id,
      Name = x.Name
    }).ToList();
    return res;
  }
}
