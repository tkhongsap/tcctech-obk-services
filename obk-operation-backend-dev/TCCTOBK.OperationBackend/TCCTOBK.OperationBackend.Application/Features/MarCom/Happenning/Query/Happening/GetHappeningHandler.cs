using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;

namespace TCCTOBK.OperationBackend.Application.Features.Marcom.Happening.Query.GetHappening;

public class GetHappeningHandler : IQueryHandler<GetHappeningQuery, GetHappeningResult>
{
	IUnitOfWork _uow;
	public GetHappeningHandler(IUnitOfWork uow)
	{
		_uow = uow;
	}
	public async Task<GetHappeningResult> Handle(GetHappeningQuery request, CancellationToken cancellationToken)
	{
		GetHappeningResult result = await _uow.MarcomRepository.GetHappeningById(request.HappeningID);

		return result;
	}
}
