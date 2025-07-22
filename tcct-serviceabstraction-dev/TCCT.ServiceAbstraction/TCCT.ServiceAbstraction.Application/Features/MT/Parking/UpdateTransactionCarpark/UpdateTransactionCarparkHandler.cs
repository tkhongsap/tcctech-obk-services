using System;
using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.MT;

namespace TCCT.ServiceAbstraction.Application.Features.MT.Parking.UpdateTransactionCarpark;

public class UpdateTransactionCarparkHandler : ICommandHandler<UpdateTransactionCarparkCommand, UpdateTransactionCarparkResult>
{
    private readonly IMTService _service;
    public UpdateTransactionCarparkHandler(IMTService service)
    {
        _service = service;
    }

	public async Task<UpdateTransactionCarparkResult> Handle(UpdateTransactionCarparkCommand request, CancellationToken cancellationToken)
	{
		return await _service.UpdateTransactionCarpark(request);
	}
}
