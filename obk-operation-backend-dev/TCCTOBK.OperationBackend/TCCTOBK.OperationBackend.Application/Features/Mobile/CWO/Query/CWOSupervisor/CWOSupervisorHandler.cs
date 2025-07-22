using System;
using MediatR;
using TCCTOBK.OperationBackend.Application.Contracts.API;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.CWO.Query.CWOSupervisor;

public class CWOSupervisorHandler : IRequestHandler<CWOSupervisorQuery, List<CWOSupervisorResult>>
{
  private readonly IAbstractionService _apiService;

  public CWOSupervisorHandler(IAbstractionService apiService)
  {
    _apiService = apiService;
  }

  public async Task<List<CWOSupervisorResult>> Handle(CWOSupervisorQuery request, CancellationToken cancellationToken)
  {
    var data = await _apiService.MasterData.FMsupervisors();
    var res = data.Select(x => new CWOSupervisorResult() { Id = x.id, Email = x.email, FullName = x.fullName }).OrderBy(x => x.FullName).ToList();
    return res;
  }
}
