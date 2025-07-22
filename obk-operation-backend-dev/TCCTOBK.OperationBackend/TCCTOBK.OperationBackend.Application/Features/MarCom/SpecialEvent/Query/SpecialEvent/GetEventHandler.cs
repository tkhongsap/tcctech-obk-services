using Microsoft.AspNetCore.Http;
using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Features.Marcom.SpecialEvent.Query.GetSpecialEvent;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.PRBannerManagement.Query.GetPRBannerManagement;

namespace TCCTOBK.OperationBackend.Application.Features.Marcom.SpecialEvent.Query.GetSpecialEvent;

public class GetEventHandler : IQueryHandler<GetEventQuery, GetEventResult>
{
	IUnitOfWork _uow;
	public GetEventHandler(IUnitOfWork uow)
	{
		_uow = uow;
	}
	public async Task<GetEventResult> Handle(GetEventQuery request, CancellationToken cancellationToken)
	{
		GetEventResult result = await _uow.MarcomRepository.GetEventById(request.EventID);

		return result;
	}
}
