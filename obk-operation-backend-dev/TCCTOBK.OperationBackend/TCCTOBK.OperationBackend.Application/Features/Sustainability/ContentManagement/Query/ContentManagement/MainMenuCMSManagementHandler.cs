using Microsoft.AspNetCore.Http;
using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.ContentManagement.Query.GetContentManagement;

namespace TCCTOBK.OperationBackend.Application.Features.Sustainability.ContentManagement.Query.GetContentManagement;

public class MainMenuCMSManagementHandler : IQueryHandler<MainContentManagementQuery, MainContentManagementResult>
{
	IUnitOfWork _uow;
	public MainMenuCMSManagementHandler(IUnitOfWork uow)
	{
		_uow = uow;
	}
	public async Task<MainContentManagementResult> Handle(MainContentManagementQuery request, CancellationToken cancellationToken)
	{
		MainContentManagementResult result = await _uow.SustainabilityRepository.GetCMSMenu();
		
		return result;
	}
}


	