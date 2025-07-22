using MediatR;
using TCCTOBK.OperationBackend.Application.Contracts;

namespace TCCTOBK.OperationBackend.Application.Features.OBOperation.AppConfig.Query.GetAppConfigByName;
internal class GetAppConfigByNameHandler : IRequestHandler<GetAppConfigByNameQuery, string>
{
	private readonly IUnitOfWork _uow;

	public GetAppConfigByNameHandler(IUnitOfWork uow)
	{
		_uow = uow;
	}

	public Task<string> Handle(GetAppConfigByNameQuery request, CancellationToken cancellationToken)
	{
		return _uow.AppConfigRepository.GetValueByName(request.Name);
	}
}
