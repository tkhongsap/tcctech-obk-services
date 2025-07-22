using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;
namespace TCCTOBK.OperationBackend.Application.Features.SustainabilityMobile.Query.GetMainContentDetail;

public class GetContentDetailHandler : IQueryHandler<GetContentDetailQuery, GetContentDetailResult>
{
	readonly IUnitOfWork _uow;
	public GetContentDetailHandler(IUnitOfWork uow)
	{
		_uow = uow;
	}
	public async Task<GetContentDetailResult> Handle(GetContentDetailQuery request, CancellationToken cancellationToken)
	{
		var lstMainContentAll = await _uow.SustainabilityMobileRepository.GetCMSAll();
		var lstMainBannerAll = await _uow.SustainabilityMobileRepository.GetPRBannerAll();
		var lstContentAll = await _uow.SustainabilityMobileRepository.GetCMSContentAll();

		var objMainContent = lstMainContentAll.Where(w => w.Id == request.Param.sID).FirstOrDefault();
		var objMainBanner = lstMainBannerAll.Where(w => w.Id == request.Param.sID).FirstOrDefault();

		var lstContent = new List<Domain.Entities.trSustainabilityCMSContent>();

		GetContentDetailResult result = new GetContentDetailResult();

		//Content
		if (request.Param.isBanner != true && objMainContent != null)
		{
			var objMainParent = lstMainContentAll.Where(w => w.Id == objMainContent.ParentId).FirstOrDefault();

			result.sHeaderImagePath = GlobalFunctionSustainability.GetTextLanguage(request.Param.sLanguage, objMainContent.HeadImageURLEN, objMainContent.HeadImageURLTH, objMainContent.HeadImageURLCN);
			result.sTitle = GlobalFunctionSustainability.GetTextLanguage(request.Param.sLanguage, objMainContent.MenuNameEn, objMainContent.MenuNameTH, objMainContent.MenuNameCN);
			result.sIntroduce = GlobalFunctionSustainability.GetTextLanguage(request.Param.sLanguage, objMainContent.IntroduceEN, objMainContent.IntroduceTH, objMainContent.IntroduceCN);

			//Related
			if (objMainParent != null)
			{
				result.sHeaderNav = GlobalFunctionSustainability.GetTextLanguage(request.Param.sLanguage, objMainParent.MenuNameEn, objMainParent.MenuNameTH, objMainParent.MenuNameCN);
				if (objMainParent.IsShowRelatedLink == true)
				{
					result.sTitleRelated = GlobalFunctionSustainability.GetTextLanguage(request.Param.sLanguage, objMainParent.TitleRelatedEN, objMainParent.TitleRelatedTH, objMainParent.TitleRelatedCN);

					//List Related
					var lstRelated = lstMainContentAll.Where(w => w.ParentId == objMainParent.Id && w.Id != request.Param.sID).ToList();

					var lstRelatedResult = new List<RelateContentItem>();
					foreach (var iR in lstRelated)
					{
						var objRelated = new RelateContentItem();
						objRelated.sImagePath = GlobalFunctionSustainability.GetTextLanguage(request.Param.sLanguage, iR.CoverImageURLEN, iR.CoverImageURLTH, iR.CoverImageURLCN);
						objRelated.sTitle = GlobalFunctionSustainability.GetTextLanguage(request.Param.sLanguage, iR.MenuNameEn, iR.MenuNameTH, iR.MenuNameCN);
						objRelated.sDescription = GlobalFunctionSustainability.GetTextLanguage(request.Param.sLanguage, iR.IntroduceEN, iR.IntroduceTH, iR.IntroduceCN);
						objRelated.sLinkToID = iR.Id;
						objRelated.isBanner = false;

						lstRelatedResult.Add(objRelated);
					}

					result.lstRelated = lstRelatedResult;
				}
			}

			//List Content If Not has data in select lang use en instead
			var hasDataInLang = true;
			switch (request.Param.sLanguage)
			{
				case "en": hasDataInLang = !string.IsNullOrEmpty(objMainContent.MenuNameEn); break;
				case "th": hasDataInLang = !string.IsNullOrEmpty(objMainContent.MenuNameTH); break;
				case "zh": hasDataInLang = !string.IsNullOrEmpty(objMainContent.MenuNameCN); break;
			}
			if (!hasDataInLang) request.Param.sLanguage = "en";
			lstContent = lstContentAll.Where(w => w.MenuId == request.Param.sID && w.Language == request.Param.sLanguage).ToList();
		}
		//Banner
		else if (request.Param.isBanner == true && objMainBanner != null)
		{
			result.sHeaderImagePath = GlobalFunctionSustainability.GetTextLanguage(request.Param.sLanguage, objMainBanner.HeaderImageURLEN, objMainBanner.HeaderImageURLTH, objMainBanner.HeaderImageURLCN);
			result.sTitle = GlobalFunctionSustainability.GetTextLanguage(request.Param.sLanguage, objMainBanner.TitleEN, objMainBanner.TitleTH, objMainBanner.TitleCN);

			//Related
			if (objMainBanner.IsShowRelatedLink == true)
			{
				result.sTitleRelated = "Related";

				//List Related
				var lstRelated = lstMainBannerAll.Where(w => w.Id != request.Param.sID).ToList();

				var lstRelatedResult = new List<RelateContentItem>();
				foreach (var iR in lstRelated)
				{
					var objRelated = new RelateContentItem();
					objRelated.sImagePath = GlobalFunctionSustainability.GetTextLanguage(request.Param.sLanguage, iR.ImageURLEN, iR.ImageURLTH, iR.ImageURLCN);
					objRelated.sTitle = iR.Type == 1 ? GlobalFunctionSustainability.GetTextLanguage(request.Param.sLanguage, iR.TitleEN, iR.TitleTH, iR.TitleCN) : iR.BannerName;
					objRelated.sLinkToID = iR.Id;
					objRelated.nType = iR.Type;
					objRelated.sLinkToURL = iR.LinkToURL;
					objRelated.isBanner = true;

					lstRelatedResult.Add(objRelated);
				}

				result.lstRelated = lstRelatedResult;
			}

			//List Content If Not has data in select lang use en instead
			var hasDataInLang = true;
			switch (request.Param.sLanguage)
			{
				case "en": hasDataInLang = !string.IsNullOrEmpty(objMainBanner.HeaderImageURLEN); break;
				case "th": hasDataInLang = !string.IsNullOrEmpty(objMainBanner.HeaderImageURLTH); break;
				case "zh": hasDataInLang = !string.IsNullOrEmpty(objMainBanner.HeaderImageURLCN); break;
			}
			if (!hasDataInLang) request.Param.sLanguage = "en";
			lstContent = lstContentAll.Where(w => w.MenuId == request.Param.sID && w.Language == request.Param.sLanguage).ToList();
		}



		//Content
		var lstContentResult = new List<ContentDetailItem>();
		foreach (var iC in lstContent)
		{
			var objContent = new ContentDetailItem();
			objContent.sMode = iC.ContentType == 1 ? "Text" : iC.ContentType == 2 ? "Image" : "Youtube";
			objContent.sContent = iC.Text;
			objContent.sImagePath = iC.ImageURL;
			objContent.sYoutubeURL = iC.YoutubeURL;
			objContent.sYoutubeID = !string.IsNullOrEmpty(iC.YoutubeURL) ? iC.YoutubeURL.Split("v=")[1] : null;

			lstContentResult.Add(objContent);
		}
		result.lstContent = lstContentResult;

		return result;
	}
}
