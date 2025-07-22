using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Domain.Entities;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Linq;
using TCCTOBK.OperationBackend.Application.Exceptions;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.DigitalLibraryManagement.Command.DigitalLibrary;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.DigitalLibraryManagement.Query.GetAllDigitalLibrary;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.PRBannerManagement.Model;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.PRBannerManagement.Query.GetAllPRBannerManagement;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.PRBannerManagement.Query.GetPRBannerManagement;
using TCCTOBK.OperationBackend.Application.Helper.Table;
using TCCTOBK.OperationBackend.Domain;
using TCCTOBK.OperationBackend.Application.Features.Marcom.SpecialEvent.Query.GetAll;
using TCCTOBK.OperationBackend.Application.Features.Marcom.SpecialEvent.Query.GetSpecialEvent;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.SpecialEvent.Model;
using TCCTOBK.OperationBackend.Application.Contracts.Minio;
using TCCTOBK.OperationBackend.Application.Features.Marcom.Explore.Model;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.BannerManagement.Query.GetBanner;
using System.Reflection;
using Minio.DataModel.Tags;
using TCCTOBK.OperationBackend.Application.Features.Marcom.Explore.Query.GetAllExplore;
using TCCTOBK.OperationBackend.Application.Features.Marcom.Explore.Query.GetExplore;
using TCCTOBK.OperationBackend.Application.Features.Marcom.Happening.Model;
using TCCTOBK.OperationBackend.Application.Features.Marcom.Happening.Query.GetAllCategory;
using TCCTOBK.OperationBackend.Application.Features.Marcom.Happening.Query.GetHappening;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.ContentManagement.Query.GetAllContentManagement;
using TCCTOBK.OperationBackend.Application.Features.Marcom.Happening.Query.GetAllContent;
using Amazon.SimpleEmail.Model;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.ContentManagement.Query.GetContentManagement;
using System.Web;

namespace TCCTOBK.OperationBackend.Application.Repositories;
internal class MarcomRepository : BaseRepository<trMarcomPRBanner>, IMarcomRepository
{
	private readonly IMinioService _minioservice;
	public MarcomRepository(ITCCTOBKContext context, IMinioService minioservice) : base(context)
	{
		_minioservice = minioservice;

	}


	public async Task<Guid> DeletePRBanner(DeleteBannerMarcom data, AuditableModel auditable)
	{
		trMarcomPRBanner banner = new trMarcomPRBanner()
		{
			Order = 1,
			IsActive = true,
			IsDelete = false,
			BannerName = "",
			FileNameEN = "",
			HeaderFileNameEN = "",
			HeaderImageURLEN = "",
			HeaderOriginalFileNameEN = "",
			ImageURLEN = "",
			OriginalFileNameEN = "",
			TitleEN = "",
			Type = 0,
			StartDate = DateTime.Now,
			IsNotSpecify = false,
			IsImageEN = false
		};


		if (data.Id.HasValue)
		{
			trMarcomPRBanner? bannerold = await Db.AsTracking().FirstOrDefaultAsync(w => w.Id == data.Id);
			if (bannerold != null)
			{
				banner = bannerold;
			}
			var lstBanner = await Db.AsTracking().Where(w => !w.IsDelete && w.Id != data.Id).OrderBy(o => o.Order).ToListAsync();
			if (lstBanner != null)
			{
				int nOrder = 1;
				foreach (var item in lstBanner)
				{
					item.Order = nOrder;
					nOrder++;

					await Context.SaveChangesAsync();
				}
			}
		}

		banner.IsDelete = true;
		banner.UpdatedBy = auditable.UpdatedBy;
		banner.UpdatedByName = auditable.UpdatedByName + "";
		banner.UpdatedDate = auditable.UpdatedDate;

		return banner.Id;
	}

	private DateTime ToDateTime(double instance,bool fixtime)
	{
		DateTime result = DateTime.UnixEpoch;
		result = result.AddMilliseconds(instance).ToLocalTime();
		if (fixtime)
		{
			result = result.Date;
		}
		return result;
	}

	private double ToUnixTime(DateTime instance)
	{
		double result;
		DateTimeOffset dateValue = new DateTimeOffset(instance.ToUniversalTime());
		result = dateValue.ToUnixTimeMilliseconds();
		return result;
	}

	private bool CheckPublic(DateTime start, DateTime? end, DateTime current, bool alltime)
	{
		if (current >= start && alltime)
		{
			return true;
		}

		if (current >= start && (end == null || current <= end))
		{
			return true;
		}

		return false;
	}


	public async Task<Guid> UpdatePRBanner(MarcomManagementDataModel data, AuditableModel auditable)
	{
		trMarcomPRBanner banner = new trMarcomPRBanner()
		{
			Order = 1,
			IsActive = true,
			IsDelete = false,
			BannerName = "",
			FileNameEN = "",
			HeaderFileNameEN = "",
			HeaderImageURLEN = "",
			HeaderOriginalFileNameEN = "",
			ImageURLEN = "",
			OriginalFileNameEN = "",
			TitleEN = "",
			Type = 0,
			StartDate = DateTime.Now,
			IsNotSpecify = false,
			IsImageEN = false,
		};

		bool isnew = true;

		if (data.Id.HasValue)
		{
			trMarcomPRBanner? bannerold = await Db.AsTracking().FirstOrDefaultAsync(w => w.Id == data.Id);
			if (bannerold != null)
			{
				trMarcomPRBanner? existBanner = await Db.AsTracking().FirstOrDefaultAsync(w => !w.IsDelete && w.BannerName.Trim().ToLower() == (data.BannerName + "").Trim().ToLower() && data.Id.Value != w.Id);
				if (existBanner != null) throw new BadRequestException("Banner name is duplicate in system");
				banner = bannerold;
				isnew = false;
			}
		}

		banner.BannerName = data.BannerName;
		banner.IsActive = data.Status;
		banner.IsDelete = false;
		banner.LinkToURL = data.LinkToURL;
		banner.IsShowRelatedLink = data.IsShowRelatedLink;
		banner.Type = data.Type;
		banner.StartDate = ToDateTime(data.Start, false);
		banner.EndDate = data.End.HasValue ? ToDateTime(data.End.Value, false) : null;
		banner.IsNotSpecify = data.Alltime;

		if (data.Type == Constant.CONTENT_TEMPLATE_LINK)
		{
			banner.LinkToURL = data.LinkToURL;
		}

		banner.UpdatedBy = auditable.UpdatedBy;
		banner.UpdatedByName = auditable.UpdatedByName + "";
		banner.UpdatedDate = auditable.UpdatedDate;

		if (isnew)
		{
			trMarcomPRBanner? existBanner = await Db.AsTracking().FirstOrDefaultAsync(w => !w.IsDelete && w.BannerName.Trim().ToLower() == (data.BannerName + "").Trim().ToLower());
			if (existBanner != null) throw new BadRequestException("Banner name is duplicate in system");
			banner.Id = Guid.NewGuid();
			banner.Order = (await Db.Where(w => !w.IsDelete).AnyAsync() ? await Db.Where(w => !w.IsDelete).MaxAsync(m => m.Order) : 0) + 1;

			banner.CreatedBy = auditable.CreatedBy;
			banner.CreatedByName = auditable.CreatedByName + "";
			banner.CreatedDate = auditable.CreatedDate;

			Db.Add(banner);
		}

		MarcomBannerManagementLang detail = data.Detail;

		if (data.Type == Constant.CONTENT_TEMPLATE_CONTENT)
		{
			banner.LinkToURL = null;
			////detail.En.CMS = new List<CmsContent>();
			////detail.Cn.CMS = new List<CmsContent>();
			////detail.Th.CMS = new List<CmsContent>();
		}

		//en
		banner.TitleEN = (detail.En.Title + "").Trim();
		banner.TextEN = detail.En.Text?.Trim();
		banner.IsImageEN = detail.En.Type ?? false;
		banner.ImageURLEN = detail.En.Type == true  ? detail.En.ImageURL + "" : "digitallibrary";
		banner.FileNameEN = detail.En.FileName + "";
		banner.OriginalFileNameEN = detail.En.OriginalFileName + "";
		banner.HeaderFileNameEN = detail.En.HeaderFileName + "";
		banner.HeaderImageURLEN = detail.En.HeaderImageURL + "";
		banner.HeaderOriginalFileNameEN = detail.En.HeaderOriginalFileName + "";
		UpdateContentManagementContent(banner.Id, detail.En.CMS, "en", auditable);

		if (!detail.Cn.ImageURL.IsNullOrEmpty())
		{
			//cn
			banner.TitleCN = (detail.Cn.Title + "").Trim();
			banner.TextCN = detail.Cn.Text?.Trim();
			banner.IsImageCN = detail.Cn.Type ?? false;
			banner.ImageURLCN = detail.Cn.Type == true ? detail.Cn.ImageURL + "" : "digitallibrary";
			banner.FileNameCN = detail.Cn.FileName;
			banner.OriginalFileNameCN = detail.Cn.OriginalFileName;
			banner.HeaderFileNameCN = detail.Cn.HeaderFileName;
			banner.HeaderImageURLCN = detail.Cn.HeaderImageURL;
			banner.HeaderOriginalFileNameCN = detail.Cn.HeaderOriginalFileName;
			UpdateContentManagementContent(banner.Id, detail.Cn.CMS, "zh", auditable);
		}
		else
		{
			banner.IsImageCN = true;
			banner.TitleCN = null;
			banner.TextCN = null;
			banner.ImageURLCN = null;
			banner.FileNameCN = null;
			banner.OriginalFileNameCN = null;
			banner.HeaderFileNameCN = null;
			banner.HeaderImageURLCN = null;
			banner.HeaderOriginalFileNameCN = null;
			UpdateContentManagementContent(banner.Id, new List<CmsContent>(), "zh", auditable);
		}

		if (!detail.Th.ImageURL.IsNullOrEmpty())
		{
			//th
			banner.TitleTH = (detail.Th.Title + "").Trim();
			banner.TextTH = detail.Th.Text?.Trim();
			banner.IsImageTH = detail.Th.Type ?? false;
			banner.ImageURLTH = detail.Th.Type == true ? detail.Th.ImageURL + "" : "digitallibrary";
			banner.FileNameTH = detail.Th.FileName;
			banner.OriginalFileNameTH = detail.Th.OriginalFileName;
			banner.HeaderFileNameTH = detail.Th.HeaderFileName;
			banner.HeaderImageURLTH = detail.Th.HeaderImageURL;
			banner.HeaderOriginalFileNameTH = detail.Th.HeaderOriginalFileName;
			UpdateContentManagementContent(banner.Id, detail.Th.CMS, "th", auditable);
		}
		else
		{
			banner.IsImageTH = true;
			banner.TitleTH = null;
			banner.TextTH = null;
			banner.ImageURLTH = null;
			banner.FileNameTH = null;
			banner.OriginalFileNameTH = null;
			banner.HeaderFileNameTH = null;
			banner.HeaderImageURLTH = null;
			banner.HeaderOriginalFileNameTH = null;
			UpdateContentManagementContent(banner.Id, new List<CmsContent>(), "th", auditable);
		}


		return banner.Id;
	}

	private IQueryable<trMarcomPRBanner> GetAllQueryBuilderPRBanner(string? filter, int? status)
	{
		IQueryable<trMarcomPRBanner> query = Db.Where(w => !w.IsDelete).AsNoTracking();
		if (!string.IsNullOrEmpty(filter))
		{
			query = query.Where(x => x.BannerName.Trim().ToLower().Contains(filter.Trim().ToLower()));
		}

		if (status.HasValue)
		{
			bool isStatus = status.Value == Constant.DIGITAL_STATUS_ACTIVE;
			query = query.Where(x => x.IsActive == isStatus);
		}
		return query;
	}

