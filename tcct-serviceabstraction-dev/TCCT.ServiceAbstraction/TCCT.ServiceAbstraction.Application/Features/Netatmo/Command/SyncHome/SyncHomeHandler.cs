using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.Netatmo;
using TCCT.ServiceAbstraction.Application.Exceptions;
using TCCT.ServiceAbstraction.Application.Features.Netatmo.Command.Synchomeschedule;

namespace TCCT.ServiceAbstraction.Application.Features.Netatmo.Command.SyncHome;
public class SyncHomeHandler : ICommandHandler<SyncHomeCommand, SyncHomeResult>
{
	private readonly INetatmoService _netatmoservice;
	public SyncHomeHandler(INetatmoService netatmoservice)
	{
		_netatmoservice = netatmoservice;
	}
	public async Task<SyncHomeResult> Handle(SyncHomeCommand request, CancellationToken cancellationToken)
	{
		var countSuccess = await _netatmoservice.SyncHome(request.Limit);
		return new SyncHomeResult
		{
			Success = countSuccess
		};
	}
}