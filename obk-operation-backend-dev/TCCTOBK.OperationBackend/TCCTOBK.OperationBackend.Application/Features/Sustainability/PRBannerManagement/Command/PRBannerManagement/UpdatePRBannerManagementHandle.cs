using MediatR;
using Microsoft.AspNetCore.Http;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Exceptions;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.PRBannerManagement.Command.PRBannerManagement;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.DigitalLibraryManagement.Command.DigitalLibrary;
using TCCTOBK.OperationBackend.Domain;

namespace TCCTOBK.OperationBackend.Application.Features.Sustainability.PRBannerManagementManagement.Command.PRBannerManagement;

public class PRBannerManagementHandler : IRequestHandler<PRBannerManagementCommand, PRBannerManagementResult>
{
	IUnitOfWork _uow;
	public PRBannerManagementHandler(IUnitOfWork uow)
	{
		_uow = uow;
	}
	public async Task<PRBannerManagementResult> Handle(PRBannerManagementCommand request, CancellationToken cancellationToken)
	{
		PRBannerManagementSustainability content = new PRBannerManagementSustainability(request.BannerName, request.Status, request.IsShowRelatedLink, request.IsDelete, request.Order, request.Detail, request.Type, request.Id, request.LinkToURL);

		await _uow.SustainabilityRepository.UpdatePRBanner(content, request);
		await _uow.SaveChangeAsyncWithCommit();

		return new PRBannerManagementResult() { StatusCode = StatusCodes.Status200OK, Message = "Success" };
	}
}
