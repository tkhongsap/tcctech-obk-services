using System;
using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.MT;

namespace TCCT.ServiceAbstraction.Application.Features.MT.Parking.GetTrafficStatusRecord;

public class GetTrafficStatusRecordHandler : ICommandHandler<GetTrafficStatusRecordCommand, GetTrafficStatusRecordResult>
{
    private readonly IMTService _service;
    public GetTrafficStatusRecordHandler(IMTService service)
    {
        _service = service;
    }

	public async Task<GetTrafficStatusRecordResult> Handle(GetTrafficStatusRecordCommand request, CancellationToken cancellationToken)
	{
		return await _service.GetTrafficStatusRecord(request);
	}
}