	private IQueryable<trMarcomSpecialEvent> GetAllQueryBuilderSpecialEvent(string? filter, int? status)
	{
		IQueryable<trMarcomSpecialEvent> query = Context.MarcomSpecialEvent.Where(w => !w.IsDelete).AsNoTracking();
		if (!string.IsNullOrEmpty(filter))
		{
			query = query.Where(x => x.EventName.Trim().ToLower().Contains(filter.Trim().ToLower()));
		}

		if (status.HasValue)
		{
			bool isStatus = status.Value == Constant.DIGITAL_STATUS_ACTIVE;
			query = query.Where(x => x.IsActive == isStatus);
		}
		return query;
	}

	private IQueryable<trMarcomCMSExplore> GetAllQueryBuilderExplore(string? filter, int? status)
	{
		IQueryable<trMarcomCMSExplore> query = Context.MarcomCMSExplore.Where(w => !w.IsDelete).AsNoTracking();
		if (!string.IsNullOrEmpty(filter))
		{
			query = query.Where(x => x.TitleEn.Trim().ToLower().Contains(filter.Trim().ToLower()));
		}

		if (status.HasValue)
		{
			bool isStatus = status.Value == Constant.DIGITAL_STATUS_ACTIVE;
			query = query.Where(x => x.IsActive == isStatus);
		}
		return query;
	}

	private IQueryable<trMarcomCMSWhatHappenCategory> GetAllQueryBuilderCategory(string? filter, int? status)
	{
		IQueryable<trMarcomCMSWhatHappenCategory> query = Context.MarcomCMSWhatHappenCategory.Where(w => !w.IsDelete).AsNoTracking();
		if (!string.IsNullOrEmpty(filter))
		{
			query = query.Where(x => x.CategoryNameEn.Trim().ToLower().Contains(filter.Trim().ToLower()));
		}

		if (status.HasValue)
		{
			bool isStatus = status.Value == Constant.DIGITAL_STATUS_ACTIVE;
			query = query.Where(x => x.IsActive == isStatus);
		}
		return query;
	}

	private IQueryable<trMarcomCMSWhatHappenSub> GetAllQueryBuilderSubContent(string? filter, int? status)
	{
		IQueryable<trMarcomCMSWhatHappenSub> query = Context.MarcomCMSWhatHappenSub.Where(w => !w.IsDelete).AsNoTracking();
		if (!string.IsNullOrEmpty(filter))
		{
			query = query.Where(x => x.TitleEn.Trim().ToLower().Contains(filter.Trim().ToLower()));
		}

		if (status.HasValue)
		{
			bool isStatus = status.Value == Constant.DIGITAL_STATUS_ACTIVE;
			query = query.Where(x => x.IsActive == isStatus);
		}
		return query;
	}

	private IQueryable<trMarcomCMSExploreContent> GetAllQueryBuilderCMSContent()
	{
		var query = Context.MarcomCMSExploreContent.Where(w => !w.IsDelete).AsNoTracking();
		return query;
	}

	private IQueryable<trMarcomCMSWhatHappenContent> GetAllQueryBuilderHappeningContent()
	{
		var query = Context.MarcomCMSWhatHappenContent.Where(w => !w.IsDelete).AsNoTracking();
		return query;
	}


	private IQueryable<trMarcomCMSTag> GetAllQueryBuilderTag()
	{
		var query = Context.MarcomCMSTag.Where(w => !w.IsDelete).AsNoTracking();
		return query;
	}

	private string GetFileURL(string? attachFileName) {
		if (string.IsNullOrEmpty(attachFileName))
		{
			return "";
		}
		var fileURL = Task.Run(() => _minioservice.GetObject("digitallibrary", attachFileName));
		fileURL.Wait();
		return fileURL.Result;
	}

	public async Task<GetMarcomBannerManagementResult> GetPRBannerById(Guid id)
	{
		var query = await GetAllQueryBuilderPRBanner(null, null).ToListAsync();
		var banner = query.Find(w => w.Id == id);

		GetMarcomBannerManagementResult result = new GetMarcomBannerManagementResult();
		if (banner != null)
		{
			PRBannerManagementLang lang = new PRBannerManagementLang();
			List<trMarcomCMSExploreContent> querycontent = await GetAllQueryBuilderCMSContent().Where(w => w.ContentId == banner.Id).ToListAsync();

			List<CmsContent> lstcontent = new List<CmsContent>();

			querycontent.ForEach(item =>
			{
				lstcontent.Add(new CmsContent()
				{
					Id = item.Id,
					MenuId = item.ContentId,
					Language = item.Language,
					ContentType = item.ContentType,
					Order = item.Order,
					Text = item.Text,
					ImageURL = item.ImageURL,
					OriginalFileName = item.OriginalFileName,
					YoutubeURL = item.YoutubeURL,
					IsActive = item.IsActive,
					IsDelete = item.IsDelete
				});
			});

			lang.En = new PRBannerManagementDetail()
			{
				Title = banner.TitleEN,
				Text = banner.TextEN,
				Type = banner.IsImageEN,
				ImageURL = banner.IsImageEN ? banner.ImageURLEN : GetFileURL(banner.FileNameEN),
				FileName = banner.FileNameEN,
				OriginalFileName = banner.OriginalFileNameEN,
				HeaderImageURL = banner.HeaderImageURLEN,
				HeaderFileName = banner.HeaderFileNameEN,
				HeaderOriginalFileName = banner.HeaderOriginalFileNameEN,
				CMS = lstcontent.Where(w => w.Language == "en").OrderBy(o => o.Order).ToList()
			};

			lang.Cn = new PRBannerManagementDetail()
			{
				Title = banner.TitleCN,
				Text = banner.TextCN,
				Type = banner.IsImageCN,
				ImageURL = banner.IsImageCN == true ? banner.ImageURLCN : GetFileURL(banner.FileNameCN),
				FileName = banner.FileNameCN,
				OriginalFileName = banner.OriginalFileNameCN,
				HeaderImageURL = banner.HeaderImageURLCN,
				HeaderFileName = banner.HeaderFileNameCN,
				HeaderOriginalFileName = banner.HeaderOriginalFileNameCN,
				CMS = lstcontent.Where(w => w.Language == "zh").OrderBy(o => o.Order).ToList()
			};

			lang.Th = new PRBannerManagementDetail()
			{
				Title = banner.TitleTH,
				Text = banner.TextTH,
				Type = banner.IsImageTH,
				ImageURL = banner.IsImageTH == true ? banner.ImageURLTH : GetFileURL(banner.FileNameTH),
				FileName = banner.FileNameTH,
				OriginalFileName = banner.OriginalFileNameTH,
				HeaderImageURL = banner.HeaderImageURLTH,
				HeaderFileName = banner.HeaderFileNameTH,
				HeaderOriginalFileName = banner.HeaderOriginalFileNameTH,
				CMS = lstcontent.Where(w => w.Language == "th").OrderBy(o => o.Order).ToList()
			};

			MarcomBannerManagementModel data = new MarcomBannerManagementModel()
			{
				Id = banner.Id,
				IsDelete = banner.IsDelete,
				IsShowRelatedLink = banner.IsShowRelatedLink ?? false,
				BannerName = banner.BannerName,
				LinkToURL = banner.LinkToURL,
				Type = banner.Type,
				Order = banner.Order,
				Status = banner.IsActive,
				Start = ToUnixTime(banner.StartDate),
				End = banner.EndDate.HasValue ? ToUnixTime(banner.EndDate.Value) : null,
				Alltime = banner.IsNotSpecify,
				Detail = new PRBannerManagementLang()
				{
					En = lang.En,
					Cn = lang.Cn,
					Th = lang.Th,
				}
			};

			result.Data = data;
			result.StatusCode = StatusCodes.Status200OK;
		}
		else
		{
			result.StatusCode = StatusCodes.Status404NotFound;
		}

		return result;
	}

	public async Task<MarcomBannerResult> GetAllPRBanner(string? filter, int? status, TableState state)
	{
		List<trMarcomPRBanner> query = await GetAllQueryBuilderPRBanner(filter, status).OrderBy(o => o.Order).ToListAsync();
		List<trMarcomPRBanner> queryOrder = await GetAllQueryBuilderPRBanner(null, null).OrderBy(o => o.Order).ToListAsync();
		int max = queryOrder.Any() ? queryOrder.Max(m => m.Order) : 1;

		List<trMarcomCMSExploreContent> querycontent = await GetAllQueryBuilderCMSContent().Where(w => w.Language == "en").ToListAsync();
		int total = query.Count;

		query = query.Skip(state.Skip).Take(state.Take).ToList();

		List<MarcomBannerTable> lstTable = new List<MarcomBannerTable>();

		query.ForEach(banner =>
		{

			List<CmsContent> lstcontent = new List<CmsContent>();

			querycontent.Where(w => w.ContentId == banner.Id).OrderBy(o => o.Order).ToList().ForEach(item =>
			{
				lstcontent.Add(new CmsContent()
				{
					Id = item.Id,
					MenuId = item.ContentId,
					Language = item.Language,
					ContentType = item.ContentType,
					Order = item.Order,
					Text = item.Text,
					ImageURL = item.ImageURL,
					OriginalFileName = item.OriginalFileName,
					YoutubeURL = item.YoutubeURL,
					IsActive = item.IsActive,
					IsDelete = item.IsDelete
				});
			});

			lstTable.Add(new MarcomBannerTable()
			{
				Id = banner.Id,
				Status = banner.IsActive ? "active" : "inactive",
				BannerName = banner.BannerName,
				IsHasContent = banner.Type == Constant.CONTENT_TEMPLATE_CONTENT,
				IsHasLink = banner.Type == Constant.CONTENT_TEMPLATE_LINK,
				IsHasEN = !banner.ImageURLEN.IsNullOrEmpty(),
				IsHasCN = !banner.ImageURLCN.IsNullOrEmpty(),
				IsHasTH = !banner.ImageURLTH.IsNullOrEmpty(),
				LastUpdate = ToUnixTime(banner.UpdatedDate),
				Content = new MarcomBannerManagementDetail()
				{
					Title = banner.TitleEN,
					Text = banner.TextEN,
					ImageURL = banner.ImageURLEN,
					FileName = banner.FileNameEN,
					OriginalFileName = banner.OriginalFileNameEN,
					HeaderImageURL = banner.HeaderImageURLEN,
					HeaderFileName = banner.HeaderFileNameEN,
					HeaderOriginalFileName = banner.HeaderOriginalFileNameEN,
					CMS = lstcontent
				},
				ConfigOrder = new MarcomBannerOrder()
				{
					Current = banner.Order,
					Max = max,
				}

			});
		});

		int totalPage = (int)Math.Ceiling((double)total / state.Take);
		string sTime = "";
		trMarcomConfig? objConfig = await Context.MarcomConfig.Where(w => w.Type == 1).AsTracking().FirstOrDefaultAsync();
		if (objConfig != null)
		{
			sTime = objConfig.ValueInt + "";
		}

		MarcomBannerResult result = new MarcomBannerResult()
		{
			Data = lstTable,
			Pagination = new Features.Sustainability.PRBannerManagement.Query.GetAllPRBannerManagement.CmsMarcomPagination()
			{
				Total = total,
				Total_page = totalPage,
				Page_number = state.Page
			},
			Time = sTime
		};

		return result;
	}

