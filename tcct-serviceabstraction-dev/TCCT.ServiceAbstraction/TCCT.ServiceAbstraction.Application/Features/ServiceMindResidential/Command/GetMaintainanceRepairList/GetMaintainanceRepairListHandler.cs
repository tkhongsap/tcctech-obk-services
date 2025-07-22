using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.Netatmo;
using TCCT.ServiceAbstraction.Application.Contracts.ServiceMindResidential;
using TCCT.ServiceAbstraction.Application.Exceptions;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Command.GetMaintainanceRepairList;
public class GetMaintainanceRepairListHandler : ICommandHandler<GetMaintainanceRepairListCommand, GetMaintainanceRepairListResult>
{
	private readonly IServiceMindResidential _service;
	public GetMaintainanceRepairListHandler(IServiceMindResidential service)
	{
		_service = service;
	}
	public async Task<GetMaintainanceRepairListResult> Handle(GetMaintainanceRepairListCommand request, CancellationToken cancellationToken)
	{
		return await _service.GetMaintainanceRepairList(request);
	}
}