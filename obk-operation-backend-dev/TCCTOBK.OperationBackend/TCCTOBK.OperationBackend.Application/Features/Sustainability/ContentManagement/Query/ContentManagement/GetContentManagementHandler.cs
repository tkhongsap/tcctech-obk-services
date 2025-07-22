using Microsoft.AspNetCore.Http;
using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.ContentManagement.Query.GetContentManagement;

namespace TCCTOBK.OperationBackend.Application.Features.Sustainability.ContentManagement.Query.GetContentManagement;

public class GetContentManagementHandler : IQueryHandler<GetContentManagementQuery, GetContentManagementResult>
{
	IUnitOfWork _uow;
	public GetContentManagementHandler(IUnitOfWork uow)
	{
		_uow = uow;
	}
	public async Task<GetContentManagementResult> Handle(GetContentManagementQuery request, CancellationToken cancellationToken)
	{
		GetContentManagementResult result = await _uow.SustainabilityRepository.GetCMSById(request.CMSID);

		return result;
	}
}