	private void UpdateContentManagementContent(Guid cmsid, List<CmsContent> cms, string lang, AuditableModel auditable)
	{
		List<Guid> lstguid = new List<Guid>();
		cms = cms.OrderBy(o => o.Order).ToList();

		cms.ForEach(item =>
		{
			trMarcomCMSExploreContent content = new trMarcomCMSExploreContent()
			{
				Id = Guid.NewGuid(),
				ContentId = cmsid,
				Order = item.Order ?? 1,
				Language = lang,
				ContentType = item.ContentType ?? 1,
				IsActive = true,
				IsDelete = false,
				UpdatedBy = auditable.UpdatedBy,
				UpdatedByName = auditable.UpdatedByName + "",
				UpdatedDate = auditable.UpdatedDate,
				CreatedBy = auditable.CreatedBy,
				CreatedByName = auditable.CreatedByName + "",
				CreatedDate = auditable.CreatedDate
			};

			if (content.ContentType == Constant.CONTENT_TYPE_HTML)
			{
				content.Text = item.Text;
				content.YoutubeURL = null;
				content.ImageURL = null;
				content.FileName = null;
				content.OriginalFileName = null;
			}
			else if (content.ContentType == Constant.CONTENT_TYPE_IMAGE)
			{
				content.Text = null;
				content.YoutubeURL = null;
				content.ImageURL = item.ImageURL;
				content.FileName = item.FileName;
				content.OriginalFileName = item.OriginalFileName;
			}
			else if (content.ContentType == Constant.CONTENT_TYPE_YOUTUBE)
			{
				content.Text = null;
				content.YoutubeURL = RemoveTimeParameter(item.YoutubeURL ?? "");
				content.ImageURL = null;
				content.FileName = null;
				content.OriginalFileName = null;
			}

			Context.MarcomCMSExploreContent.Add(content);

			lstguid.Add(content.Id);
		});

		List<trMarcomCMSExploreContent> lstDelete = Context.MarcomCMSExploreContent.AsTracking().Where(w => w.ContentId == cmsid && w.Language == lang && !lstguid.Contains(w.Id)).ToList();
		Context.MarcomCMSExploreContent.RemoveRange(lstDelete);

		////return lstguid;
	}

	private string RemoveTimeParameter(string url)
	{
		Uri uri = new Uri(url);

		var queryParams = HttpUtility.ParseQueryString(uri.Query);

		queryParams.Remove("t");

		string newQuery = queryParams.ToString() ?? "";

		UriBuilder uriBuilder = new UriBuilder(uri)
		{
			Query = newQuery
		};

		// Avoid showing port 443 if it's HTTPS
		if (uriBuilder.Scheme == Uri.UriSchemeHttps && uriBuilder.Port == 443)
		{
			uriBuilder.Port = -1; // This hides the port number
		}

		return uriBuilder.ToString();
	}

	private void UpdateHappeningContent(Guid cmsid, List<CmsContent> cms, string lang, AuditableModel auditable)
	{
		List<Guid> lstguid = new List<Guid>();
		cms = cms.OrderBy(o => o.Order).ToList();

		cms.ForEach(item =>
		{
			trMarcomCMSWhatHappenContent content = new trMarcomCMSWhatHappenContent()
			{
				Id = Guid.NewGuid(),
				SubContentId = cmsid,
				Order = item.Order ?? 1,
				Language = lang,
				ContentType = item.ContentType ?? 1,
				IsActive = true,
				IsDelete = false,
				UpdatedBy = auditable.UpdatedBy,
				UpdatedByName = auditable.UpdatedByName + "",
				UpdatedDate = auditable.UpdatedDate,
				CreatedBy = auditable.CreatedBy,
				CreatedByName = auditable.CreatedByName + "",
				CreatedDate = auditable.CreatedDate
			};

			if (content.ContentType == Constant.CONTENT_TYPE_HTML)
			{
				content.Text = item.Text;
				content.YoutubeURL = null;
				content.ImageURL = null;
				content.FileName = null;
				content.OriginalFileName = null;
			}
			else if (content.ContentType == Constant.CONTENT_TYPE_IMAGE)
			{
				content.Text = null;
				content.YoutubeURL = null;
				content.ImageURL = item.ImageURL;
				content.FileName = item.FileName;
				content.OriginalFileName = item.OriginalFileName;
			}
			else if (content.ContentType == Constant.CONTENT_TYPE_YOUTUBE)
			{
				content.Text = null;
				content.YoutubeURL = RemoveTimeParameter(item.YoutubeURL ?? "");
				content.ImageURL = null;
				content.FileName = null;
				content.OriginalFileName = null;
			}

			Context.MarcomCMSWhatHappenContent.Add(content);

			lstguid.Add(content.Id);
		});

		List<trMarcomCMSWhatHappenContent> lstDelete = Context.MarcomCMSWhatHappenContent.AsTracking().Where(w => w.SubContentId == cmsid && w.Language == lang && !lstguid.Contains(w.Id)).ToList();
		Context.MarcomCMSWhatHappenContent.RemoveRange(lstDelete);

		////return lstguid;
	}

	private void UpdateTag(Guid exploreid, List<string> tag, AuditableModel auditable)
	{
		List<Guid> lstguid = new List<Guid>();
		int order = 1;

		tag.ForEach(item =>
		{
			trMarcomCMSTag content = new trMarcomCMSTag()
			{
				Id = Guid.NewGuid(),
				ContentId = exploreid,
				Order = order,
				TagName = item,
				IsDelete = false,
				UpdatedBy = auditable.UpdatedBy,
				UpdatedByName = auditable.UpdatedByName + "",
				UpdatedDate = auditable.UpdatedDate,
				CreatedBy = auditable.CreatedBy,
				CreatedByName = auditable.CreatedByName + "",
				CreatedDate = auditable.CreatedDate
			};
			Context.MarcomCMSTag.Add(content);
			lstguid.Add(content.Id);
			order++;
		});

		List<trMarcomCMSTag> lstDelete = Context.MarcomCMSTag.AsTracking().Where(w => w.ContentId == exploreid && !lstguid.Contains(w.Id)).ToList();
		Context.MarcomCMSTag.RemoveRange(lstDelete);
	}

	public async Task<GetInitialMarcomBannerResult> GetInitialBanner()
	{
		List<trMarcomPRBanner> query = await GetAllQueryBuilderPRBanner(null, null).OrderBy(o => o.Order).ToListAsync();
		InitialMarcomBannerModel objInit = new InitialMarcomBannerModel();
		objInit.IsHasContent = query.Any(a => a.Type == 1);
		GetInitialMarcomBannerResult result = new GetInitialMarcomBannerResult()
		{
			Data = objInit,
			StatusCode = StatusCodes.Status200OK
		};

		return result;
	}

	public async Task<object> ChangeOrder(ChangeOrderSustainability order, AuditableModel auditable)
	{
		object result = new object();
		try
		{
			if (order.Type == Constant.TYPE_HERO_BANNER)
			{
				List<trMarcomPRBanner> query = await Db.Where(w => !w.IsDelete).OrderBy(o => o.Order).AsTracking().ToListAsync();
				trMarcomPRBanner? data = query.Find(w => w.Id == order.Id);
				if (data != null)
				{
					int oldOrder = data.Order, newOrder = order.NewOrder;
					bool isOldMoreThanNew = oldOrder > newOrder; // เลขเดิมมากกว่าเลขใหม่

					var lstChange = query.Where(w => w.Id != order.Id &&
										(isOldMoreThanNew ?
										(oldOrder >= w.Order && newOrder <= w.Order) :
										(newOrder >= w.Order && oldOrder <= w.Order))
										).ToList();

					int setOrder = isOldMoreThanNew ? newOrder : oldOrder; // เลขลำดับ
					foreach (trMarcomPRBanner item in lstChange)
					{
						item.Order = isOldMoreThanNew ? ++setOrder : setOrder++;
					}
					data.Order = newOrder;
					result = query;
				}
			}else if (order.Type == Constant.TYPE_SPECIAL_EVENT)
			{
				List<trMarcomSpecialEvent> query = await Context.MarcomSpecialEvent.Where(w => !w.IsDelete).OrderBy(o => o.Order).AsTracking().ToListAsync();
				trMarcomSpecialEvent? data = query.Find(w => w.Id == order.Id);
				if (data != null)
				{
					int oldOrder = data.Order, newOrder = order.NewOrder;
					bool isOldMoreThanNew = oldOrder > newOrder; // เลขเดิมมากกว่าเลขใหม่

					var lstChange = query.Where(w => w.Id != order.Id &&
										(isOldMoreThanNew ?
										(oldOrder >= w.Order && newOrder <= w.Order) :
										(newOrder >= w.Order && oldOrder <= w.Order))
										).ToList();

					int setOrder = isOldMoreThanNew ? newOrder : oldOrder; // เลขลำดับ
					foreach (trMarcomSpecialEvent item in lstChange)
					{
						item.Order = isOldMoreThanNew ? ++setOrder : setOrder++;
					}
					data.Order = newOrder;
					result = query;
				}
			}
			else if (order.Type == Constant.TYPE_EXPLORE)
			{
				List<trMarcomCMSExplore> query = await Context.MarcomCMSExplore.Where(w => !w.IsDelete).OrderBy(o => o.Order).AsTracking().ToListAsync();
				trMarcomCMSExplore? data = query.Find(w => w.Id == order.Id);
				if (data != null)
				{
					int oldOrder = data.Order, newOrder = order.NewOrder;
					bool isOldMoreThanNew = oldOrder > newOrder; // เลขเดิมมากกว่าเลขใหม่

					var lstChange = query.Where(w => w.Id != order.Id &&
										(isOldMoreThanNew ?
										(oldOrder >= w.Order && newOrder <= w.Order) :
										(newOrder >= w.Order && oldOrder <= w.Order))
										).ToList();

					int setOrder = isOldMoreThanNew ? newOrder : oldOrder; // เลขลำดับ
					foreach (trMarcomCMSExplore item in lstChange)
					{
						item.Order = isOldMoreThanNew ? ++setOrder : setOrder++;
					}
					data.Order = newOrder;
					result = query;
				}
			}
			else if (order.Type == Constant.TYPE_CATEGORY)
			{
				List<trMarcomCMSWhatHappenCategory> query = await Context.MarcomCMSWhatHappenCategory.Where(w => !w.IsDelete).OrderBy(o => o.Order).AsTracking().ToListAsync();
				trMarcomCMSWhatHappenCategory? data = query.Find(w => w.Id == order.Id);
				if (data != null)
				{
					int oldOrder = data.Order, newOrder = order.NewOrder;
					bool isOldMoreThanNew = oldOrder > newOrder; // เลขเดิมมากกว่าเลขใหม่

					var lstChange = query.Where(w => w.Id != order.Id &&
										(isOldMoreThanNew ?
										(oldOrder >= w.Order && newOrder <= w.Order) :
										(newOrder >= w.Order && oldOrder <= w.Order))
										).ToList();

					int setOrder = isOldMoreThanNew ? newOrder : oldOrder; // เลขลำดับ
					foreach (trMarcomCMSWhatHappenCategory item in lstChange)
					{
						item.Order = isOldMoreThanNew ? ++setOrder : setOrder++;
					}
					data.Order = newOrder;
					result = query;
				}
			}
			else if (order.Type == Constant.TYPE_CONTENT)
			{
				List<trMarcomCMSWhatHappenSub> query = await Context.MarcomCMSWhatHappenSub.Where(w => !w.IsDelete).OrderBy(o => o.Order).AsTracking().ToListAsync();
				trMarcomCMSWhatHappenSub? data = query.Find(w => w.Id == order.Id);
				if (data != null)
				{
					query = query.Where(w => w.CategoryId == data.CategoryId).ToList();
					int oldOrder = data.Order, newOrder = order.NewOrder;
					bool isOldMoreThanNew = oldOrder > newOrder; // เลขเดิมมากกว่าเลขใหม่

					var lstChange = query.Where(w => w.Id != order.Id &&
										(isOldMoreThanNew ?
										(oldOrder >= w.Order && newOrder <= w.Order) :
										(newOrder >= w.Order && oldOrder <= w.Order))
										).ToList();

					int setOrder = isOldMoreThanNew ? newOrder : oldOrder; // เลขลำดับ
					foreach (trMarcomCMSWhatHappenSub item in lstChange)
					{
						item.Order = isOldMoreThanNew ? ++setOrder : setOrder++;
					}
					data.Order = newOrder;
					result = query;
				}
			}
			else if (order.Type == Constant.TYPE_PIN)
			{
				List<trMarcomCMSWhatHappenSub> query = await Context.MarcomCMSWhatHappenSub.Where(w => !w.IsDelete && w.IsPin).OrderBy(o => o.OrderPin).AsTracking().ToListAsync();
				trMarcomCMSWhatHappenSub? data = query.Find(w => w.Id == order.Id);
				if (data != null)
				{
					int oldOrder = (data.OrderPin ?? 0), newOrder = order.NewOrder;
					bool isOldMoreThanNew = oldOrder > newOrder; // เลขเดิมมากกว่าเลขใหม่

					var lstChange = query.Where(w => w.Id != order.Id &&
										(isOldMoreThanNew ?
										(oldOrder >= w.OrderPin && newOrder <= w.OrderPin) :
										(newOrder >= w.OrderPin && oldOrder <= w.OrderPin))
										).ToList();

					int setOrder = isOldMoreThanNew ? newOrder : oldOrder; // เลขลำดับ
					foreach (trMarcomCMSWhatHappenSub item in lstChange)
					{
						item.OrderPin = isOldMoreThanNew ? ++setOrder : setOrder++;
					}
					data.OrderPin = newOrder;
					result = query;
				}
			}
		}
		catch (Exception ex)
		{
			throw ex;
		}

		return result;
	}

