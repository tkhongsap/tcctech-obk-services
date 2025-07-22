using Microsoft.AspNetCore.Http;
using NPOI.POIFS.Properties;
using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.ContentManagement.Query.GetAllDigitalLibrary;

namespace TCCTOBK.OperationBackend.Application.Features.Sustainability.ContentManagement.Query.GetAllContentManagement;

public class GetAllContentManagementHandler : IQueryHandler<GetAllContentManagementQuery, GetAllContentManagementResult>
{
	IUnitOfWork _uow;
	public GetAllContentManagementHandler(IUnitOfWork uow)
	{
		_uow = uow;
	}
	public async Task<GetAllContentManagementResult> Handle(GetAllContentManagementQuery request, CancellationToken cancellationToken)
	{
		CmsResult cms = await _uow.SustainabilityRepository.GetAllCMS(request.Filter, request.Status, request.ParentId, request);
		GetAllContentManagementResult result = new GetAllContentManagementResult()
		{
			Data = cms,
			StatusCode = StatusCodes.Status200OK
		};

		return result;
	}
}
