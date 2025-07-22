using System;
using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.FinedayResidence;

namespace TCCT.ServiceAbstraction.Application.Features.FinedayResidence.PreRegister.CancelInvite;

public class CheckPreRegisterIsPassHandler : ICommandHandler<CheckPreRegisterIsPassCommand, CheckPreRegisterIsPassResult>
{
    private readonly IFinedayResidenceService _service;
    public CheckPreRegisterIsPassHandler(IFinedayResidenceService service)
    {
        _service = service;
    }
    public async Task<CheckPreRegisterIsPassResult> Handle(CheckPreRegisterIsPassCommand request, CancellationToken cancellationToken)
	{
		return await _service.CheckPreRegisterIsPass(request);
	}
}
