using System;
using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.FinedayResidence;

namespace TCCT.ServiceAbstraction.Application.Features.FinedayResidence.PreRegister.GetDataInviteVisitorTransaction;

public class GetDataInviteVisitorTransactionHandler : ICommandHandler<GetDataInviteVisitorTransactionQuery, GetDataInviteVisitorTransactionResult>
{
    private readonly IFinedayResidenceService _service;
    public GetDataInviteVisitorTransactionHandler(IFinedayResidenceService service)
    {
        _service = service;
    }

    public async Task<GetDataInviteVisitorTransactionResult> Handle(GetDataInviteVisitorTransactionQuery request, CancellationToken cancellationToken)
    {
        return await _service.GetDataInviteVisitorTransaction(request.personID);
    }
}
