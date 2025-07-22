using Microsoft.AspNetCore.Http;
using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;

namespace TCCTOBK.OperationBackend.Application.Features.Sustainability.BannerManagement.Query.GetBanner;

public class GetBannerHandler : IQueryHandler<GetBannerQuery, GetBannerResult>
{
	IUnitOfWork _uow;
	public GetBannerHandler(IUnitOfWork uow)
	{
		_uow = uow;
	}
	public async Task<GetBannerResult> Handle(GetBannerQuery request, CancellationToken cancellationToken)
	{
		var banners = await _uow.SustainabilityRepository.GetAllBanner();
		var result = new GetBannerResult();
		var lstbanner = new List<Banner>();
		foreach (var item in banners)
		{
			var res = new Banner()
			{
				Id = item.Id,
				ImageURL = item.ImageURL,
				FileName = item.FileName,
				OriginalFileName = item.OriginalFileName,
				Type = item.Type,
				LabelLevel1 = item.LabelLevel1,
				LabelLevel2 = item.LabelLevel2,
				LabelLevel1TH = item.LabelLevel1TH,
				LabelLevel2TH = item.LabelLevel2TH,
				LabelLevel1CN = item.LabelLevel1CN,
				LabelLevel2CN = item.LabelLevel2CN,
				LabelIntroduce = item.LabelIntroduce,
				LabelIntroduceTH = item.LabelIntroduceTH,
				LabelIntroduceCN = item.LabelIntroduceCN,
				IsDelete = item.IsDelete,
				IsChanged = false,
				UpdatedByName = item.UpdatedByName,
				UpdatedDate = item.UpdatedDate.ToString("yyyy-MM-dd HH:mm")
			};
			lstbanner.Add(res);
		}

		result.banners = lstbanner;
		result.StatusCode = StatusCodes.Status200OK;
		return result;
	}
}
