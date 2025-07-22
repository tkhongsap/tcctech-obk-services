using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Caching.Memory;
using Newtonsoft.Json;
using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Contracts.Minio;
using TCCTOBK.OperationBackend.Domain.Entities;
namespace TCCTOBK.OperationBackend.Application.Features.Marcom.Query.GetMainContent;
public class GetContentHandler : IQueryHandler<GetContentQuery, GetMainContentResult>
{
	readonly IUnitOfWork _uow;
	IDistributedCache _cache;
	private readonly IMinioService _minioService;

	public GetContentHandler(IUnitOfWork uow, IDistributedCache cache, IMinioService minioservice)
	{
		_uow = uow;
		_cache = cache;
		_minioService = minioservice;
	}
	public async Task<T> GetFromCacheOrQuery<T>(string key, int expires_in, Func<Task<T>> func)
	{
		try
		{
			var cacheData = await _cache.GetStringAsync(key);
			if (cacheData == null)
			{
				var data = await func();
				cacheData = JsonConvert.SerializeObject(data);
				var options = new DistributedCacheEntryOptions().SetAbsoluteExpiration(TimeSpan.FromSeconds(expires_in));
				await _cache.SetStringAsync(key, cacheData, options);
			}

			return JsonConvert.DeserializeObject<T>(cacheData) ?? throw new InvalidOperationException("Deserialized data is null.");
		}
		catch (Exception ex)
		{
			throw new Exception("Error get cache", ex);
		}
	}
	private int GetExpiredSecond()
	{
		return 300;
	}
	private async Task<List<EventItemCatch>> GetSpecialEventFromCatch(Func<Task<List<EventItemCatch>>> func)
	{
		string keyCache = "MarcomSpecialEvent";
		return await GetFromCacheOrQuery(keyCache, GetExpiredSecond(), func);
	}
	private async Task<List<EventItemCatch>> GetSpecialEvent()
	{
		var lstEventAll = await _uow.MarcomMobileRepository.GetSpecialEventAll();

		var lstEvent = lstEventAll.Where(w => w.ShowTimeStartDate <= DateTime.Now && (w.IsNotSpecify ? true : w.ShowTimeEndDate >= DateTime.Now)).ToList();
		var lstEventResult = new List<EventItemCatch>();
		foreach (var iE in lstEvent)
		{
			EventItemCatch objEvent = new EventItemCatch();
			objEvent.sID = iE.Id;
			objEvent.sImagePathEN = iE.ImageURLEN;
			objEvent.sImagePathTH = iE.ImageURLTH + "";
			objEvent.sImagePathCN = iE.ImageURLCN + "";
			objEvent.isShowDontShowAgain = iE.IsShowDontShowAgain;
			lstEventResult.Add(objEvent);
		}

		return lstEventResult;
	}

	private async Task<List<trMarcomConfig>> GetMarcomConfig()
	{
		var lstConfigAll = await _uow.MarcomMobileRepository.GetConfigAll();
		return lstConfigAll;
	}

	private async Task<List<trMarcomConfig>> GetMarcomConfigFromCatch(Func<Task<List<trMarcomConfig>>> func)
	{
		string keyCache = "MarcomConfig";
		return await GetFromCacheOrQuery(keyCache, GetExpiredSecond(), func);
	}

