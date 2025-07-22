using System;
using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.FinedayResidence;

namespace TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Redemption.RedeemParking;

public class RedeemParkingHandler : ICommandHandler<RedeemParkingCommand, RedeemParkingResult>
{
    private readonly IFinedayResidenceService _service;
    public RedeemParkingHandler(IFinedayResidenceService service)
    {
        _service = service;
    }

    public async Task<RedeemParkingResult> Handle(RedeemParkingCommand request, CancellationToken cancellationToken)
    {
        return await _service.RedeemParking(request.logCarparkID, request.terminalID, request.datetimeIn, request.runningNumber,request.plateNumber, request.memberType, request.carType, request.tenantID, request.rateCode, request.userID,request.remark);
    }
}