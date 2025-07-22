using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Caching.Memory;
using Newtonsoft.Json;
using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Domain.Entities;
namespace TCCTOBK.OperationBackend.Application.Features.Marcom.Query.GetContentDetail;
public class GetContentDetailHandler : IQueryHandler<GetContentDetailQuery, ContentDetailResult>
{
	readonly IUnitOfWork _uow;
	IDistributedCache _cache;
	public GetContentDetailHandler(IUnitOfWork uow, IDistributedCache cache)
	{
		_uow = uow;
		_cache = cache;
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
	private async Task<List<trMarcomPRBanner>> GetPRBannerAllFromCatch(Func<Task<List<trMarcomPRBanner>>> func)
	{
		string keyCache = "MarcomGetAllPRBanner";
		return await GetFromCacheOrQuery(keyCache, GetExpiredSecond(), func);
	}
	private async Task<List<trMarcomPRBanner>> GetPRBannerAll()
	{
		var lstMainBannerAll = await _uow.MarcomMobileRepository.GetPRBannerAll();
		return lstMainBannerAll;
	}
	private async Task<List<trMarcomCMSWhatHappenCategory>> GetWhatHappenCategoryAllFromCatch(Func<Task<List<trMarcomCMSWhatHappenCategory>>> func)
	{
		string keyCache = "MarcomGetAllWhatHappenCategory";
		return await GetFromCacheOrQuery(keyCache, GetExpiredSecond(), func);
	}
	private async Task<List<trMarcomCMSWhatHappenCategory>> GetWhatHappenCategoryAll()
	{
		var lstWhateHappenCategoryAll = await _uow.MarcomMobileRepository.GetWhatHappenCategoryAll();
		return lstWhateHappenCategoryAll;
	}
	private async Task<List<trMarcomCMSWhatHappenSub>> GetWhatHappenSubAllFromCatch(Func<Task<List<trMarcomCMSWhatHappenSub>>> func)
	{
		string keyCache = "MarcomGetAllWhatHappenSub";
		return await GetFromCacheOrQuery(keyCache, GetExpiredSecond(), func);
	}
	private async Task<List<trMarcomCMSWhatHappenSub>> GetWhatHappenSubAll()
	{
		var lstWhateHappenAll = await _uow.MarcomMobileRepository.GetWhatHappenSubAll();
		return lstWhateHappenAll;
	}
	private async Task<List<trMarcomCMSWhatHappenContent>> GetWhatHappenContentAllFromCatch(Func<Task<List<trMarcomCMSWhatHappenContent>>> func)
	{
		string keyCache = "MarcomGetAllWhatHappenContent";
		return await GetFromCacheOrQuery(keyCache, GetExpiredSecond(), func);
	}
	private async Task<List<trMarcomCMSWhatHappenContent>> GetWhatHappenContentAll()
	{
		var lstWhatHappenContentAll = await _uow.MarcomMobileRepository.GetWhatHappenContentAll();
		return lstWhatHappenContentAll;
	}
	private async Task<List<trMarcomCMSExplore>> GetExploreAllFromCatch(Func<Task<List<trMarcomCMSExplore>>> func)
	{
		string keyCache = "MarcomGetAllExplore";
		return await GetFromCacheOrQuery(keyCache, GetExpiredSecond(), func);
	}
	private async Task<List<trMarcomCMSExplore>> GetExploreAll()
	{
		var lstExploreAll = await _uow.MarcomMobileRepository.GetExploreAll();
		return lstExploreAll;
	}
	private async Task<List<trMarcomCMSExploreContent>> GetExploreContentAllFromCatch(Func<Task<List<trMarcomCMSExploreContent>>> func)
	{
		string keyCache = "MarcomGetAllExploreContent";
		return await GetFromCacheOrQuery(keyCache, GetExpiredSecond(), func);
	}
	private async Task<List<trMarcomCMSExploreContent>> GetExploreContentAll()
	{
		var lstExploreContentAll = await _uow.MarcomMobileRepository.GetExploreContentAll();
		return lstExploreContentAll;
	}
	private async Task<List<trMarcomCMSTag>> GetTagAllFromCatch(Func<Task<List<trMarcomCMSTag>>> func)
	{
		string keyCache = "MarcomGetAllTag";
		return await GetFromCacheOrQuery(keyCache, GetExpiredSecond(), func);
	}
	private async Task<List<trMarcomCMSTag>> GetTagAll()
	{
		var lstTagAll = await _uow.MarcomMobileRepository.GetTagAll();
		return lstTagAll;
	}
	public async Task<ContentDetailResult> Handle(GetContentDetailQuery request, CancellationToken cancellationToken)
	{
		var lstMainBannerAll = await GetPRBannerAllFromCatch(GetPRBannerAll);
		var lstWhateHappenCategoryAll = await GetWhatHappenCategoryAllFromCatch(GetWhatHappenCategoryAll);
		var lstWhateHappenAll = await GetWhatHappenSubAllFromCatch(GetWhatHappenSubAll);
		var lstWhatHappenContentAll = await GetWhatHappenContentAllFromCatch(GetWhatHappenContentAll);
		var lstExploreAll = await GetExploreAllFromCatch(GetExploreAll);
		var lstExploreContentAll = await GetExploreContentAllFromCatch(GetExploreContentAll);
		var lstTagAll = await GetTagAllFromCatch(GetTagAll);

		var objContentWhatHappen = lstWhateHappenAll.Where(w => w.Id == request.Param.sID).FirstOrDefault();
		var objContentExplore = lstExploreAll.Where(w => w.Id == request.Param.sID).FirstOrDefault();
		var objBanner = lstMainBannerAll.Where(w => w.Id == request.Param.sID).FirstOrDefault();

		ContentDetailResult result = new ContentDetailResult();

		//What Happening
		if (request.Param.isBanner != true && request.Param.sMode == "WhatHappening" && objContentWhatHappen != null)
		{
			var objCategory = lstWhateHappenCategoryAll.Where(w => w.Id == objContentWhatHappen.CategoryId).FirstOrDefault();

			result.sHeaderNav = request.Param.sLanguage == "en" ? "Event" : "กิจกรรม";
			result.sID = objContentWhatHappen.Id;
			result.sHeaderImagePath = GlobalFunctionMarcom.GetTextLanguage(request.Param.sLanguage, objContentWhatHappen.HeadImageURLEN, objContentWhatHappen.HeadImageURLTH, objContentWhatHappen.HeadImageURLCN);
			result.sTextImage = GlobalFunctionMarcom.GetTextLanguage(request.Param.sLanguage, objContentWhatHappen.TextImageEN, objContentWhatHappen.TextImageTH, objContentWhatHappen.TextImageCN);
			result.sTitle = GlobalFunctionMarcom.GetTextLanguage(request.Param.sLanguage, objContentWhatHappen.TitleEn, objContentWhatHappen.TitleTH, objContentWhatHappen.TitleCN);
			result.sIntroduce = GlobalFunctionMarcom.GetTextLanguage(request.Param.sLanguage, objContentWhatHappen.IntroduceEN, objContentWhatHappen.IntroduceTH, objContentWhatHappen.IntroduceCN);
			result.sMode = request.Param.sMode;

			if (objCategory != null)
			{
				result.isArtAndCulture = objCategory.IsArtAndCulture;
				result.nSystemType = objCategory.SystemType;
				result.nArtAndCultureType = objContentWhatHappen.ArtAndCultureInternalLinkType ?? 1; // 1 = Program, 2 = Add-on
				result.nTypeLink = objContentWhatHappen.TypeLink;
				result.sDetailLink = objContentWhatHappen.DetailLink;

				//Related
				if (objContentWhatHappen.IsShowRelatedLink)
				{
					result.sTitleRelated = GlobalFunctionMarcom.GetTextLanguage(request.Param.sLanguage, objContentWhatHappen.TitleRelatedEN, objContentWhatHappen.TitleRelatedTH, objContentWhatHappen.TitleRelatedCN);
					result.sSubTitleRelated = GlobalFunctionMarcom.GetTextLanguage(request.Param.sLanguage, objContentWhatHappen.SubTitleRelatedEN, objContentWhatHappen.SubTitleRelatedTH, objContentWhatHappen.SubTitleRelatedCN);

					//List Related
					var lstRelated = lstWhateHappenAll.Where(w => w.CategoryId == objCategory.Id && w.Id != request.Param.sID).ToList();

					//Filter Related Take 3 and on 3 month
					lstRelated = lstRelated.Where(w => w.UpdatedDate.AddMonths(3).Date >= DateTime.Now.Date).OrderByDescending(o => o.UpdatedDate).Take(3).ToList();

					var lstRelatedResult = new List<RelateContentItem>();
					foreach (var iR in lstRelated)
					{
						var objRelated = new RelateContentItem();
						objRelated.sID = iR.Id;
						objRelated.sImagePath = GlobalFunctionMarcom.GetTextLanguage(request.Param.sLanguage, iR.CoverImageURLEN, iR.CoverImageURLTH, iR.CoverImageURLCN);
						objRelated.sTitle = GlobalFunctionMarcom.GetTextLanguage(request.Param.sLanguage, iR.TitleEn, iR.TitleTH, iR.TitleCN);
						objRelated.sDescription = GlobalFunctionMarcom.GetTextLanguage(request.Param.sLanguage, iR.IntroduceEN, iR.IntroduceTH, iR.IntroduceCN);
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
				case "en": hasDataInLang = !string.IsNullOrEmpty(objContentWhatHappen.TitleEn); break;
				case "th": hasDataInLang = !string.IsNullOrEmpty(objContentWhatHappen.TitleTH); break;
				case "zh": hasDataInLang = !string.IsNullOrEmpty(objContentWhatHappen.TitleCN); break;
			}
			if (!hasDataInLang) request.Param.sLanguage = "en";
			var lstContentAll = lstWhatHappenContentAll.Where(w => w.SubContentId == request.Param.sID && w.Language == request.Param.sLanguage).ToList();

			//Content
			var lstContentResult = new List<ContentDetailItem>();
			foreach (var iC in lstContentAll)
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
		}
		//Explore
		else if (request.Param.isBanner != true && request.Param.sMode == "Explore" && objContentExplore != null)
		{
			result.sHeaderNav = request.Param.sLanguage == "en" ? "Explore One Bangkok" : "สำรวจ วัน แบงค็อก";
			result.sID = objContentExplore.Id;
			result.sHeaderImagePath = GlobalFunctionMarcom.GetTextLanguage(request.Param.sLanguage, objContentExplore.HeadImageURLEN, objContentExplore.HeadImageURLTH, objContentExplore.HeadImageURLCN);
			result.sTitle = GlobalFunctionMarcom.GetTextLanguage(request.Param.sLanguage, objContentExplore.TitleEn, objContentExplore.TitleTH, objContentExplore.TitleCN);
			result.sIntroduce = GlobalFunctionMarcom.GetTextLanguage(request.Param.sLanguage, objContentExplore.IntroduceEN, objContentExplore.IntroduceTH, objContentExplore.IntroduceCN);
			result.isArtAndCulture = false;
			result.sMode = request.Param.sMode;

			//Related
			if (objContentExplore.IsShowRelatedLink)
			{
				result.sTitleRelated = GlobalFunctionMarcom.GetTextLanguage(request.Param.sLanguage, objContentExplore.TitleRelatedEN, objContentExplore.TitleRelatedTH, objContentExplore.TitleRelatedCN);
				result.sSubTitleRelated = GlobalFunctionMarcom.GetTextLanguage(request.Param.sLanguage, objContentExplore.SubTitleRelatedEN, objContentExplore.SubTitleRelatedTH, objContentExplore.SubTitleRelatedCN);

				//List Related
				var lstRelated = lstExploreAll.Where(w => w.Id != request.Param.sID).ToList();

				var lstRelatedResult = new List<RelateContentItem>();
				foreach (var iR in lstRelated)
				{
					var objRelated = new RelateContentItem();
					objRelated.sID = iR.Id;
					objRelated.sImagePath = GlobalFunctionMarcom.GetTextLanguage(request.Param.sLanguage, iR.CoverImageURLEN, iR.CoverImageURLTH, iR.CoverImageURLCN);
					objRelated.sTitle = GlobalFunctionMarcom.GetTextLanguage(request.Param.sLanguage, iR.TitleEn, iR.TitleTH, iR.TitleCN);
					objRelated.sDescription = GlobalFunctionMarcom.GetTextLanguage(request.Param.sLanguage, iR.IntroduceEN, iR.IntroduceTH, iR.IntroduceCN);
					objRelated.sLinkToID = iR.Id;
					objRelated.isBanner = false;

					lstRelatedResult.Add(objRelated);
				}

				result.lstRelated = lstRelatedResult;
			}


			//List Content If Not has data in select lang use en instead
			var hasDataInLang = true;
			switch (request.Param.sLanguage)
			{
				case "en": hasDataInLang = !string.IsNullOrEmpty(objContentExplore.TitleEn); break;
				case "th": hasDataInLang = !string.IsNullOrEmpty(objContentExplore.TitleTH); break;
				case "zh": hasDataInLang = !string.IsNullOrEmpty(objContentExplore.TitleCN); break;
			}
			if (!hasDataInLang) request.Param.sLanguage = "en";
			var lstContentAll = lstExploreContentAll.Where(w => w.ContentId == request.Param.sID && w.Language == request.Param.sLanguage).ToList();

			//Content
			var lstContentResult = new List<ContentDetailItem>();
			foreach (var iC in lstContentAll)
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
		}
		//Banner
		else if (request.Param.isBanner == true && objBanner != null)
		{
			result.sID = objBanner.Id;
			result.sHeaderImagePath = GlobalFunctionMarcom.GetTextLanguage(request.Param.sLanguage, objBanner.HeaderImageURLEN, objBanner.HeaderImageURLTH, objBanner.HeaderImageURLCN);
			result.sTitle = GlobalFunctionMarcom.GetTextLanguage(request.Param.sLanguage, objBanner.TitleEN, objBanner.TitleTH, objBanner.TitleCN);
			result.sMode = "Banner";
			//Related
			if (objBanner.IsShowRelatedLink == true)
			{
				result.sTitleRelated = "Related";

				//List Related
				var lstRelated = lstMainBannerAll.Where(w => w.Id != request.Param.sID && w.Type != 3).ToList();

				var lstRelatedResult = new List<RelateContentItem>();
				foreach (var iR in lstRelated)
				{
					var isHasInLang = false;
					if (request.Param.sLanguage == "en")
					{
						isHasInLang = !string.IsNullOrEmpty(iR.ImageURLEN);
					}
					else if (request.Param.sLanguage == "th")
					{
						isHasInLang = !string.IsNullOrEmpty(iR.ImageURLTH);
					}
					else if (request.Param.sLanguage == "zh")
					{
						isHasInLang = !string.IsNullOrEmpty(iR.ImageURLCN);
					}

					var objRelated = new RelateContentItem();
					objRelated.sID = iR.Id;
					objRelated.sImagePath = (isHasInLang ? GlobalFunctionMarcom.GetBoolLanguage(request.Param.sLanguage, iR.IsImageEN, iR.IsImageTH, iR.IsImageCN) : iR.IsImageEN) ?
						GlobalFunctionMarcom.GetTextLanguage(request.Param.sLanguage, iR.ImageURLEN, iR.ImageURLTH, iR.ImageURLCN) :
						GlobalFunctionMarcom.GetTextLanguage(request.Param.sLanguage, iR.HeaderImageURLEN, iR.HeaderImageURLTH, iR.HeaderImageURLCN);
					objRelated.sTitle = iR.Type == 1 ? GlobalFunctionMarcom.GetTextLanguage(request.Param.sLanguage, iR.TitleEN, iR.TitleTH, iR.TitleCN) : iR.BannerName;
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
				case "en": hasDataInLang = !string.IsNullOrEmpty(objBanner.HeaderImageURLEN); break;
				case "th": hasDataInLang = !string.IsNullOrEmpty(objBanner.HeaderImageURLTH); break;
				case "zh": hasDataInLang = !string.IsNullOrEmpty(objBanner.HeaderImageURLCN); break;
			}
			if (!hasDataInLang) request.Param.sLanguage = "en";
			var lstContentAll = lstExploreContentAll.Where(w => w.ContentId == request.Param.sID && w.Language == request.Param.sLanguage).ToList();

			//Content
			var lstContentResult = new List<ContentDetailItem>();
			foreach (var iC in lstContentAll)
			{
				var objContent = new ContentDetailItem();
				objContent.sMode = iC.ContentType == 1 ? "Text" : iC.ContentType == 2 ? "Image" : "Youtube";
				objContent.sContent = iC.Text;
				objContent.sImagePath = iC.ImageURL;
				objContent.sYoutubeURL = iC.YoutubeURL;
				objContent.sYoutubeID = !string.IsNullOrEmpty(iC.YoutubeURL) ? (iC.YoutubeURL.Split("v=")[1].Length > 0 ? iC.YoutubeURL.Split("v=")[1] : "") : null;

				lstContentResult.Add(objContent);
			}
			result.lstContent = lstContentResult;
		}

		//Tag
		var lstTage = lstTagAll.Where(w => w.ContentId == request.Param.sID).ToList();
		var lstTagResult = new List<TagItem>();
		foreach (var iT in lstTage)
		{
			var objTag = new TagItem();
			objTag.sTagName = iT.TagName;

			lstTagResult.Add(objTag);
		}
		result.lstTag = lstTagResult;

		return result;
	}
}