	public async Task<EventResult> GetAllEvent(string? filter, int? status, TableState state)
	{
		var current = DateTime.Now;
		List<trMarcomSpecialEvent> query = await GetAllQueryBuilderSpecialEvent(filter, status).OrderBy(o => o.Order).ToListAsync();
		List<trMarcomSpecialEvent> queryOrder = await GetAllQueryBuilderSpecialEvent(null, null).OrderBy(o => o.Order).ToListAsync();
		int max = queryOrder.Any() ? queryOrder.Max(m => m.Order) : 1;
		int total = query.Count;

		query = query.Skip(state.Skip).Take(state.Take).ToList();

		List<EventTable> lstTable = new List<EventTable>();

		query.ForEach(banner =>
		{

			List<CmsContent> lstcontent = new List<CmsContent>();

			lstTable.Add(new EventTable()
			{
				Id = banner.Id,
				Status = banner.IsActive ? "active" : "inactive",
				EventName = banner.EventName,
				IsHasEN = !banner.ImageURLEN.IsNullOrEmpty(),
				IsHasCN = !banner.ImageURLCN.IsNullOrEmpty(),
				IsHasTH = !banner.ImageURLTH.IsNullOrEmpty(),
				IsPublic = CheckPublic(banner.ShowTimeStartDate,banner.ShowTimeEndDate, current, banner.IsNotSpecify) && banner.IsActive,
				LastUpdate = ToUnixTime(banner.UpdatedDate),
				ShowDate = new ShowTime()
				{
					Start = ToUnixTime(banner.ShowTimeStartDate),
					End = banner.ShowTimeEndDate.HasValue ? ToUnixTime(banner.ShowTimeEndDate.Value) : null,
					IsAllTime = banner.IsNotSpecify
				},
				Content = new EventDetail()
				{
					ImageURL = banner.ImageURLEN,
					FileName = banner.FileNameEN,
					OriginalFileName = banner.OriginalFileNameEN,
				},
				ConfigOrder = new EventOrder()
				{
					Current = banner.Order,
					Max = max,
				}
			}); ;
		});

		int totalPage = (int)Math.Ceiling((double)total / state.Take);
		bool bShow = false;
		trMarcomConfig? objConfig = await Context.MarcomConfig.Where(w => w.Type == 2).AsTracking().FirstOrDefaultAsync();
		if (objConfig != null)
		{
			bShow = objConfig.ValueInt == 1;
		}

		EventResult result = new EventResult()
		{
			Data = lstTable,
			Pagination = new Features.Marcom.SpecialEvent.Query.GetAll.CmsMarcomPagination()
			{
				Total = total,
				Total_page = totalPage,
				Page_number = state.Page
			},
			Show = bShow
		};

		return result;
	}

	public async Task<GetEventResult> GetEventById(Guid id)
	{
		var query = await GetAllQueryBuilderSpecialEvent(null, null).ToListAsync();
		var objEvent = query.Find(w => w.Id == id);

		GetEventResult result = new GetEventResult();
		if (objEvent != null)
		{
			SpecialEventLang lang = new SpecialEventLang();

			lang.En = new SpecialEventDetail()
			{
				ImageURL = objEvent.ImageURLEN,
				FileName = objEvent.FileNameEN,
				OriginalFileName = objEvent.OriginalFileNameEN,
			};

			lang.Cn = new SpecialEventDetail()
			{
				ImageURL = objEvent.ImageURLCN,
				FileName = objEvent.FileNameCN,
				OriginalFileName = objEvent.OriginalFileNameCN,
			};

			lang.Th = new SpecialEventDetail()
			{
				ImageURL = objEvent.ImageURLTH,
				FileName = objEvent.FileNameTH,
				OriginalFileName = objEvent.OriginalFileNameTH,
			};

			SpecialEventModel data = new SpecialEventModel()
			{
				Id = objEvent.Id,
				IsDelete = objEvent.IsDelete,
				IsDontShowAgain = objEvent.IsShowDontShowAgain,
				EventName = objEvent.EventName,
				Order = objEvent.Order,
				Status = objEvent.IsActive,
				Start = ToUnixTime(objEvent.ShowTimeStartDate),
				End = objEvent.ShowTimeEndDate.HasValue ? ToUnixTime(objEvent.ShowTimeEndDate.Value) : null,
				Alltime = objEvent.IsNotSpecify,
				Detail = new SpecialEventLang()
				{
					En = lang.En,
					Cn = lang.Cn,
					Th = lang.Th,
				}
			};

			result.Data = data;
			result.StatusCode = StatusCodes.Status200OK;
		}
		else
		{
			result.StatusCode = StatusCodes.Status404NotFound;
		}

		return result;
	}

	public async Task<Guid> DeleteEvent(DeleteEvent data, AuditableModel auditable)
	{
		trMarcomSpecialEvent objEvent = new trMarcomSpecialEvent()
		{
			Order = 1,
			IsActive = true,
			IsDelete = false,
			EventName = "",
			FileNameEN = "",
			ImageURLEN = "",
			OriginalFileNameEN = "",
			IsNotSpecify = false,
			ShowTimeStartDate = DateTime.Now,
			IsShowDontShowAgain = false,
		};


		if (data.Id.HasValue)
		{
			trMarcomSpecialEvent? eventold = await Context.MarcomSpecialEvent.AsTracking().FirstOrDefaultAsync(w => w.Id == data.Id);
			if (eventold != null)
			{
				objEvent = eventold;
			}
			var lstEvent = await Context.MarcomSpecialEvent.AsTracking().Where(w => !w.IsDelete && w.Id != data.Id).OrderBy(o => o.Order).ToListAsync();
			if (lstEvent != null)
			{
				int nOrder = 1;
				foreach (var item in lstEvent)
				{
					item.Order = nOrder;
					nOrder++;

					await Context.SaveChangesAsync();
				}
			}
		}

		objEvent.IsDelete = true;
		objEvent.UpdatedBy = auditable.UpdatedBy;
		objEvent.UpdatedByName = auditable.UpdatedByName + "";
		objEvent.UpdatedDate = auditable.UpdatedDate;

		return objEvent.Id;
	}

	public async Task<Guid> UpdateEvent(EventDataModel data, AuditableModel auditable)
	{
		trMarcomSpecialEvent objEvent = new trMarcomSpecialEvent()
		{
			Order = 1,
			IsActive = true,
			IsDelete = false,
			EventName = "",
			FileNameEN = "",
			ImageURLEN = "",
			OriginalFileNameEN = "",
			IsNotSpecify = false,
			ShowTimeStartDate = DateTime.Now,
			IsShowDontShowAgain = false,
		};

		bool isnew = true;

		if (data.Id.HasValue)
		{
			trMarcomSpecialEvent? eventold = await Context.MarcomSpecialEvent.AsTracking().FirstOrDefaultAsync(w => w.Id == data.Id);
			if (eventold != null)
			{
				trMarcomSpecialEvent? existEvent = await Context.MarcomSpecialEvent.AsTracking().FirstOrDefaultAsync(w => !w.IsDelete && w.EventName.Trim().ToLower() == (data.EventName + "").Trim().ToLower() && data.Id.Value != w.Id);
				if (existEvent != null) throw new BadRequestException("Event name is duplicate in system");
				objEvent = eventold;
				isnew = false;
			}
		}

		objEvent.EventName = data.EventName;
		objEvent.IsActive = data.Status;
		objEvent.IsDelete = false;
		objEvent.ShowTimeStartDate = ToDateTime(data.Start, false);
		objEvent.ShowTimeEndDate = data.End.HasValue ? ToDateTime(data.End.Value, false) : null;
		objEvent.IsNotSpecify = data.Alltime;
		objEvent.IsShowDontShowAgain = data.IsDontShowAgain;

		objEvent.UpdatedBy = auditable.UpdatedBy;
		objEvent.UpdatedByName = auditable.UpdatedByName + "";
		objEvent.UpdatedDate = auditable.UpdatedDate;

		if (isnew)
		{
			trMarcomSpecialEvent? existBanner = await Context.MarcomSpecialEvent.AsTracking().FirstOrDefaultAsync(w => !w.IsDelete && w.EventName.Trim().ToLower() == (data.EventName + "").Trim().ToLower());
			if (existBanner != null) throw new BadRequestException("Event name is duplicate in system");
			objEvent.Id = Guid.NewGuid();
			objEvent.Order = (await Context.MarcomSpecialEvent.Where(w => !w.IsDelete).AnyAsync() ? await Context.MarcomSpecialEvent.Where(w => !w.IsDelete).MaxAsync(m => m.Order) : 0) + 1;

			objEvent.CreatedBy = auditable.CreatedBy;
			objEvent.CreatedByName = auditable.CreatedByName + "";
			objEvent.CreatedDate = auditable.CreatedDate;

			Context.MarcomSpecialEvent.Add(objEvent);
		}

		SpecialEventLang detail = data.Detail;


		//en
		objEvent.ImageURLEN = detail.En.ImageURL ?? "";
		objEvent.FileNameEN = detail.En.FileName + "";
		objEvent.OriginalFileNameEN = detail.En.OriginalFileName + "";

		if (!detail.Cn.ImageURL.IsNullOrEmpty())
		{
			//cn
			objEvent.ImageURLCN = detail.Cn.ImageURL ?? "";
			objEvent.FileNameCN = detail.Cn.FileName;
			objEvent.OriginalFileNameCN = detail.Cn.OriginalFileName;
		}
		else
		{
			objEvent.ImageURLCN = null;
			objEvent.FileNameCN = null;
			objEvent.OriginalFileNameCN = null;
		}

		if (!detail.Th.ImageURL.IsNullOrEmpty())
		{
			//th
			objEvent.ImageURLTH = detail.Th.ImageURL ?? "";
			objEvent.FileNameTH = detail.Th.FileName;
			objEvent.OriginalFileNameTH = detail.Th.OriginalFileName;
		}
		else
		{
			objEvent.ImageURLTH = null;
			objEvent.FileNameTH = null;
			objEvent.OriginalFileNameTH = null;
		}

		return objEvent.Id;
	}

