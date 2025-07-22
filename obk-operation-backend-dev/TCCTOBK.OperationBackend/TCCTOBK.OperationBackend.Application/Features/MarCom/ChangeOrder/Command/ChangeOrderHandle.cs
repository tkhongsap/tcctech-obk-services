using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Distributed;
using TCCTOBK.OperationBackend.Application.Contracts;

namespace TCCTOBK.OperationBackend.Application.Features.Sustainability.ChangeOrder.Command.ChangeOrder;

public class ChangeOrderMarcomHandler : IRequestHandler<ChangeOrderMarcomCommand, ChangeOrderMarcomResult>
{
	IUnitOfWork _uow;
	IDistributedCache _cache;
	public ChangeOrderMarcomHandler(IUnitOfWork uow, IDistributedCache cache)
	{
		_uow = uow;
		_cache = cache;
	}
	public async Task<ChangeOrderMarcomResult> Handle(ChangeOrderMarcomCommand request, CancellationToken cancellationToken)
	{

		ChangeOrderSustainability updateChangeOrder = new ChangeOrderSustainability(request.Id, request.Type, request.NewOrder);

		await _uow.MarcomRepository.ChangeOrder(updateChangeOrder, request);
		await _uow.SaveChangeAsyncWithCommit();

		_cache.Remove("MarcomGetAllPRBanner");
		_cache.Remove("MarcomGetAllWhatHappenCategory");
		_cache.Remove("MarcomGetAllWhatHappenSub");
		_cache.Remove("MarcomGetAllWhatHappenContent");
		_cache.Remove("MarcomGetAllExplore");
		_cache.Remove("MarcomGetAllExploreContent");
		_cache.Remove("MarcomGetAllTag");
		_cache.Remove("MarcomSpecialEvent");
		_cache.Remove("MarcomBanner");
		_cache.Remove("MarcomWhatHappening");
		_cache.Remove("MarcomExplore");
		_cache.Remove("MarcomWhanHappeningCategory");
		_cache.Remove("MarcomWhatHappeningAll");

		return new ChangeOrderMarcomResult() { StatusCode = StatusCodes.Status200OK, Message = "Success" };
	}
}
