using MediatR;
using Microsoft.AspNetCore.Http;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Exceptions;
using TCCTOBK.OperationBackend.Domain;

namespace TCCTOBK.OperationBackend.Application.Features.Sustainability.BannerManagement.Command.Banner;

public class BannerHandler : IRequestHandler<BannerCommand, BannerResult>
{
	IUnitOfWork _uow;
	public BannerHandler(IUnitOfWork uow)
	{
		_uow = uow;
	}
	public async Task<BannerResult> Handle(BannerCommand request, CancellationToken cancellationToken)
	{
		List<BannerSustainability> lstBanner = new List<BannerSustainability>();

		request.lstBanner.ForEach(async item =>
		{
			BannerSustainability updateBanner = new BannerSustainability(item.Type, item.ImageURL, item.FileName, item.OriginalFileName, item.IsDelete, item.IsChanged, item.LabelLevel1, item.LabelLevel2, item.Id, item.LabelLevel1TH,item.LabelLevel2TH,item.LabelLevel1CN,item.LabelLevel2CN,item.LabelIntroduce, item.LabelIntroduceTH, item.LabelIntroduceCN);
			lstBanner.Add(updateBanner);
		});

		await _uow.SustainabilityRepository.UpdateBanner(lstBanner, request);
		await _uow.SaveChangeAsyncWithCommit();

		return new BannerResult() { StatusCode = StatusCodes.Status200OK, Message = "Success" };
	}
}