	public async Task<Guid> UpdateExplore(ExploreDataModel data, AuditableModel auditable)
	{
		trMarcomCMSExplore explore = new trMarcomCMSExplore()
		{
			Order = 1,
			IsActive = true,
			IsDelete = false,
			IsShowRelatedLink = false,
			TitleEn = ""
		};

		bool isnew = true;

		if (data.Id.HasValue)
		{
			trMarcomCMSExplore? exploreold = await Context.MarcomCMSExplore.AsTracking().FirstOrDefaultAsync(w => w.Id == data.Id);
			if (exploreold != null)
			{
				trMarcomCMSExplore? existExplore = await Context.MarcomCMSExplore.AsTracking().FirstOrDefaultAsync(w => !w.IsDelete && w.TitleEn.Trim().ToLower() == (data.Detail.En.Title + "").Trim().ToLower() && data.Id.Value != w.Id);
				if (existExplore != null) throw new BadRequestException("Title name is duplicate in system");
				explore = exploreold;
				isnew = false;
			}
		}

		explore.IsActive = data.Status;
		explore.IsDelete = false;
		explore.IsShowRelatedLink = data.IsShowRelate;

		explore.UpdatedBy = auditable.UpdatedBy;
		explore.UpdatedByName = auditable.UpdatedByName + "";
		explore.UpdatedDate = auditable.UpdatedDate;

		if (isnew)
		{
			trMarcomCMSExplore? existBanner = await Context.MarcomCMSExplore.AsTracking().FirstOrDefaultAsync(w => !w.IsDelete && w.TitleEn.Trim().ToLower() == (data.Detail.En.Title + "").Trim().ToLower());
			if (existBanner != null) throw new BadRequestException("Title name is duplicate in system");
			explore.Id = Guid.NewGuid();
			explore.Order = (await Context.MarcomCMSExplore.Where(w => !w.IsDelete).AnyAsync() ? await Context.MarcomCMSExplore.Where(w => !w.IsDelete).MaxAsync(m => m.Order) : 0) + 1;

			explore.CreatedBy = auditable.CreatedBy;
			explore.CreatedByName = auditable.CreatedByName + "";
			explore.CreatedDate = auditable.CreatedDate;

			Context.MarcomCMSExplore.Add(explore);
		}

		ExploreLang detail = data.Detail;

		UpdateTag(explore.Id, data.Tag ?? new List<string>(), auditable);

		//en
		explore.TitleEn = detail.En.Title ?? "";
		explore.CoverImageURLEN = detail.En.ImageURL ?? "";
		explore.CoverFileNameEN = detail.En.FileName + "";
		explore.CoverOriginalFileNameEN = detail.En.OriginalFileName + "";
		explore.HeadFileNameEN = detail.En.HeaderFileName + "";
		explore.HeadImageURLEN = detail.En.HeaderImageURL + "";
		explore.HeadOriginalFileNameEN = detail.En.HeaderOriginalFileName + "";
		explore.TitleRelatedEN = detail.En.Related ?? "";
		explore.SubTitleRelatedEN = detail.En.RelatedSub ?? "";
		UpdateContentManagementContent(explore.Id, detail.En.CMS, "en", auditable);

		if (!detail.Cn.ImageURL.IsNullOrEmpty())
		{
			//cn
			explore.TitleCN = detail.Cn.Title ?? "";
			explore.CoverImageURLCN = detail.Cn.ImageURL ?? "";
			explore.CoverFileNameCN = detail.Cn.FileName;
			explore.CoverOriginalFileNameCN = detail.Cn.OriginalFileName;
			explore.HeadFileNameCN = detail.Cn.HeaderFileName;
			explore.HeadImageURLCN = detail.Cn.HeaderImageURL;
			explore.HeadOriginalFileNameCN = detail.Cn.HeaderOriginalFileName;
			explore.TitleRelatedCN = detail.Cn.Related ?? "";
			explore.SubTitleRelatedCN = detail.Cn.RelatedSub ?? "";
			UpdateContentManagementContent(explore.Id, detail.Cn.CMS, "zh", auditable);
		}
		else
		{
			explore.TitleCN = null;
			explore.CoverImageURLCN = null;
			explore.CoverFileNameCN = null;
			explore.CoverOriginalFileNameCN = null;
			explore.HeadFileNameCN = null;
			explore.HeadImageURLCN = null;
			explore.HeadOriginalFileNameCN = null;
			explore.TitleRelatedCN = null;
			explore.SubTitleRelatedCN = null;
			UpdateContentManagementContent(explore.Id, new List<CmsContent>(), "zh", auditable);
		}

		if (!detail.Th.ImageURL.IsNullOrEmpty())
		{
			//th
			explore.TitleTH = detail.Th.Title ?? "";
			explore.CoverImageURLTH = detail.Th.ImageURL ?? "";
			explore.CoverFileNameTH = detail.Th.FileName;
			explore.CoverOriginalFileNameTH = detail.Th.OriginalFileName;
			explore.HeadFileNameTH = detail.Th.HeaderFileName;
			explore.HeadImageURLTH = detail.Th.HeaderImageURL;
			explore.HeadOriginalFileNameTH = detail.Th.HeaderOriginalFileName;
			explore.TitleRelatedTH = detail.Th.Related ?? "";
			explore.SubTitleRelatedTH = detail.Th.RelatedSub ?? "";
			UpdateContentManagementContent(explore.Id, detail.Th.CMS, "th", auditable);
		}
		else
		{
			explore.TitleTH = null;
			explore.CoverImageURLTH = null;
			explore.CoverFileNameTH = null;
			explore.CoverOriginalFileNameTH = null;
			explore.HeadFileNameTH = null;
			explore.HeadImageURLTH = null;
			explore.HeadOriginalFileNameTH = null;
			explore.TitleRelatedTH = null;
			explore.SubTitleRelatedTH = null;
			UpdateContentManagementContent(explore.Id, new List<CmsContent>(), "th", auditable);
		}

		return explore.Id;
	}

	public async Task<ExploreResult> GetAllExplore(string? filter, int? status, TableState state)
	{
		List<trMarcomCMSExplore> query = await GetAllQueryBuilderExplore(filter, status).OrderBy(o => o.Order).ToListAsync();
		List<trMarcomCMSExplore> queryOrder = await GetAllQueryBuilderExplore(null, null).OrderBy(o => o.Order).ToListAsync();
		List<trMarcomCMSTag> querytag = await GetAllQueryBuilderTag().ToListAsync();
		int max = queryOrder.Any() ? queryOrder.Max(m => m.Order) : 1;

		List<trMarcomCMSExploreContent> querycontent = await GetAllQueryBuilderCMSContent().Where(w => w.Language == "en").ToListAsync();
		int total = query.Count;

		query = query.Skip(state.Skip).Take(state.Take).ToList();

		List<ExploreTable> lstTable = new List<ExploreTable>();

		query.ForEach(explore =>
		{

			List<CmsContent> lstcontent = new List<CmsContent>();
			List<string> lstTag = querytag.Where(w => w.ContentId == explore.Id).Select(s => s.TagName).ToList();

			querycontent.Where(w => w.ContentId == explore.Id).OrderBy(o => o.Order).ToList().ForEach(item =>
			{
				lstcontent.Add(new CmsContent()
				{
					Id = item.Id,
					MenuId = item.ContentId,
					Language = item.Language,
					ContentType = item.ContentType,
					Order = item.Order,
					Text = item.Text,
					ImageURL = item.ImageURL,
					OriginalFileName = item.OriginalFileName,
					YoutubeURL = item.YoutubeURL,
					IsActive = item.IsActive,
					IsDelete = item.IsDelete,
				});
			});

			lstTable.Add(new ExploreTable()
			{
				Id = explore.Id,
				Status = explore.IsActive ? "active" : "inactive",
				Title = explore.TitleEn,
				IsHasEN = !explore.CoverImageURLEN.IsNullOrEmpty(),
				IsHasCN = !explore.CoverImageURLCN.IsNullOrEmpty(),
				IsHasTH = !explore.CoverImageURLTH.IsNullOrEmpty(),
				LastUpdate = ToUnixTime(explore.UpdatedDate),
				Content = new MarcomBannerManagementDetail()
				{
					Title = explore.TitleEn,
					ImageURL = explore.CoverImageURLEN,
					FileName = explore.CoverFileNameEN,
					OriginalFileName = explore.CoverOriginalFileNameEN,
					HeaderImageURL = explore.HeadImageURLEN,
					HeaderFileName = explore.HeadFileNameEN,
					HeaderOriginalFileName = explore.HeadOriginalFileNameEN,
					CMS = lstcontent,
					Tag = lstTag
				},
				ConfigOrder = new ExploreOrder()
				{
					Current = explore.Order,
					Max = max,
				}

			});
		});

		int totalPage = (int)Math.Ceiling((double)total / state.Take);

		ExploreResult result = new ExploreResult()
		{
			Data = lstTable,
			Pagination = new ExplorePagination()
			{
				Total = total,
				Total_page = totalPage,
				Page_number = state.Page
			},
		};

		return result;
	}

	public async Task<GetExploreResult> GetExploreById(Guid id)
	{
		var query = await GetAllQueryBuilderExplore(null, null).ToListAsync();
		var explore = query.Find(w => w.Id == id);

		GetExploreResult result = new GetExploreResult();
		if (explore != null)
		{
			ExploreLang lang = new ExploreLang();
			List<trMarcomCMSExploreContent> querycontent = await GetAllQueryBuilderCMSContent().Where(w => w.ContentId == explore.Id).ToListAsync();
			List<trMarcomCMSTag> querytag = await GetAllQueryBuilderTag().Where(w => w.ContentId == explore.Id).ToListAsync();
			List<string> lstTag = querytag.Select(s => s.TagName).ToList();

			List<CmsContent> lstcontent = new List<CmsContent>();

			querycontent.ForEach(item =>
			{
				lstcontent.Add(new CmsContent()
				{
					Id = item.Id,
					MenuId = item.ContentId,
					Language = item.Language,
					ContentType = item.ContentType,
					Order = item.Order,
					Text = item.Text,
					ImageURL = item.ImageURL,
					OriginalFileName = item.OriginalFileName,
					YoutubeURL = item.YoutubeURL,
					IsActive = item.IsActive,
					IsDelete = item.IsDelete
				});
			});

			lang.En = new ExploreDetail()
			{
				Title = explore.TitleEn,
				ImageURL = explore.CoverImageURLEN,
				FileName = explore.CoverFileNameEN,
				OriginalFileName = explore.CoverOriginalFileNameEN,
				HeaderImageURL = explore.HeadImageURLEN,
				HeaderFileName = explore.HeadFileNameEN,
				HeaderOriginalFileName = explore.HeadOriginalFileNameEN,
				Related = explore.TitleRelatedEN,
				RelatedSub = explore.SubTitleRelatedEN,
				CMS = lstcontent.Where(w => w.Language == "en").OrderBy(o => o.Order).ToList()
			};

			lang.Cn = new ExploreDetail()
			{
				Title = explore.TitleCN,
				ImageURL = explore.CoverImageURLCN,
				FileName = explore.CoverFileNameCN,
				OriginalFileName = explore.CoverOriginalFileNameCN,
				HeaderImageURL = explore.HeadImageURLCN,
				HeaderFileName = explore.HeadFileNameCN,
				HeaderOriginalFileName = explore.HeadOriginalFileNameCN,
				Related = explore.TitleRelatedCN,
				RelatedSub = explore.SubTitleRelatedCN,
				CMS = lstcontent.Where(w => w.Language == "zh").OrderBy(o => o.Order).ToList()
			};

			lang.Th = new ExploreDetail()
			{
				Title = explore.TitleTH,
				ImageURL = explore.CoverImageURLTH,
				FileName = explore.CoverFileNameTH,
				OriginalFileName = explore.CoverOriginalFileNameTH,
				HeaderImageURL = explore.HeadImageURLTH,
				HeaderFileName = explore.HeadFileNameTH,
				HeaderOriginalFileName = explore.HeadOriginalFileNameTH,
				Related = explore.TitleRelatedTH,
				RelatedSub = explore.SubTitleRelatedTH,
				CMS = lstcontent.Where(w => w.Language == "th").OrderBy(o => o.Order).ToList()
			};

			ExploreModel data = new ExploreModel()
			{
				Id = explore.Id,
				IsDelete = explore.IsDelete,
				IsShowRelate = explore.IsShowRelatedLink,
				Order = explore.Order,
				Status = explore.IsActive,
				Tag = lstTag,
				Detail = new ExploreLang()
				{
					En = lang.En,
					Cn = lang.Cn,
					Th = lang.Th,
				}
			};

			result.Data = data;
			result.StatusCode = StatusCodes.Status200OK;
		}
		else
		{
			result.StatusCode = StatusCodes.Status404NotFound;
		}

		return result;
	}

