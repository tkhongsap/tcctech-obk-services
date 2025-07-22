using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;
namespace TCCTOBK.OperationBackend.Application.Features.SustainabilityMobile.Query.GetMainContent;

public class GetContentHandler : IQueryHandler<GetContentQuery, GetMainContentResult>
{
	readonly IUnitOfWork _uow;
	public GetContentHandler(IUnitOfWork uow)
	{
		_uow = uow;
	}
	public async Task<GetMainContentResult> Handle(GetContentQuery request, CancellationToken cancellationToken)
	{
		var lstBannerAll = await _uow.SustainabilityMobileRepository.GetBannerAll();
		var lstPRBannerAll = await _uow.SustainabilityMobileRepository.GetPRBannerAll();
		var lstMainContentAll = await _uow.SustainabilityMobileRepository.GetCMSAll();
		var lstConfigAll = await _uow.SustainabilityMobileRepository.GetConfigAll();

		GetMainContentResult result = new GetMainContentResult();

		#region Banner
		BannerItem objBanner = new BannerItem();
		var lstBannerAResult = new List<BannerAItem>();

		objBanner.nTimeSlideBanner = lstConfigAll.Where(w => w.Type == 1).Select(s => s.ValueInt).FirstOrDefault() ?? 3;

		foreach (var iP in lstPRBannerAll)
		{
			var isHasInLang = false;
			if (request.Param.sLanguage == "en")
			{
				isHasInLang = !string.IsNullOrEmpty(iP.ImageURLEN);
			}
			else if (request.Param.sLanguage == "th")
			{
				isHasInLang = !string.IsNullOrEmpty(iP.ImageURLTH);
			}
			else if (request.Param.sLanguage == "zh")
			{
				isHasInLang = !string.IsNullOrEmpty(iP.ImageURLCN);
			}

			var objAdd = new BannerAItem();
			objAdd.sImagePath = GlobalFunctionSustainability.GetTextLanguage(request.Param.sLanguage, iP.ImageURLEN, iP.ImageURLTH, iP.ImageURLCN);
			objAdd.nType = iP.Type;
			objAdd.sID = iP.Id;
			objAdd.sLinkToURL = iP.LinkToURL;
			objAdd.sText = isHasInLang ? GlobalFunctionSustainability.GetTextLanguage(request.Param.sLanguage, iP.TextEN, iP.TextTH, iP.TextCN, true) : iP.TextEN;
			lstBannerAResult.Add(objAdd);
		}

		objBanner.lstBannerA = lstBannerAResult;

		var objBanner1 = lstBannerAll.Find(w => w.Type == 1);
		if (objBanner1 != null)
		{
			objBanner.sPathBannerRole1B = objBanner1.ImageURL;
			objBanner.sTextBannerRole1B1 = GlobalFunctionSustainability.GetTextLanguage(request.Param.sLanguage, objBanner1.LabelLevel1, objBanner1.LabelLevel1TH, objBanner1.LabelLevel1CN, true);
			objBanner.sTextBannerRole1B2 = GlobalFunctionSustainability.GetTextLanguage(request.Param.sLanguage, objBanner1.LabelLevel2, objBanner1.LabelLevel2TH, objBanner1.LabelLevel2CN, true);
		}

		var objBanner2 = lstBannerAll.Find(w => w.Type == 2);
		if (objBanner2 != null)
		{
			objBanner.sPathBannerC = objBanner2.ImageURL;
			objBanner.sTextBannerC1 = GlobalFunctionSustainability.GetTextLanguage(request.Param.sLanguage, objBanner2.LabelLevel1, objBanner2.LabelLevel1TH, objBanner2.LabelLevel1CN, true);
			objBanner.sTextBannerC2 = GlobalFunctionSustainability.GetTextLanguage(request.Param.sLanguage, objBanner2.LabelLevel2, objBanner2.LabelLevel2TH, objBanner2.LabelLevel2CN, true);
		}

		var objBanner3 = lstBannerAll.Find(w => w.Type == 3);
		if (objBanner3 != null)
		{
			objBanner.sPathCoverLayoutC = objBanner3.ImageURL;
		}
		#endregion Banner

		#region Content
		List<MainContentItem> lstMainContent = new List<MainContentItem>();

		var lstMain = lstMainContentAll.Where(w => !w.IsSubMenu).ToList();
		foreach (var iM in lstMain)
		{
			MainContentItem objMain = new MainContentItem();
			objMain.nLayoutType = iM.LayoutType ?? 1;
			objMain.sTitle = GlobalFunctionSustainability.GetTextLanguage(request.Param.sLanguage, iM.MenuNameEn, iM.MenuNameTH, iM.MenuNameCN);
			objMain.sIntroduce = GlobalFunctionSustainability.GetTextLanguage(request.Param.sLanguage, iM.IntroduceEN, iM.IntroduceTH, iM.IntroduceCN);

			if (iM.LayoutType == 3)
			{
				objMain.sLayoutBackground = objBanner.sPathCoverLayoutC;
			}

			var lstSub = new List<SubContentItem>();
			foreach (var iS in lstMainContentAll.Where(w => w.ParentId == iM.Id).OrderBy(o => o.Order))
			{
				var objSub = new SubContentItem();
				objSub.sID = iS.Id;
				objSub.sPath = GlobalFunctionSustainability.GetTextLanguage(request.Param.sLanguage, iS.CoverImageURLEN, iS.CoverImageURLTH, iS.CoverImageURLCN);
				objSub.sLabel = GlobalFunctionSustainability.GetTextLanguage(request.Param.sLanguage, iS.MenuNameEn, iS.MenuNameTH, iS.MenuNameCN);

				if (iM.LayoutType == 3)
				{
					objSub.sLabelDesc = GlobalFunctionSustainability.GetTextLanguage(request.Param.sLanguage, iS.IntroduceEN, iS.IntroduceTH, iS.IntroduceCN);
				}
				lstSub.Add(objSub);
			}

			objMain.lstSub = lstSub;

			lstMainContent.Add(objMain);
		}
		#endregion Content

		result.objBanner = objBanner;
		result.lstMainContent = lstMainContent;
		return result;
	}
}
