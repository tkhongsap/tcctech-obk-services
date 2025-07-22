using Microsoft.AspNetCore.Http;
using NPOI.POIFS.Properties;
using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.ContentManagement.Query.GetAllDigitalLibrary;

namespace TCCTOBK.OperationBackend.Application.Features.Marcom.Happening.Query.GetAllContent;

public class GetAllContentHandler : IQueryHandler<GetAllContentQuery, GetAllContentResult>
{
	IUnitOfWork _uow;
	public GetAllContentHandler(IUnitOfWork uow)
	{
		_uow = uow;
	}
	public async Task<GetAllContentResult> Handle(GetAllContentQuery request, CancellationToken cancellationToken)
	{
		ContentResult cms = await _uow.MarcomRepository.GetAllContent(request.Filter, request.Status, request.ParentId,request.IsPin, request);
		GetAllContentResult result = new GetAllContentResult()
		{
			Data = cms,
			StatusCode = StatusCodes.Status200OK
		};

		return result;
	}
}