	public async Task<Guid> DeleteExplore(DeleteEvent data, AuditableModel auditable)
	{
		trMarcomCMSExplore objEvent = new trMarcomCMSExplore()
		{
			Order = 1,
			IsActive = true,
			IsDelete = false,
			IsShowRelatedLink = false,
			TitleEn = ""
		};


		if (data.Id.HasValue)
		{
			trMarcomCMSExplore? eventold = await Context.MarcomCMSExplore.AsTracking().FirstOrDefaultAsync(w => w.Id == data.Id);
			if (eventold != null)
			{
				objEvent = eventold;
			}
			var lstEvent = await Context.MarcomCMSExplore.AsTracking().Where(w => !w.IsDelete && w.Id != data.Id).OrderBy(o => o.Order).ToListAsync();
			if (lstEvent != null)
			{
				int nOrder = 1;
				foreach (var item in lstEvent)
				{
					item.Order = nOrder;
					nOrder++;

					await Context.SaveChangesAsync();
				}
			}
		}

		objEvent.IsDelete = true;
		objEvent.UpdatedBy = auditable.UpdatedBy;
		objEvent.UpdatedByName = auditable.UpdatedByName + "";
		objEvent.UpdatedDate = auditable.UpdatedDate;

		return objEvent.Id;
	}

	public async Task<Guid> UpdateHappening(HappeningDataModel data, AuditableModel auditable)
	{
		if (data.IsCategory)
		{
			trMarcomCMSWhatHappenCategory category = new trMarcomCMSWhatHappenCategory()
			{
				Order = 1,
				IsActive = true,
				IsDelete = false,
				IsArtAndCulture = false,
				SystemType = 0,
				CategoryNameEn = ""
			};
			bool isnewcate = true;
			if (data.Id.HasValue)
			{
				trMarcomCMSWhatHappenCategory? categoryold = await Context.MarcomCMSWhatHappenCategory.AsTracking().FirstOrDefaultAsync(w => w.Id == data.Id);
				if (categoryold != null)
				{
					trMarcomCMSWhatHappenCategory? existCategory = await Context.MarcomCMSWhatHappenCategory.AsTracking().FirstOrDefaultAsync(w => !w.IsDelete && w.CategoryNameEn.Trim().ToLower() == (data.Detail.En.Title + "").Trim().ToLower() && data.Id.Value != w.Id);
					if (existCategory != null) throw new BadRequestException("Category name is duplicate in system");
					category = categoryold;
					isnewcate = false;
				}
			}

			category.IsActive = data.Status;

			// Set Children to Inactive if Parent is Inactive
			if (!isnewcate && !data.Status)
			{
				var lstSub = await Context.MarcomCMSWhatHappenSub.AsTracking().Where(w => w.CategoryId == category.Id).ToListAsync();				
				foreach (var item in lstSub)
				{
					item.IsActive = false;
				}
				await Context.SaveChangesAsync();
			}

			category.IsDelete = false;
			category.IsArtAndCulture = data.IsArtC;
			category.SystemType = data.SystemType;

			category.UpdatedBy = auditable.UpdatedBy;
			category.UpdatedByName = auditable.UpdatedByName + "";
			category.UpdatedDate = auditable.UpdatedDate;

			if (isnewcate)
			{
				trMarcomCMSWhatHappenCategory? existCategory = await Context.MarcomCMSWhatHappenCategory.AsTracking().FirstOrDefaultAsync(w => !w.IsDelete && w.CategoryNameEn.Trim().ToLower() == (data.Detail.En.Title + "").Trim().ToLower());
				if (existCategory != null) throw new BadRequestException("Category name is duplicate in system");
				category.Id = Guid.NewGuid();
				category.Order = (await Context.MarcomCMSWhatHappenCategory.Where(w => !w.IsDelete).AnyAsync() ? await Context.MarcomCMSWhatHappenCategory.Where(w => !w.IsDelete).MaxAsync(m => m.Order) : 0) + 1;

				category.CreatedBy = auditable.CreatedBy;
				category.CreatedByName = auditable.CreatedByName + "";
				category.CreatedDate = auditable.CreatedDate;

				Context.MarcomCMSWhatHappenCategory.Add(category);
			}

			HappeningLang detailcate = data.Detail;

			category.CategoryNameEn = detailcate.En.Title ?? "";
			category.IntroduceEN = detailcate.En.Introduce ?? "";

			if (!detailcate.Cn.Title.IsNullOrEmpty())
			{
				//cn
				category.CategoryNameCN = detailcate.Cn.Title ?? "";
				category.IntroduceCN = detailcate.Cn.Introduce ?? "";
			}
			else
			{
				category.CategoryNameCN = null;
				category.IntroduceCN = null;
			}

			if (!detailcate.Th.Title.IsNullOrEmpty())
			{
				//th
				category.CategoryNameTH = detailcate.Th.Title ?? "";
				category.IntroduceTH = detailcate.Th.Introduce ?? "";
			}
			else
			{
				category.CategoryNameTH = null;
				category.IntroduceTH = null;
			}
			return category.Id;
		}
		else
		{
			trMarcomCMSWhatHappenSub subcontent = new trMarcomCMSWhatHappenSub()
			{
				Order = 1,
				IsActive = true,
				IsDelete = false,
				IsShowRelatedLink = false,
				TitleEn = "",
				CategoryId = data.Parent ?? Guid.NewGuid(),
				IsPin = false,
				IsNotSpecify = false,
				ShowTimeStartDate = DateTime.Now,
			};
			bool isnewcontent = true;
			if (data.Id.HasValue)
			{
				trMarcomCMSWhatHappenSub? subcontentold = await Context.MarcomCMSWhatHappenSub.AsTracking().FirstOrDefaultAsync(w => w.Id == data.Id);
				if (subcontentold != null)
				{
					trMarcomCMSWhatHappenSub? existContent = await Context.MarcomCMSWhatHappenSub.AsTracking().FirstOrDefaultAsync(w => !w.IsDelete && w.TitleEn.Trim().ToLower() == (data.Detail.En.Title + "").Trim().ToLower() && data.Id.Value != w.Id);
					if (existContent != null) throw new BadRequestException("Title name is duplicate in system");
					subcontent = subcontentold;
					isnewcontent = false;
					if(!subcontent.IsPin && data.IsPin)
					{
						subcontent.OrderPin = (await Context.MarcomCMSWhatHappenSub.Where(w => !w.IsDelete && w.IsPin).AnyAsync() ? await Context.MarcomCMSWhatHappenSub.Where(w => !w.IsDelete && w.IsPin).MaxAsync(m => m.OrderPin) : 0) + 1;
					}else if (subcontent.IsPin && !data.IsPin)
					{
						subcontent.OrderPin = null;
						var lstContentSub = await Context.MarcomCMSWhatHappenSub.AsTracking().Where(w => !w.IsDelete && w.Id != data.Id && w.IsPin).OrderBy(o => o.OrderPin).ToListAsync();
						if (lstContentSub != null)
						{
							int nOrder = 1;
							foreach (var item in lstContentSub)
							{
								item.OrderPin = nOrder;
								nOrder++;

								await Context.SaveChangesAsync();
							}
						}
					}
				}
			}

			if (data.Parent.HasValue && data.Parent.Value != subcontent.CategoryId)
			{
				////change parent
				int maxOrder = 0;
				if (await Context.MarcomCMSWhatHappenSub.AnyAsync())
				{
					maxOrder = await Context.MarcomCMSWhatHappenSub
							.Where(w => w.CategoryId == data.Parent.Value && !w.IsDelete)
							.MaxAsync(m => (int?)m.Order) ?? 0;
				}
				subcontent.Order = maxOrder + 1;
				var lstSub = await Context.MarcomCMSWhatHappenSub.AsTracking().Where(w => w.CategoryId == subcontent.CategoryId && !w.IsDelete && w.Id != data.Id).OrderBy(o => o.Order).ToListAsync();
				if (lstSub != null)
				{
					int nOrder = 1;
					foreach (var item in lstSub)
					{
						item.Order = nOrder;
						nOrder++;

						await Context.SaveChangesAsync();
					}
				}
			}
			subcontent.IsPin = data.IsPin;
			subcontent.IsActive = data.Status;
			subcontent.IsDelete = false;
			subcontent.IsShowRelatedLink = data.IsShowRelate;
			subcontent.CategoryId = data.Parent ?? Guid.NewGuid();
			subcontent.DetailLink = data.LinkToURL;
			subcontent.TypeLink = data.Type;
			subcontent.ShowTimeStartDate = data.Start.HasValue ? ToDateTime(data.Start.Value, false) : DateTime.Now;
			subcontent.ShowTimeEndDate = data.End.HasValue ? ToDateTime(data.End.Value, false) : null;
			subcontent.IsNotSpecify = data.Alltime;
			subcontent.EventTimeStartDate = data.StartEvent.HasValue ? ToDateTime(data.StartEvent.Value, true) : null;
			subcontent.EventTimeEndDate = data.EndEvent.HasValue ? ToDateTime(data.EndEvent.Value, true) : null;
			subcontent.ArtAndCultureInternalLinkType = data.ArtType;

			subcontent.UpdatedBy = auditable.UpdatedBy;
			subcontent.UpdatedByName = auditable.UpdatedByName + "";
			subcontent.UpdatedDate = auditable.UpdatedDate;

			if (isnewcontent)
			{
				trMarcomCMSWhatHappenSub? existContent = await Context.MarcomCMSWhatHappenSub.AsTracking().FirstOrDefaultAsync(w => !w.IsDelete && w.TitleEn.Trim().ToLower() == (data.Detail.En.Title + "").Trim().ToLower());
				if (existContent != null) throw new BadRequestException("Title name is duplicate in system");
				subcontent.Id = Guid.NewGuid();
				subcontent.OrderPin = (await Context.MarcomCMSWhatHappenSub.Where(w => !w.IsDelete && w.IsPin).AnyAsync() ? await Context.MarcomCMSWhatHappenSub.Where(w => !w.IsDelete && w.IsPin).MaxAsync(m => m.OrderPin) : 0) + 1;
				subcontent.Order = (await Context.MarcomCMSWhatHappenSub.Where(w => !w.IsDelete && w.CategoryId == subcontent.CategoryId).AnyAsync() ? await Context.MarcomCMSWhatHappenSub.Where(w => !w.IsDelete && w.CategoryId == subcontent.CategoryId).MaxAsync(m => m.Order) : 0) + 1;

				subcontent.CreatedBy = auditable.CreatedBy;
				subcontent.CreatedByName = auditable.CreatedByName + "";
				subcontent.CreatedDate = auditable.CreatedDate;

				Context.MarcomCMSWhatHappenSub.Add(subcontent);
			}
			HappeningLang detailcontent = data.Detail;

			UpdateTag(subcontent.Id, data.Tag ?? new List<string>(), auditable);

			subcontent.TitleEn = detailcontent.En.Title ?? "";
			subcontent.IntroduceEN = detailcontent.En.Introduce ?? "";
			subcontent.LocationEN = detailcontent.En.Location ?? "";
			subcontent.TextImageEN = detailcontent.En.Text ?? "";
			subcontent.TitleRelatedEN = detailcontent.En.Related ?? "";
			subcontent.SubTitleRelatedEN = detailcontent.En.RelatedSub ?? "";
			subcontent.CoverImageURLEN = detailcontent.En.ImageURL ?? "";
			subcontent.CoverFileNameEN = detailcontent.En.FileName + "";
			subcontent.CoverOriginalFileNameEN = detailcontent.En.OriginalFileName + "";
			subcontent.HeadFileNameEN = detailcontent.En.HeaderFileName + "";
			subcontent.HeadImageURLEN = detailcontent.En.HeaderImageURL + "";
			subcontent.HeadOriginalFileNameEN = detailcontent.En.HeaderOriginalFileName + "";
			UpdateHappeningContent(subcontent.Id, detailcontent.En.CMS, "en", auditable);

			if (!detailcontent.Cn.ImageURL.IsNullOrEmpty())
			{
				//cn
				subcontent.TitleCN = detailcontent.Cn.Title ?? "";
				subcontent.IntroduceCN = detailcontent.Cn.Introduce ?? "";
				subcontent.LocationCN = detailcontent.Cn.Location ?? "";
				subcontent.TextImageCN = detailcontent.Cn.Text ?? "";
				subcontent.TitleRelatedCN = detailcontent.Cn.Related ?? "";
				subcontent.SubTitleRelatedCN = detailcontent.Cn.RelatedSub ?? "";
				subcontent.CoverImageURLCN = detailcontent.Cn.ImageURL ?? "";
				subcontent.CoverFileNameCN = detailcontent.Cn.FileName;
				subcontent.CoverOriginalFileNameCN = detailcontent.Cn.OriginalFileName;
				subcontent.HeadFileNameCN = detailcontent.Cn.HeaderFileName;
				subcontent.HeadImageURLCN = detailcontent.Cn.HeaderImageURL;
				subcontent.HeadOriginalFileNameCN = detailcontent.Cn.HeaderOriginalFileName;
				UpdateHappeningContent(subcontent.Id, detailcontent.Cn.CMS, "zh", auditable);
			}
			else
			{
				subcontent.TitleCN = null;
				subcontent.IntroduceCN = null;
				subcontent.LocationCN = null;
				subcontent.TextImageCN = null;
				subcontent.TitleRelatedCN = null;
				subcontent.SubTitleRelatedCN = null;
				subcontent.CoverImageURLCN = null;
				subcontent.CoverFileNameCN = null;
				subcontent.CoverOriginalFileNameCN = null;
				subcontent.HeadFileNameCN = null;
				subcontent.HeadImageURLCN = null;
				subcontent.HeadOriginalFileNameCN = null;
				UpdateHappeningContent(subcontent.Id, new List<CmsContent>(), "zh", auditable);
			}

			if (!detailcontent.Th.ImageURL.IsNullOrEmpty())
			{
				//th
				subcontent.TitleTH = detailcontent.Th.Title ?? "";
				subcontent.IntroduceTH = detailcontent.Th.Introduce ?? "";
				subcontent.LocationTH = detailcontent.Th.Location ?? "";
				subcontent.TextImageTH = detailcontent.Th.Text ?? "";
				subcontent.TitleRelatedTH = detailcontent.Th.Related ?? "";
				subcontent.SubTitleRelatedTH = detailcontent.Th.RelatedSub ?? "";
				subcontent.CoverImageURLTH = detailcontent.Th.ImageURL ?? "";
				subcontent.CoverFileNameTH = detailcontent.Th.FileName;
				subcontent.CoverOriginalFileNameTH = detailcontent.Th.OriginalFileName;
				subcontent.HeadFileNameTH = detailcontent.Th.HeaderFileName;
				subcontent.HeadImageURLTH = detailcontent.Th.HeaderImageURL;
				subcontent.HeadOriginalFileNameTH = detailcontent.Th.HeaderOriginalFileName;
				UpdateHappeningContent(subcontent.Id, detailcontent.Th.CMS, "th", auditable);
			}
			else
			{
				subcontent.TitleTH = null;
				subcontent.IntroduceTH = null;
				subcontent.LocationTH = null;
				subcontent.TextImageTH = null;
				subcontent.TitleRelatedTH = null;
				subcontent.SubTitleRelatedTH = null;
				subcontent.CoverImageURLTH = null;
				subcontent.CoverFileNameTH = null;
				subcontent.CoverOriginalFileNameTH = null;
				subcontent.HeadFileNameTH = null;
				subcontent.HeadImageURLTH = null;
				subcontent.HeadOriginalFileNameTH = null;
				UpdateHappeningContent(subcontent.Id, new List<CmsContent>(), "th", auditable);
			}

			return subcontent.Id;
		}
	}

