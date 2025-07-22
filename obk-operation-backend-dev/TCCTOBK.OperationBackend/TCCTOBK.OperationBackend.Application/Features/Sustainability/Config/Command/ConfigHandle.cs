using MediatR;
using Microsoft.AspNetCore.Http;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Exceptions;
using TCCTOBK.OperationBackend.Domain;

namespace TCCTOBK.OperationBackend.Application.Features.Sustainability.Config.Command.Config;

public class ChangeOrderHandler : IRequestHandler<ConfigCommand, ConfigResult>
{
	IUnitOfWork _uow;
	public ChangeOrderHandler(IUnitOfWork uow)
	{
		_uow = uow;
	}
	public async Task<ConfigResult> Handle(ConfigCommand request, CancellationToken cancellationToken)
	{

		ConfigSustainability updateConfig = new ConfigSustainability( request.Type, request.Time);

		await _uow.SustainabilityRepository.UpdateConfig(updateConfig, request);
		await _uow.SaveChangeAsyncWithCommit();

		return new ConfigResult() { StatusCode = StatusCodes.Status200OK, Message = "Success" };
	}
}