	private async Task<List<BannerItemCatch>> GetBannerFromCatch(Func<Task<List<BannerItemCatch>>> func)
	{
		string keyCache = "MarcomBanner";
		return await GetFromCacheOrQuery(keyCache, GetExpiredSecond(), func);
	}
	private async Task<List<BannerItemCatch>> GetBanner()
	{
		var lstPRBannerAll = await _uow.MarcomMobileRepository.GetPRBannerAll();
		var lstPRBanner = lstPRBannerAll.Where(w => w.StartDate <= DateTime.Now && (w.IsNotSpecify ? true : w.EndDate >= DateTime.Now)).ToList();
		var lstBannerResult = new List<BannerItemCatch>();
		foreach (var iB in lstPRBanner)
		{
			BannerItemCatch objBanner = new BannerItemCatch();
			objBanner.sImagePathEN = iB.IsImageEN ? iB.ImageURLEN : await _minioService.GetObject(iB.ImageURLEN, iB.FileNameEN);
			objBanner.sImagePathTH = iB.IsImageTH == true ? iB.ImageURLTH ?? "" : (!string.IsNullOrEmpty(iB.ImageURLTH) ? await _minioService.GetObject(iB.ImageURLTH ?? "", iB.FileNameTH ?? "") : "");
			objBanner.sImagePathCN = iB.IsImageCN == true ? iB.ImageURLCN ?? "" : (!string.IsNullOrEmpty(iB.ImageURLCN) ? await _minioService.GetObject(iB.ImageURLCN ?? "", iB.ImageURLCN ?? "") : "");
			objBanner.isImageEN = iB.IsImageEN;
			objBanner.isImageTH = iB.IsImageTH ?? false;
			objBanner.isImageCN = iB.IsImageCN ?? false;
			objBanner.nType = iB.Type;
			objBanner.sID = iB.Id;
			objBanner.sLinkToURL = iB.LinkToURL;
			objBanner.sTextEN = iB.TextEN;
			objBanner.sTextTH = iB.TextTH;
			objBanner.sTextCN = iB.TextCN;

			lstBannerResult.Add(objBanner);
		}
		return lstBannerResult;
	}
	private async Task<List<ContentCardWhatHappenItemCatch>> GetWhatHappeningFromCatch(Func<Task<List<ContentCardWhatHappenItemCatch>>> func)
	{
		string keyCache = "MarcomWhatHappening";
		return await GetFromCacheOrQuery(keyCache, GetExpiredSecond(), func);
	}
	private async Task<List<ContentCardWhatHappenItemCatch>> GetWhatHappening()
	{
		var lstWhatHappenSubAll = await _uow.MarcomMobileRepository.GetWhatHappenSubAll();
		var lstWhatHappenCategoryAll = await _uow.MarcomMobileRepository.GetWhatHappenCategoryAll();
		var lstWhatHappen = lstWhatHappenSubAll.Where(w => w.ShowTimeStartDate <= DateTime.Now && (w.IsNotSpecify ? true : w.ShowTimeEndDate >= DateTime.Now) && w.IsPin).OrderBy(o => o.OrderPin).ToList();
		var lstWhatHappenResult = new List<ContentCardWhatHappenItemCatch>();
		foreach (var iW in lstWhatHappen)
		{
			var objCategory = lstWhatHappenCategoryAll.Where(w => w.Id == iW.CategoryId).FirstOrDefault();
			if (objCategory != null)
			{
				ContentCardWhatHappenItemCatch objHappen = new ContentCardWhatHappenItemCatch();
				objHappen.sID = iW.Id;
				objHappen.sCategolyID = iW.CategoryId;
				objHappen.sCategoryEN = objCategory.CategoryNameEn;
				objHappen.sCategoryTH = objCategory.CategoryNameTH ?? "";
				objHappen.sCategoryCN = objCategory.CategoryNameCN ?? "";
				objHappen.sTitleEN = iW.TitleEn;
				objHappen.sTitleTH = iW.TitleTH ?? "";
				objHappen.sTitleCN = iW.TitleCN ?? "";
				objHappen.sLocationEN = iW.LocationEN ?? "";
				objHappen.sLocationTH = iW.LocationTH ?? "";
				objHappen.sLocationCN = iW.LocationCN ?? "";
				objHappen.sDate = GlobalFunctionMarcom.GetDateText(iW.EventTimeStartDate, iW.EventTimeEndDate);
				objHappen.sCoverImagePathEN = iW.CoverImageURLEN ?? "";
				objHappen.sCoverImagePathTH = iW.CoverImageURLTH ?? "";
				objHappen.sCoverImagePathCN = iW.CoverImageURLCN ?? "";

				lstWhatHappenResult.Add(objHappen);
			}
		}
		return lstWhatHappenResult;
	}

	private async Task<List<ContentCardExploreItemCatch>> GetExploreFromCatch(Func<Task<List<ContentCardExploreItemCatch>>> func)
	{
		string keyCache = "MarcomExplore";
		return await GetFromCacheOrQuery(keyCache, GetExpiredSecond(), func);
	}

