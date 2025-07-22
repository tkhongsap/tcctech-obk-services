using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.Netatmo;
using TCCT.ServiceAbstraction.Application.Exceptions;
using TCCT.ServiceAbstraction.Application.Features.Netatmo.Command.Synchomeschedule;

namespace TCCT.ServiceAbstraction.Application.Features.Netatmo.Command.UpsertUserToken;
public class UpsertUserTokenHandler : ICommandHandler<UpsertUserTokenCommand, UpsertUserTokenResult>
{
	private readonly INetatmoService _netatmoservice;
	public UpsertUserTokenHandler(INetatmoService netatmoservice)
	{
		_netatmoservice = netatmoservice;
	}
	public async Task<UpsertUserTokenResult> Handle(UpsertUserTokenCommand request, CancellationToken cancellationToken)
	{
		int countInsert = 0;
		int countUpdate = 0;
		foreach (var data in request.Data) {
			var (responseInsert, responseUpdate) = await _netatmoservice.UpsertUserToken(data);
			countInsert = countInsert + responseInsert;
			countUpdate = countUpdate + responseUpdate;
		}
		return new UpsertUserTokenResult
		{
			CountInsert = countInsert
		};
	}
}