	public async Task<CategoryResult> GetAllCategory(string? filter, int? status, TableState state)
	{
		List<trMarcomCMSWhatHappenCategory> query = await GetAllQueryBuilderCategory(filter, status).OrderBy(o => o.Order).ToListAsync();
		List<trMarcomCMSWhatHappenCategory> queryOrder = await GetAllQueryBuilderCategory(null, null).OrderBy(o => o.Order).ToListAsync();
		int max = queryOrder.Any() ? queryOrder.Max(m => m.Order) : 1;
		int total = query.Count;

		query = query.Skip(state.Skip).Take(state.Take).ToList();

		List<CategoryTable> lstTable = new List<CategoryTable>();

		query.ForEach(category =>
		{

			lstTable.Add(new CategoryTable()
			{
				Id = category.Id,
				Status = category.IsActive ? "active" : "inactive",
				CategoryName = category.CategoryNameEn,
				IsHasEN = !category.CategoryNameEn.IsNullOrEmpty(),
				IsHasCN = !category.CategoryNameCN.IsNullOrEmpty(),
				IsHasTH = !category.CategoryNameTH.IsNullOrEmpty(),
				LastUpdate = ToUnixTime(category.UpdatedDate),
				ConfigOrder = new CategoryOrder()
				{
					Current = category.Order,
					Max = max,
				}
			}); ;
		});

		int totalPage = (int)Math.Ceiling((double)total / state.Take);

		CategoryResult result = new CategoryResult()
		{
			Data = lstTable,
			Pagination = new CategoryPagination()
			{
				Total = total,
				Total_page = totalPage,
				Page_number = state.Page
			},
		};

		return result;
	}

	public async Task<GetHappeningResult> GetHappeningById(Guid id)
	{
		var query = await GetAllQueryBuilderCategory(null, null).ToListAsync();
		var querycontent = await GetAllQueryBuilderSubContent(null, null).ToListAsync();
		var category = query.Find(w => w.Id == id);
		var content = querycontent.Find(w => w.Id == id);

		GetHappeningResult result = new GetHappeningResult();
		if (category != null)
		{
			HappeningLang lang = new HappeningLang();

			lang.En = new HappeningDetail()
			{
				Title = category.CategoryNameEn,
				Introduce = category.IntroduceEN,
			};

			lang.Cn = new HappeningDetail()
			{
				Title = category.CategoryNameCN,
				Introduce = category.IntroduceCN,
			};

			lang.Th = new HappeningDetail()
			{
				Title = category.CategoryNameTH,
				Introduce = category.IntroduceTH,
			};

			HappeningModel data = new HappeningModel()
			{
				Id = category.Id,
				IsDelete = category.IsDelete,
				IsShowRelate = false,
				Order = category.Order,
				Status = category.IsActive,
				IsArtC = category.IsArtAndCulture,
				SystemType = category.SystemType,
				IsCategory = true,
				IsHasSub = querycontent.Any(a => a.CategoryId == category.Id),
				Detail = new HappeningLang()
				{
					En = lang.En,
					Cn = lang.Cn,
					Th = lang.Th,
				}
			};

			result.Data = data;
			result.StatusCode = StatusCodes.Status200OK;
		}
		else if(content != null)
		{
			HappeningLang lang = new HappeningLang();

			List<trMarcomCMSWhatHappenContent> querysubcontent = await GetAllQueryBuilderHappeningContent().Where(w => w.SubContentId == content.Id).ToListAsync();
			List<trMarcomCMSTag> querytag = await GetAllQueryBuilderTag().Where(w => w.ContentId == content.Id).ToListAsync();
			List<string> lstTag = querytag.Select(s => s.TagName).ToList();

			List<CmsContent> lstcontent = new List<CmsContent>();

			querysubcontent.ForEach(item =>
			{
				lstcontent.Add(new CmsContent()
				{
					Id = item.Id,
					MenuId = item.SubContentId,
					Language = item.Language,
					ContentType = item.ContentType,
					Order = item.Order,
					Text = item.Text,
					ImageURL = item.ImageURL,
					OriginalFileName = item.OriginalFileName,
					YoutubeURL = item.YoutubeURL,
					IsActive = item.IsActive,
					IsDelete = item.IsDelete
				});
			});

			lang.En = new HappeningDetail()
			{
				Title = content.TitleEn,
				Introduce = content.IntroduceEN,
				Location = content.LocationEN,
				Related = content.TitleRelatedEN,
				RelatedSub = content.SubTitleRelatedEN,
				ImageURL = content.CoverImageURLEN,
				FileName = content.CoverFileNameEN,
				OriginalFileName = content.CoverOriginalFileNameEN,
				HeaderImageURL = content.HeadImageURLEN,
				HeaderFileName = content.HeadFileNameEN,
				HeaderOriginalFileName = content.HeadOriginalFileNameEN,
				Text = content.TextImageEN,
				CMS = lstcontent.Where(w => w.Language == "en").OrderBy(o => o.Order).ToList()
			};

			lang.Cn = new HappeningDetail()
			{
				Title = content.TitleCN,
				Introduce = content.IntroduceCN,
				Location = content.LocationCN,
				Related = content.TitleRelatedCN,
				RelatedSub = content.SubTitleRelatedCN,
				ImageURL = content.CoverImageURLCN,
				FileName = content.CoverFileNameCN,
				OriginalFileName = content.CoverOriginalFileNameCN,
				HeaderImageURL = content.HeadImageURLCN,
				HeaderFileName = content.HeadFileNameCN,
				HeaderOriginalFileName = content.HeadOriginalFileNameCN,
				Text = content.TextImageCN,
				CMS = lstcontent.Where(w => w.Language == "zh").OrderBy(o => o.Order).ToList()
			};

			lang.Th = new HappeningDetail()
			{
				Title = content.TitleTH,
				Introduce = content.IntroduceTH,
				Location = content.LocationTH,
				Related = content.TitleRelatedTH,
				RelatedSub = content.SubTitleRelatedTH,
				ImageURL = content.CoverImageURLTH,
				FileName = content.CoverFileNameTH,
				OriginalFileName = content.CoverOriginalFileNameTH,
				HeaderImageURL = content.HeadImageURLTH,
				HeaderFileName = content.HeadFileNameTH,
				HeaderOriginalFileName = content.HeadOriginalFileNameTH,
				Text = content.TextImageTH,
				CMS = lstcontent.Where(w => w.Language == "th").OrderBy(o => o.Order).ToList()
			};

			HappeningModel data = new HappeningModel()
			{
				Id = content.Id,
				IsDelete = content.IsDelete,
				IsShowRelate = content.IsShowRelatedLink,
				IsPin = content.IsPin,
				Order = content.Order,
				Parent = content.CategoryId,
				Status = content.IsActive,
				IsArtC = query.Find(w => w.Id == content.CategoryId) != null ? query.First(w => w.Id == content.CategoryId).SystemType != 0 : false,
				IsCategory = false,
				IsHasSub = false,
				ArtType = content.ArtAndCultureInternalLinkType ?? 1,
				Start = ToUnixTime(content.ShowTimeStartDate),
				End = content.ShowTimeEndDate.HasValue ? ToUnixTime(content.ShowTimeEndDate.Value) : null,
				Alltime = content.IsNotSpecify,
				StartEvent = content.EventTimeStartDate.HasValue ? ToUnixTime(content.EventTimeStartDate.Value) : null,
				EndEvent = content.EventTimeEndDate.HasValue ? ToUnixTime(content.EventTimeEndDate.Value) : null,
				Type = content.TypeLink,
				LinkToURL = content.DetailLink,
				Tag = lstTag,
				Detail = new HappeningLang()
				{
					En = lang.En,
					Cn = lang.Cn,
					Th = lang.Th,
				}
			};

			result.Data = data;
			result.StatusCode = StatusCodes.Status200OK;
		}

		return result;
	}

