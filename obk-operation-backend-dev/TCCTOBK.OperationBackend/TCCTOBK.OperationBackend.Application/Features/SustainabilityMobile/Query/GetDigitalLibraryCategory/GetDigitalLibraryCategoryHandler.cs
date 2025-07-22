using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;

namespace TCCTOBK.OperationBackend.Application.Features.SustainabilityMobile.Query.GetDigitalLibraryCategory;
public class GetDigitalLibraryCategoryHandler : IQueryHandler<GetDigitalLibraryCategoryQuery, GetDigitalCategoryResult>
{
	readonly IUnitOfWork _uow;
	public GetDigitalLibraryCategoryHandler(IUnitOfWork uow)
	{
		_uow = uow;
	}
	public async Task<GetDigitalCategoryResult> Handle(GetDigitalLibraryCategoryQuery request, CancellationToken cancellationToken)
	{
		var lstDigitalCategoryAll = await _uow.SustainabilityMobileRepository.GetDigitalLibraryAll();
		var lstBannerAll = await _uow.SustainabilityMobileRepository.GetBannerAll();

		GetDigitalCategoryResult result = new GetDigitalCategoryResult();

		var objBanner2 = lstBannerAll.Find(w => w.Type == 2);
		if (objBanner2 != null)
		{
			result.sTitle = GlobalFunctionSustainability.GetTextLanguage(request.Param.sLanguage,
				objBanner2.LabelLevel1 + (!string.IsNullOrEmpty(objBanner2.LabelLevel2) ? " " : "") + objBanner2.LabelLevel2,
				objBanner2.LabelLevel1TH + (!string.IsNullOrEmpty(objBanner2.LabelLevel2TH) ? " " : "") + objBanner2.LabelLevel2TH,
				objBanner2.LabelLevel1CN + (!string.IsNullOrEmpty(objBanner2.LabelLevel2CN) ? " " : "") + objBanner2.LabelLevel2CN
			);
			result.sPathBackground = objBanner2.ImageURL;
			result.sIntroduce = GlobalFunctionSustainability.GetTextLanguage(request.Param.sLanguage,
				objBanner2.LabelIntroduce,
				objBanner2.LabelIntroduceTH,
				objBanner2.LabelIntroduceCN
				);
		}

		//Category
		var lstDigitalCategoryResult = new List<DigitalCategoryItem>();
		foreach (var iC in lstDigitalCategoryAll)
		{
			var objCategory = new DigitalCategoryItem();
			objCategory.sID = iC.Id;
			objCategory.sLabel = GlobalFunctionSustainability.GetTextLanguage(request.Param.sLanguage, iC.TopicEN, iC.TopicTH, iC.TopicCN);
			lstDigitalCategoryResult.Add(objCategory);
		}
		result.lstCategory = lstDigitalCategoryResult;

		return result;
	}
}
