using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Distributed;
using TCCTOBK.OperationBackend.Application.Contracts;

namespace TCCTOBK.OperationBackend.Application.Features.Marcom.Config.Command.Config;

public class ConfigMarcomHandler : IRequestHandler<ConfigMarcomCommand, ConfigMarcomResult>
{
	IUnitOfWork _uow;
	IDistributedCache _cache;
	public ConfigMarcomHandler(IUnitOfWork uow, IDistributedCache cache)
	{
		_uow = uow;
		_cache = cache;
	}
	public async Task<ConfigMarcomResult> Handle(ConfigMarcomCommand request, CancellationToken cancellationToken)
	{

		ConfigMarcom updateConfig = new ConfigMarcom(request.Type, request.Time, request.IsShowMessage);

		await _uow.MarcomRepository.UpdateConfig(updateConfig, request);
		await _uow.SaveChangeAsyncWithCommit();

		_cache.Remove("MarcomConfig");

		return new ConfigMarcomResult() { StatusCode = StatusCodes.Status200OK, Message = "Success" };
	}
}