	public async Task<ContentResult> GetAllContent(string? filter, int? status, Guid? parentID,bool? isPin, TableState state)
	{
		List<trMarcomCMSWhatHappenSub> query = await GetAllQueryBuilderSubContent(filter, status).ToListAsync();
		List<trMarcomCMSWhatHappenSub> queryOrder = await GetAllQueryBuilderSubContent(null, null).ToListAsync();
		List<trMarcomCMSWhatHappenCategory> queryCategory = await GetAllQueryBuilderCategory(null, null).ToListAsync();
		List<trMarcomCMSTag> querytag = await GetAllQueryBuilderTag().ToListAsync();
		int max = 1;

		if (parentID.HasValue)
		{
			query = query.Where(w => w.CategoryId == parentID.Value).OrderBy(o => o.Order).ToList();
			queryOrder = queryOrder.Where(w => w.CategoryId == parentID.Value).OrderBy(o => o.Order).ToList();
			max = queryOrder.Any() ? queryOrder.Max(m => m.Order) : 1;
		}

		if(isPin == true)
		{
			query = query.Where(w => w.IsPin).OrderBy(o => o.OrderPin).ToList();
			queryOrder = queryOrder.Where(w => w.IsPin).OrderBy(o => o.OrderPin).ToList();
			max = queryOrder.Any() ? queryOrder.Max(m => m.OrderPin ?? 0) : 1;
		}


		List<trMarcomCMSWhatHappenContent> querycontent = await GetAllQueryBuilderHappeningContent().Where(w => w.Language == "en").ToListAsync();
		int total = query.Count;

		query = query.Skip(state.Skip).Take(state.Take).ToList();

		List<ContentTable> lstTable = new List<ContentTable>();

		query.ForEach(cms =>
		{
			List<CmsContent> lstcontent = new List<CmsContent>();
			List<trMarcomCMSTag> tagcontent = querytag.Where(w => w.ContentId == cms.Id).ToList();
			List<string> lstTag = tagcontent.Select(s => s.TagName).ToList();

			querycontent.Where(w => w.SubContentId == cms.Id).OrderBy(o => o.Order).ToList().ForEach(item =>
			{
				lstcontent.Add(new CmsContent()
				{
					Id = item.Id,
					MenuId = item.SubContentId,
					Language = item.Language,
					ContentType = item.ContentType,
					Order = item.Order,
					Text = item.Text,
					ImageURL = item.ImageURL,
					OriginalFileName = item.OriginalFileName,
					YoutubeURL = item.YoutubeURL,
					IsActive = item.IsActive,
					IsDelete = item.IsDelete
				});
			});

			lstTable.Add(new ContentTable()
			{
				Id = cms.Id,
				Status = cms.IsActive ? "active" : "inactive",
				Title = cms.TitleEn,
				Category = queryCategory.First(f => f.Id == cms.CategoryId).CategoryNameEn,
				IsPin = cms.IsPin,
				IsHasEN = !cms.CoverImageURLEN.IsNullOrEmpty(),
				IsHasCN = !cms.CoverImageURLCN.IsNullOrEmpty(),
				IsHasTH = !cms.CoverImageURLTH.IsNullOrEmpty(),
				LastUpdate = ToUnixTime(cms.UpdatedDate),
				Content = new ContentManagementDetail()
				{
					Menu = queryCategory.First(f => f.Id == cms.CategoryId).CategoryNameEn,
					Introduce = cms.IntroduceEN,
					TitleRelated = cms.TitleRelatedEN,
					CoverImageURL = cms.CoverImageURLEN,
					CoverFileName = cms.CoverFileNameEN,
					CoverOriginalFileName = cms.CoverOriginalFileNameEN,
					HeadImageURL = cms.HeadImageURLEN,
					HeadFileName = cms.HeadFileNameEN,
					HeadOriginalFileName = cms.HeadOriginalFileNameEN,
					CMS = lstcontent,
					Tag = lstTag,
					Text = cms.TextImageEN
				},
				ConfigOrder = new ContentOrder()
				{
					Current = isPin == true ?  cms.OrderPin : cms.Order,
					Max = max,
				}

			});
		});

		int totalPage = (int)Math.Ceiling((double)total / state.Take);
		string categoryName = "";
		if (parentID.HasValue)
		{
			trMarcomCMSWhatHappenCategory? objCategory = await Context.MarcomCMSWhatHappenCategory.Where(w => w.Id == parentID.Value).AsTracking().FirstOrDefaultAsync();
			if(objCategory != null)
			{
				categoryName = objCategory.CategoryNameEn;
			}
		}

		ContentResult result = new ContentResult()
		{
			Data = lstTable,
			Pagination = new DigitalPagination()
			{
				Total = total,
				Total_page = totalPage,
				Page_number = state.Page
			},
			CategoryName = categoryName
		};

		return result;
	}

	public async Task<CategoryListResult> GetCategory(Guid? id)
	{
		List<Features.Marcom.Happening.Query.GetHappening.OptionSelection> lstCategory= await GetAllQueryBuilderCategory(null, null).Where(w => !w.IsDelete && (w.IsActive || w.Id == id)).OrderBy(o => o.Order).Select(s => new Features.Marcom.Happening.Query.GetHappening.OptionSelection
		{
			Value = s.Id.ToString(),
			Name = s.CategoryNameEn,
			IsArtC = s.SystemType != 0,
			IsSelectMenu = s.SystemType == 1
		}).ToListAsync();

		CategoryListResult result = new CategoryListResult()
		{
			Data = lstCategory,
			StatusCode = StatusCodes.Status200OK
		};

		return result;
	}

	public async Task<Guid> DeleteHappening(DeleteExplore data, AuditableModel auditable)
	{
		if (data.IsCategory == true)
		{
			trMarcomCMSWhatHappenCategory category = new trMarcomCMSWhatHappenCategory()
			{
				Order = 1,
				IsActive = true,
				IsDelete = false,
				IsArtAndCulture = false,
				SystemType = 0,
				CategoryNameEn = ""
			};
			if (data.Id.HasValue)
			{
				trMarcomCMSWhatHappenCategory? categoryold = await Context.MarcomCMSWhatHappenCategory.AsTracking().FirstOrDefaultAsync(w => w.Id == data.Id);
				if (categoryold != null)
				{
					category = categoryold;
				}
				var lstCategory = await Context.MarcomCMSWhatHappenCategory.AsTracking().Where(w => !w.IsDelete && w.Id != data.Id).OrderBy(o => o.Order).ToListAsync();
				if (lstCategory != null)
				{
					int nOrder = 1;
					foreach (var item in lstCategory)
					{
						item.Order = nOrder;
						nOrder++;

						await Context.SaveChangesAsync();
					}
				}
			}

			category.IsDelete = true;
			category.UpdatedBy = auditable.UpdatedBy;
			category.UpdatedByName = auditable.UpdatedByName + "";
			category.UpdatedDate = auditable.UpdatedDate;

			return category.Id;
		}
		else
		{
			trMarcomCMSWhatHappenSub subcontent = new trMarcomCMSWhatHappenSub()
			{
				Order = 1,
				IsActive = true,
				IsDelete = false,
				IsShowRelatedLink = false,
				TitleEn = "",
				CategoryId = Guid.NewGuid(),
				IsPin = false,
				IsNotSpecify = false,
				ShowTimeStartDate = DateTime.Now,
			};

			if (data.Id.HasValue)
			{
				trMarcomCMSWhatHappenSub? subcontentold = await Context.MarcomCMSWhatHappenSub.AsTracking().FirstOrDefaultAsync(w => w.Id == data.Id);
				if (subcontentold != null)
				{
					subcontent = subcontentold;
				}
				var lstSubContent = await Context.MarcomCMSWhatHappenSub.AsTracking().Where(w => !w.IsDelete && w.Id != data.Id && w.CategoryId == subcontent.CategoryId).OrderBy(o => o.Order).ToListAsync();
				if (lstSubContent != null)
				{
					int nOrder = 1;
					foreach (var item in lstSubContent)
					{
						item.Order = nOrder;
						nOrder++;

						await Context.SaveChangesAsync();
					}
				}
				var lstContentSubPin = await Context.MarcomCMSWhatHappenSub.AsTracking().Where(w => !w.IsDelete && w.Id != data.Id && w.IsPin).OrderBy(o => o.OrderPin).ToListAsync();
				if (lstContentSubPin != null)
				{
					int nOrder = 1;
					foreach (var item in lstContentSubPin)
					{
						item.OrderPin = nOrder;
						nOrder++;

						await Context.SaveChangesAsync();
					}
				}
			}

			subcontent.IsDelete = true;
			subcontent.UpdatedBy = auditable.UpdatedBy;
			subcontent.UpdatedByName = auditable.UpdatedByName + "";
			subcontent.UpdatedDate = auditable.UpdatedDate;

			return subcontent.Id;
		}
	}

	public async Task<object> UpdateConfig(ConfigMarcom data, AuditableModel auditable)
	{
		object result = new object();
		try
		{
			if (data.Type == Constant.CONFIG_PR_BANNER)
			{
				trMarcomConfig configTime = new trMarcomConfig()
				{
					Type = 1,
					ValueInt = 5,
					ValueString = "Banner slide time"
				};

				bool isnew = true;
				trMarcomConfig? objConfig = await Context.MarcomConfig.Where(w => w.Type == 1).AsTracking().FirstOrDefaultAsync();
				if (objConfig != null)
				{
					isnew = false;
					configTime = objConfig;
				}
				configTime.ValueInt = data.Time;
				configTime.UpdatedBy = auditable.UpdatedBy;
				configTime.UpdatedByName = auditable.UpdatedByName + "";
				configTime.UpdatedDate = auditable.UpdatedDate;
				if (isnew)
				{
					configTime.Id = Guid.NewGuid();
					configTime.CreatedBy = auditable.CreatedBy;
					configTime.CreatedByName = auditable.CreatedByName + "";
					configTime.CreatedDate = auditable.CreatedDate;
					Context.MarcomConfig.Add(configTime);
				}
			}else if (data.Type == Constant.CONFIG_EVENT)
			{
				trMarcomConfig config = new trMarcomConfig()
				{
					Type = 2,
					ValueInt = 0,
					ValueString = "Event can check don't show again"
				};
				bool isnewconfig = true;
				trMarcomConfig? configold = await Context.MarcomConfig.Where(w => w.Type == 2).AsTracking().FirstOrDefaultAsync();
				if (configold != null)
				{
					isnewconfig = false;
					config = configold;
				}
				config.ValueInt = data.IsShowMessage ? 1 : 0;
				config.UpdatedBy = auditable.UpdatedBy;
				config.UpdatedByName = auditable.UpdatedByName + "";
				config.UpdatedDate = auditable.UpdatedDate;
				if (isnewconfig)
				{
					config.Id = Guid.NewGuid();
					config.CreatedBy = auditable.CreatedBy;
					config.CreatedByName = auditable.CreatedByName + "";
					config.CreatedDate = auditable.CreatedDate;
					Context.MarcomConfig.Add(config);
				}
			}
		}
		catch (Exception ex)
		{
			throw ex;
		}

		return result;
	}

}
