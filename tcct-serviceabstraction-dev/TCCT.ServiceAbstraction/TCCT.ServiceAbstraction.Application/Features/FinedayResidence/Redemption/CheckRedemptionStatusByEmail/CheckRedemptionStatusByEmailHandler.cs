using System;
using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.FinedayResidence;

namespace TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Redemption.CheckRedemptionStatusByEmail;

public class CheckRedemptionStatusByEmailHandler : ICommandHandler<CheckRedemptionStatusByEmailCommand, CheckRedemptionStatusByEmailResult>
{
    private readonly IFinedayResidenceService _service;
    public CheckRedemptionStatusByEmailHandler(IFinedayResidenceService service)
    {
        _service = service;
    }

    public async Task<CheckRedemptionStatusByEmailResult> Handle(CheckRedemptionStatusByEmailCommand request, CancellationToken cancellationToken)
    {
        return await _service.CheckRedemptionStatusByEmail(request);
    }
}