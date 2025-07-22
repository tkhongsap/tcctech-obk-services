using MediatR;
using Microsoft.AspNetCore.Http;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Features.Operation.UsageMonitoring.Roster.Command.UpsertRoster;
using TCCTOBK.OperationBackend.Application.Helper.Service;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.UsageMonitoring.EventLogs.Command.CreateEventLog;

public class CreateEventLogHandler : IRequestHandler<CreateEventlogCommand, CreateEventLogResult>
{
	private readonly IUnitOfWork _uow;
    private readonly IClientSiteService _clientSiteService;

    public CreateEventLogHandler(IUnitOfWork uow, IClientSiteService clientSiteService)
    {
        _uow = uow;
        _clientSiteService = clientSiteService;

    }
	public async Task<CreateEventLogResult> Handle(CreateEventlogCommand request, CancellationToken cancellationToken)
	{
		var headerClient = _clientSiteService.ClientSiteId;
        var keycloakUserId = request.UserName;

        CreateEventlogCommand data = new CreateEventlogCommand();
            data.Type = request.Type.ToUpper();
			data.Time = request.Time;
            data.ipAddress = request.ipAddress;
			data.AuthMethod = request.AuthMethod;
			data.TokenId = request.TokenId;
			data.GrantType = request.GrantType;
			data.RefreshTokenType = request.RefreshTokenType;
			data.Scope = request.Scope;
			data.RefreshTokenId = request.RefreshTokenId;
			data.ClientAuthMethod = request.ClientAuthMethod;
			data.UserName = new Guid(keycloakUserId.ToString());
            data.CSID = new Guid(headerClient.ToString());
		
		await _uow.EventsLogRepository.CreateEventsLog(data);
		await _uow.SaveChangeAsyncWithCommit();
		return new CreateEventLogResult();
	}
}
