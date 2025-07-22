using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Caching.Memory;
using Newtonsoft.Json;
using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Features.Marcom.Query.GetWhatHappenAll;
namespace TCCTOBK.OperationBackend.Application.Features.Marcom.Query.GetMainContent;
public class GetWhatHappenAllHandler : IQueryHandler<GetWhatHappenAllQuery, WhatHappenAllResult>
{
	readonly IUnitOfWork _uow;
	IDistributedCache _cache;
	public GetWhatHappenAllHandler(IUnitOfWork uow, IDistributedCache cache)
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
	private async Task<List<WhatHappenCategoryCatch>> GetCategoryFromCatch(Func<Task<List<WhatHappenCategoryCatch>>> func)
	{
		string keyCache = "MarcomWhanHappeningCategory";
		return await GetFromCacheOrQuery(keyCache, GetExpiredSecond(), func);
	}
	private async Task<List<WhatHappenCategoryCatch>> GetCategory()
	{
		var lstWhatHappenCategoryAll = await _uow.MarcomMobileRepository.GetWhatHappenCategoryAll();

		var lstCategory = lstWhatHappenCategoryAll.ToList();
		var lstCategoryResult = new List<WhatHappenCategoryCatch>();
		foreach (var iC in lstCategory)
		{
			WhatHappenCategoryCatch objCat = new WhatHappenCategoryCatch();
			objCat.sID = iC.Id;
			objCat.sCategoryNameEN = iC.CategoryNameEn;
			objCat.sCategoryNameTH = iC.CategoryNameTH ?? "";
			objCat.sCategoryNameCN = iC.CategoryNameCN ?? "";
			lstCategoryResult.Add(objCat);
		}

		return lstCategoryResult;
	}
	private async Task<List<ContentCardWhatHappenItemCatch>> GetWhatHappeningFromCatch(Func<Task<List<ContentCardWhatHappenItemCatch>>> func)
	{
		string keyCache = "MarcomWhatHappeningAll";
		return await GetFromCacheOrQuery(keyCache, GetExpiredSecond(), func);
	}
	private async Task<List<ContentCardWhatHappenItemCatch>> GetWhatHappening()
	{
		var lstWhatHappenCategoryAll = await _uow.MarcomMobileRepository.GetWhatHappenCategoryAll();
		var lstWhatHappenSubAll = await _uow.MarcomMobileRepository.GetWhatHappenSubAll();

		var lstWhatHappenPin = lstWhatHappenSubAll.Where(w => w.ShowTimeStartDate <= DateTime.Now && (w.IsNotSpecify ? true : w.ShowTimeEndDate >= DateTime.Now) && w.IsPin).OrderBy(o => o.OrderPin).ToList();
		var lstWhatHappenUnPin = lstWhatHappenSubAll.Where(w => w.ShowTimeStartDate <= DateTime.Now && (w.IsNotSpecify ? true : w.ShowTimeEndDate >= DateTime.Now) && !w.IsPin).OrderBy(o => o.Order).ToList();
		var lstWhatHappenAll = lstWhatHappenPin.Union(lstWhatHappenUnPin).ToList();
		var lstWhatHappenAllResult = new List<ContentCardWhatHappenItemCatch>();
		foreach (var iW in lstWhatHappenAll)
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
				objHappen.dStart = iW.EventTimeStartDate;
				objHappen.dEnd = iW.EventTimeEndDate;

				lstWhatHappenAllResult.Add(objHappen);
			}
		}
		return lstWhatHappenAllResult;
	}
	public async Task<WhatHappenAllResult> Handle(GetWhatHappenAllQuery request, CancellationToken cancellationToken)
	{
		WhatHappenAllResult result = new WhatHappenAllResult();

		#region Category
		var lstCategory = await GetCategoryFromCatch(GetCategory);
		var lstCategoryResult = new List<WhatHappenCategory>();
		foreach (var iC in lstCategory)
		{
			WhatHappenCategory objCat = new WhatHappenCategory();
			objCat.sID = iC.sID;
			objCat.sCategoryName = GlobalFunctionMarcom.GetTextLanguage(request.Param.sLanguage, iC.sCategoryNameEN, iC.sCategoryNameTH, iC.sCategoryNameCN);

			lstCategoryResult.Add(objCat);
		}
		result.lstCategory = lstCategoryResult;
		#endregion Category

		#region What happening all
		var lstWhatHappenAll = await GetWhatHappeningFromCatch(GetWhatHappening);
		var lstWhatHappenAllResult = new List<ContentCardWhatHappenItem>();
		foreach (var iW in lstWhatHappenAll)
		{
			ContentCardWhatHappenItem objHappen = new ContentCardWhatHappenItem();
			objHappen.sID = iW.sID;
			objHappen.sCategolyID = iW.sCategolyID;
			objHappen.sCategory = GlobalFunctionMarcom.GetTextLanguage(request.Param.sLanguage, iW.sCategoryEN, iW.sCategoryTH, iW.sCategoryCN);
			objHappen.sTitle = GlobalFunctionMarcom.GetTextLanguage(request.Param.sLanguage, iW.sTitleEN, iW.sTitleTH, iW.sTitleCN);
			objHappen.sLocation = GlobalFunctionMarcom.GetTextLanguage(request.Param.sLanguage, iW.sLocationEN, iW.sLocationTH, iW.sLocationCN);
			objHappen.sDate = iW.sDate;
			objHappen.sCoverImagePath = GlobalFunctionMarcom.GetTextLanguage(request.Param.sLanguage, iW.sCoverImagePathEN, iW.sCoverImagePathTH, iW.sCoverImagePathCN);
			objHappen.dStart = iW.dStart;
			objHappen.dEnd = iW.dEnd;

			lstWhatHappenAllResult.Add(objHappen);
		}
		result.lstWhatHappen = lstWhatHappenAllResult;
		#endregion What happening all

		return result;
	}
}
