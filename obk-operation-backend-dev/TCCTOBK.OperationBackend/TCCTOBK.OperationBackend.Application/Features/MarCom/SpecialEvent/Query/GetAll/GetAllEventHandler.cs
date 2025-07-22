using Microsoft.AspNetCore.Http;
using NPOI.POIFS.Properties;
using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.PRBannerManagement.Query.GetAllDigitalLibrary;

namespace TCCTOBK.OperationBackend.Application.Features.Marcom.SpecialEvent.Query.GetAll;

public class GetAllEventHandler : IQueryHandler<GetAllEventQuery, GetAllEventResult>
{
	IUnitOfWork _uow;
	public GetAllEventHandler(IUnitOfWork uow)
	{
		_uow = uow;
	}
	public async Task<GetAllEventResult> Handle(GetAllEventQuery request, CancellationToken cancellationToken)
	{
		var objEvent = await _uow.MarcomRepository.GetAllEvent(request.Filter, request.Status, request);
		GetAllEventResult result = new GetAllEventResult()
		{
			Data = objEvent,
			StatusCode = StatusCodes.Status200OK
		};

		return result;
	}
}