	private async Task<List<ContentCardExploreItemCatch>> GetExplore()
	{
		var lstExploreAll = await _uow.MarcomMobileRepository.GetExploreAll();
		var lstExplore = lstExploreAll.ToList();
		var lstExploreResult = new List<ContentCardExploreItemCatch>();
		foreach (var iE in lstExplore)
		{
			ContentCardExploreItemCatch objExplore = new ContentCardExploreItemCatch();
			objExplore.sID = iE.Id;
			objExplore.sCoverImagePathEN = iE.CoverImageURLEN ?? "";
			objExplore.sCoverImagePathTH = iE.CoverImageURLTH ?? "";
			objExplore.sCoverImagePathCN = iE.CoverImageURLCN ?? "";
			objExplore.sTitleEN = iE.TitleEn;
			objExplore.sTitleTH = iE.TitleTH ?? "";
			objExplore.sTitleCN = iE.TitleCN ?? "";

			lstExploreResult.Add(objExplore);
		}
		return lstExploreResult;
	}
	public async Task<GetMainContentResult> Handle(GetContentQuery request, CancellationToken cancellationToken)
	{
		GetMainContentResult result = new GetMainContentResult();

		#region Special Event
		var lstEventResultCatch = await GetSpecialEventFromCatch(GetSpecialEvent);

		var lstEventResult = new List<EventItem>();
		foreach (var iE in lstEventResultCatch)
		{
			EventItem objEvent = new EventItem();
			objEvent.sID = iE.sID;
			objEvent.sImagePath = GlobalFunctionMarcom.GetTextLanguage(request.Param.sLanguage, iE.sImagePathEN, iE.sImagePathTH, iE.sImagePathCN);
			objEvent.isShowDontShowAgain = iE.isShowDontShowAgain;
			lstEventResult.Add(objEvent);
		}
		result.lstEvent = lstEventResult;
		#endregion Special Event

		#region Marcom Config
		var lstConfigAll = await GetMarcomConfigFromCatch(GetMarcomConfig);
		result.nTimeSlideBanner = lstConfigAll.Where(w => w.Type == 1).Select(s => s.ValueInt).FirstOrDefault() ?? 3;
		var canCheckEvent = lstConfigAll.Where(w => w.Type == 2).Select(s => s.ValueInt).FirstOrDefault() ?? 0;
		result.canCheckDontShowEvent = canCheckEvent == 1;

		#endregion Marcom Config

		#region Banner
		var lstPRBannerCatch = await GetBannerFromCatch(GetBanner);
		var lstBannerResult = new List<BannerItem>();
		foreach (var iB in lstPRBannerCatch)
		{
			var isHasInLang = false;
			if (request.Param.sLanguage == "en")
			{
				isHasInLang = !string.IsNullOrEmpty(iB.sImagePathEN);
			}
			else if (request.Param.sLanguage == "th")
			{
				isHasInLang = !string.IsNullOrEmpty(iB.sImagePathTH);
			}
			else if (request.Param.sLanguage == "zh")
			{
				isHasInLang = !string.IsNullOrEmpty(iB.sImagePathCN);
			}

			BannerItem objBanner = new BannerItem();
			objBanner.sImagePath = GlobalFunctionMarcom.GetTextLanguage(request.Param.sLanguage, iB.sImagePathEN, iB.sImagePathTH, iB.sImagePathCN);
			objBanner.isImage = isHasInLang ? GlobalFunctionMarcom.GetBoolLanguage(request.Param.sLanguage, iB.isImageEN, iB.isImageTH, iB.isImageCN) : iB.isImageEN;
			objBanner.nType = iB.nType;
			objBanner.sID = iB.sID;
			objBanner.sLinkToURL = iB.sLinkToURL;
			objBanner.sText = isHasInLang ? GlobalFunctionMarcom.GetTextLanguage(request.Param.sLanguage, iB.sTextEN, iB.sTextTH, iB.sTextCN, true) : iB.sTextEN;

			lstBannerResult.Add(objBanner);
		}
		result.lstBanner = lstBannerResult;
		#endregion Banner

		#region What Happenning
		var lstWhatHappen = await GetWhatHappeningFromCatch(GetWhatHappening);
		var lstWhatHappenResult = new List<ContentCardWhatHappenItem>();
		foreach (var iW in lstWhatHappen)
		{
			ContentCardWhatHappenItem objHappen = new ContentCardWhatHappenItem();
			objHappen.sID = iW.sID;
			objHappen.sCategolyID = iW.sCategolyID;
			objHappen.sCategory = GlobalFunctionMarcom.GetTextLanguage(request.Param.sLanguage, iW.sCategoryEN, iW.sCategoryTH, iW.sCategoryCN);
			objHappen.sTitle = GlobalFunctionMarcom.GetTextLanguage(request.Param.sLanguage, iW.sTitleEN, iW.sTitleTH, iW.sTitleCN);
			objHappen.sLocation = GlobalFunctionMarcom.GetTextLanguage(request.Param.sLanguage, iW.sLocationEN, iW.sLocationTH, iW.sLocationCN);
			objHappen.sDate = iW.sDate;
			objHappen.sCoverImagePath = GlobalFunctionMarcom.GetTextLanguage(request.Param.sLanguage, iW.sCoverImagePathEN, iW.sCoverImagePathTH, iW.sCoverImagePathCN);

			lstWhatHappenResult.Add(objHappen);
		}
		result.lstWhatHappen = lstWhatHappenResult;
		#endregion What Happenning

		#region Explore
		var lstExplore = await GetExploreFromCatch(GetExplore);
		var lstExploreResult = new List<ContentCardExploreItem>();
		foreach (var iE in lstExplore)
		{
			ContentCardExploreItem objExplore = new ContentCardExploreItem();
			objExplore.sID = iE.sID;
			objExplore.sCoverImagePath = GlobalFunctionMarcom.GetTextLanguage(request.Param.sLanguage, iE.sCoverImagePathEN, iE.sCoverImagePathTH, iE.sCoverImagePathCN);
			objExplore.sTitle = GlobalFunctionMarcom.GetTextLanguage(request.Param.sLanguage, iE.sTitleEN, iE.sTitleTH, iE.sTitleCN);

			lstExploreResult.Add(objExplore);
		}
		result.lstExplore = lstExploreResult;
		#endregion Explore

		return result;
	}
}
