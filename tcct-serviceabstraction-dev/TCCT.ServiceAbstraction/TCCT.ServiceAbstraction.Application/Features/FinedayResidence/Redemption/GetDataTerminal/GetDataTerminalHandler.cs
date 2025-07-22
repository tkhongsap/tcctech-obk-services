using System;
using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.FinedayResidence;

namespace TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Redemption.GetDataTerminal;

public class GetDataTerminalHandler : IQueryHandler<GetDataTerminalQuery, List<GetDataTerminalResult>>
{
    private readonly IFinedayResidenceService _service;
    public GetDataTerminalHandler(IFinedayResidenceService service)
    {
        _service = service;
    }
    public async Task<List<GetDataTerminalResult>> Handle(GetDataTerminalQuery request, CancellationToken cancellationToken)
    {
        return await _service.GetDataTerminal(request);
    }
}
