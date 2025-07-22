using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Domain.Entities;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;
using Microsoft.EntityFrameworkCore;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.DigitalLibrary.Model;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.DigitalLibraryManagement.Command.DigitalLibrary;
using Microsoft.IdentityModel.Tokens;
using TCCTOBK.OperationBackend.Domain;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.DigitalLibraryManagement.Query.GetAllDigitalLibrary;
using TCCTOBK.OperationBackend.Application.Helper.Table;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.ContentManagement.Query.GetAllContentManagement;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.ContentManagement.Query.GetContentManagement;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.ContentManagement.Model;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.DigitalLibraryManagement.Query.GetDigitalLibrary;
using Microsoft.AspNetCore.Http;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.PRBannerManagement.Query.GetPRBannerManagement;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.PRBannerManagement.Model;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.PRBannerManagement.Query.GetAllPRBannerManagement;
using TCCTOBK.OperationBackend.Application.Contracts.Minio;
using TCCTOBK.OperationBackend.Application.Exceptions;
using System.Collections.Generic;
using NPOI.SS.Formula.Functions;
using Minio.DataModel.Notification;
using System.Net.NetworkInformation;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.BannerManagement.Query.GetBanner;
using System.Reflection;
using Microsoft.EntityFrameworkCore.Metadata;
using static Org.BouncyCastle.Math.EC.ECCurve;
using System.Web;
using System.Reflection.Emit;

namespace TCCTOBK.OperationBackend.Application.Repositories;
internal class SustainabilityRepository : BaseRepository<trSustainabilityBanner>, ISustainabilityRepository
{
	private readonly IMinioService _minioservice;

	public SustainabilityRepository(ITCCTOBKContext context, IMinioService minioservice) : base(context)
	{
		_minioservice = minioservice;
	}

	public async Task<List<Guid>> UpdateBanner(List<BannerSustainability> data, AuditableModel auditable)
	{
		var existingIds = data.Where(d => d.Id.HasValue && !d.IsChanged)
													.Select(d => d.Id!.Value)
													.ToList();

		var existingBanners = await Db.AsTracking()
																	.Where(w => !w.IsDelete && existingIds.Contains(w.Id))
																	.ToListAsync();

		List<Guid> result = new List<Guid>();

		foreach (var item in data)
		{
			bool isNew = true;

			if (!item.IsChanged && item.Id.HasValue)
			{
				var banner = existingBanners.FirstOrDefault(w => w.Id == item.Id.Value);
				if (banner != null)
				{
					if (banner.LabelLevel1 != item.LabelLevel1 || banner.LabelLevel2 != item.LabelLevel2
						|| banner.LabelLevel1TH != item.LabelLevel1TH || banner.LabelLevel2TH != item.LabelLevel2TH
						|| banner.LabelLevel1CN != item.LabelLevel1CN || banner.LabelLevel2CN != item.LabelLevel2CN
						|| banner.LabelIntroduce != item.LabelIntroduce || banner.LabelIntroduceTH != item.LabelIntroduceTH || banner.LabelIntroduceCN != item.LabelIntroduceCN
						)
					{
						banner.LabelLevel1 = item.LabelLevel1;
						banner.LabelLevel2 = item.LabelLevel2;
						banner.LabelLevel1TH = item.LabelLevel1TH;
						banner.LabelLevel2TH = item.LabelLevel2TH;
						banner.LabelLevel1CN = item.LabelLevel1CN;
						banner.LabelLevel2CN = item.LabelLevel2CN;
						banner.LabelIntroduce = item.LabelIntroduce;
						banner.LabelIntroduceTH = item.LabelIntroduceTH;
						banner.LabelIntroduceCN = item.LabelIntroduceCN;
						banner.UpdatedBy = auditable.UpdatedBy;
						banner.UpdatedByName = auditable.UpdatedByName ?? "";
						banner.UpdatedDate = auditable.UpdatedDate;
					}

					isNew = false;
					result.Add(item.Id.Value);
				}
			}

			if (isNew)
			{
				var newBanner = new trSustainabilityBanner
				{
					Id = Guid.NewGuid(),
					Type = item.Type,
					ImageURL = item.ImageURL,
					FileName = item.FileName,
					OriginalFileName = item.OriginalFileName,
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
					CreatedBy = auditable.CreatedBy,
					CreatedByName = auditable.CreatedByName ?? "",
					CreatedDate = auditable.CreatedDate,
					UpdatedBy = auditable.UpdatedBy,
					UpdatedByName = auditable.UpdatedByName ?? "",
					UpdatedDate = auditable.UpdatedDate,
				};
				await Db.AddAsync(newBanner);
				result.Add(newBanner.Id);
			}
		}

		var lstInactive = await Db.AsTracking()
															.Where(w => !w.IsDelete && !result.Contains(w.Id))
															.ToListAsync();
		lstInactive.ForEach(item => item.IsDelete = true);

		return result;
	}


	public trSustainabilityBanner? GetBanner(Guid id, int type)
	{
		return Db.AsQueryable().FirstOrDefault(w => w.Id == id && w.Type == type);
	}

	public async Task<List<trSustainabilityBanner>> GetAllBanner()
	{
		IQueryable<trSustainabilityBanner> lstBanner = Db.Where(w => !w.IsDelete).OrderBy(o => o.Type).AsNoTracking();
		return await lstBanner.ToListAsync();
	}

	public async Task<Guid> DeleteDigitalLibrary(DeleteDigitalSustainability data, AuditableModel auditable)
	{
		trSustainabilityLibrary digital = new trSustainabilityLibrary()
		{
			TopicEN = "",
			IntroduceEN = "",
			IsActive = true,
			IsDelete = false,
			Order = 0,
		};
		if (data.Id.HasValue)
		{
			trSustainabilityLibrary? digitalold = await Context.SustainabilityLibrary.AsTracking().FirstOrDefaultAsync(w => !w.IsDelete && data.Id.Value == w.Id);

			if (digitalold != null)
			{
				digital = digitalold;
			}
			var lstLibrary = await Context.SustainabilityLibrary.AsTracking().Where(w => !w.IsDelete && w.Id != data.Id).OrderBy(o => o.Order).ToListAsync();
			if (lstLibrary != null)
			{
				int nOrder = 1;
				foreach (var item in lstLibrary)
				{
					item.Order = nOrder;
					nOrder++;

					await Context.SaveChangesAsync();
				}
			}
		}
		digital.IsDelete = true;
		digital.UpdatedBy = auditable.UpdatedBy;
		digital.UpdatedByName = auditable.UpdatedByName + "";
		digital.UpdatedDate = auditable.UpdatedDate;

		return digital.Id;
	}

	public async Task<Guid> UpdateDigitalLibrary(DigitalSustainability data, AuditableModel auditable)
	{
		trSustainabilityLibrary digital = new trSustainabilityLibrary()
		{
			TopicEN = "",
			IntroduceEN = "",
			IsActive = true,
			IsDelete = false,
			Order = 0,
		};
		bool isnew = true;

		if (data.Id.HasValue)
		{
			trSustainabilityLibrary? digitalold = await Context.SustainabilityLibrary.AsTracking().FirstOrDefaultAsync(w => !w.IsDelete && data.Id.Value == w.Id);

			if (digitalold != null)
			{
				trSustainabilityLibrary? existLibrary = await Context.SustainabilityLibrary.AsTracking().FirstOrDefaultAsync(w => !w.IsDelete && w.TopicEN.Trim().ToLower() == (data.LibraryEn.Topic + "").Trim().ToLower() && data.Id.Value != w.Id);
				if (existLibrary != null) throw new BadRequestException("Topic is duplicate in system");
				digital = digitalold;
				isnew = false;
			}
		}

		digital.TopicEN = data.LibraryEn.Topic + "";
		digital.TopicCN = data.LibraryCn.Topic;
		digital.TopicTH = data.LibraryTh.Topic;

		digital.IntroduceEN = data.LibraryEn.Introduce + "";
		digital.IntroduceCN = data.LibraryCn.Introduce;
		digital.IntroduceTH = data.LibraryTh.Introduce;

		digital.IsActive = data.Status;
		digital.IsDelete = false;

		digital.UpdatedBy = auditable.UpdatedBy;
		digital.UpdatedByName = auditable.UpdatedByName + "";
		digital.UpdatedDate = auditable.UpdatedDate;

		if (isnew)
		{
			trSustainabilityLibrary? existLibrary = await Context.SustainabilityLibrary.AsTracking().FirstOrDefaultAsync(w => !w.IsDelete && w.TopicEN.Trim().ToLower() == digital.TopicEN.Trim().ToLower());
			if (existLibrary != null) throw new BadRequestException("Topic is duplicate in system");
			digital.Id = Guid.NewGuid();
			digital.Order = (await Context.SustainabilityLibrary.Where(w => !w.IsDelete).AnyAsync() ? await Context.SustainabilityLibrary.Where(w => !w.IsDelete).MaxAsync(m => m.Order) : 0) + 1;

			digital.CreatedBy = auditable.CreatedBy;
			digital.CreatedByName = auditable.CreatedByName + "";
			digital.CreatedDate = auditable.CreatedDate;

			Context.SustainabilityLibrary.Add(digital);
		}

		//EN
		await UpdateDigitalLibraryFile(digital.Id, data.LibraryEn.ListFile, "en", auditable);
		if (!data.LibraryCn.Topic.IsNullOrEmpty())
		{
			await UpdateDigitalLibraryFile(digital.Id, data.LibraryCn.ListFile, "zh", auditable);
		}
		else
		{
			await UpdateDigitalLibraryFile(digital.Id, new List<DigitalLibraryFile>(), "zh", auditable);
		}
		if (!data.LibraryTh.Topic.IsNullOrEmpty())
		{
			await UpdateDigitalLibraryFile(digital.Id, data.LibraryTh.ListFile, "th", auditable);
		}
		else
		{
			await UpdateDigitalLibraryFile(digital.Id, new List<DigitalLibraryFile>(), "th", auditable);
		}

		return digital.Id;
	}

	public async Task<List<Guid>> UpdateDigitalLibraryFile(Guid digitalId, List<DigitalLibraryFile> data, string type, AuditableModel auditable)
	{
		List<Guid> lstFileId = new List<Guid>();

		data.ForEach(async item =>
		{
			trSustainabilityLibraryFile file = new trSustainabilityLibraryFile()
			{
				Id = Guid.NewGuid(),
				TopicId = digitalId,
				Language = type,
				Order = 0,
				AttachFileName = "",
				AttachFileSize = "",
				AttachFileType = "",
				AttachFileURL = "",
				AttachOriginalFileName = "",
				IsActive = true,
				IsDelete = false,
			};

			bool isnew = true;

			if (item.Id.HasValue)
			{
				trSustainabilityLibraryFile? fileold = Context.SustainabilityLibraryFile.AsTracking().FirstOrDefault(w => w.TopicId == digitalId && w.Language == type && w.Id == item.Id.Value && !w.IsDelete);
				if (fileold != null)
				{
					file = fileold;
					isnew = false;
				}
			}

			var fileSize = Task.Run(() => _minioservice.GetObjectSize("digitallibrary", item.AttachFileName));
			fileSize.Wait();
			double sizeInMB = fileSize.Result / (1024.0 * 1024.0);

			file.AttachFileName = item.AttachFileName;
			file.AttachFileSize = $"{sizeInMB:F2} MB";
			file.AttachFileType = Path.GetExtension(item.AttachFileName).TrimStart('.').ToUpper();
			file.AttachFileURL = "digitallibrary";
			file.AttachOriginalFileName = item.OriginalAttachFileName;
			file.Order = item.ConfigOrder?.Current ?? 0;

			file.CoverFileName = item.FileName;
			file.CoverImageURL = item.ImageURL;
			file.CoverOriginalFileName = item.OriginalFileName;

			file.IsActive = true;
			file.IsDelete = false;

			file.UpdatedBy = auditable.UpdatedBy;
			file.UpdatedByName = auditable.UpdatedByName + "";
			file.UpdatedDate = auditable.UpdatedDate;

			if (isnew)
			{
				file.CreatedBy = auditable.CreatedBy;
				file.CreatedByName = auditable.CreatedByName + "";
				file.CreatedDate = auditable.CreatedDate;

				Context.SustainabilityLibraryFile.Add(file);
			}

			lstFileId.Add(file.Id);

		});

		await Task.Delay(500);

		var datafile = await Context.SustainabilityLibraryFile.AsTracking().Where(w => w.TopicId == digitalId && w.Language == type && !lstFileId.Contains(w.Id)).ToListAsync();

		datafile.ForEach(item =>
		{
			item.IsDelete = true;
		});

		return lstFileId;
	}

	public async Task<DigitalLibraryByIdResult> GetDigitalLibraryById(Guid dlid)
	{
		var tbdigital = await Context.SustainabilityLibrary.AsNoTracking().FirstOrDefaultAsync(w => w.Id == dlid && !w.IsDelete);
		DigitalLibraryByIdResult digital = new DigitalLibraryByIdResult();
		DigitalLibraryData result = new DigitalLibraryData();

		if (tbdigital != null)
		{
			//en
			DigitalLibraryDataModel digitalEN = new DigitalLibraryDataModel()
			{
				Topic = tbdigital.TopicEN,
				Introduce = tbdigital.IntroduceEN,
				ListFile = await GetDigitalLibraryFile(dlid, "en")
			};

			//cn
			DigitalLibraryDataModel digitalCN = new DigitalLibraryDataModel()
			{
				Topic = tbdigital.TopicCN + "",
				Introduce = tbdigital.IntroduceCN + "",
				ListFile = await GetDigitalLibraryFile(dlid, "zh")
			};

			//th
			DigitalLibraryDataModel digitalTH = new DigitalLibraryDataModel()
			{
				Topic = tbdigital.TopicTH + "",
				Introduce = tbdigital.IntroduceTH + "",
				ListFile = await GetDigitalLibraryFile(dlid, "th")
			};

			result.En = digitalEN;
			result.Cn = digitalCN;
			result.Th = digitalTH;

			digital.Data = result;
			digital.Status = tbdigital.IsActive;
		}

		return digital;
	}

	public async Task<List<DigitalLibraryFile>> GetDigitalLibraryFile(Guid dlid, string lang)
	{
		var lstfile = await Context.SustainabilityLibraryFile.AsNoTracking().Where(w => w.TopicId == dlid && w.Language == lang && !w.IsDelete).OrderBy(o => o.Order).ToListAsync();
		List<DigitalLibraryFile> digital = new List<DigitalLibraryFile>();
		int max = lstfile.Any() ? lstfile.Max(m => m.Order) : 1;

		lstfile.ForEach(file =>
		{
			digital.Add(new DigitalLibraryFile()
			{
				Id = file.Id,
				ImageURL = file.CoverImageURL + "",
				FileName = file.CoverFileName + "",
				OriginalFileName = file.CoverOriginalFileName + "",
				AttachFileName = file.AttachFileName,
				AttachFileURL = file.AttachFileURL,
				OriginalAttachFileName = file.AttachOriginalFileName,
				AttachFileType = file.AttachFileType,
				AttachFileSize = file.AttachFileSize,
				Order = file.Order,
				IsDelete = false,
				ConfigOrder = new DigitalOrder()
				{
					Current = file.Order,
					Max = max
				}
			});
		});

		return digital;
	}

	public async Task<DigitalResult> GetAllDigitalLibrary(string? filter, int? status, TableState state)
	{
		var digital = await GetAllQueryBuilder(filter, status).OrderBy(o => o.Order).ToListAsync();
		var digitalOrder = await GetAllQueryBuilder(null, null).OrderBy(o => o.Order).ToListAsync();
		int total = digital.Count;

		digital = digital.Skip(state.Skip).Take(state.Take).ToList();

		List<DigitalTable> digitalTables = new List<DigitalTable>();
		int max = digitalOrder.Any() ? digitalOrder.Max(m => m.Order) : 1;
		digital.ForEach(item =>
		{
			digitalTables.Add(new DigitalTable()
			{
				Id = item.Id,
				Topic = item.TopicEN,
				IsHasEN = !item.TopicEN.IsNullOrEmpty(),
				IsHasCN = !item.TopicCN.IsNullOrEmpty(),
				IsHasTH = !item.TopicTH.IsNullOrEmpty(),
				Status = item.IsActive ? "active" : "inactive",
				LastUpdate = ToUnixTime(item.UpdatedDate),
				ConfigOrder = new DigitalOrder()
				{
					Current = item.Order,
					Max = max,
				}
			});
		});

		int totalPage = (int)Math.Ceiling((double)total / state.Take);

		DigitalResult result = new DigitalResult()
		{
			Data = digitalTables,
			Pagination = new DigitalPagination()
			{
				Total = total,
				Total_page = totalPage,
				Page_number = state.Page
			}
		};

		return result;
	}

	public async Task<int> DigitalLibraryCount(string? filter, int? status)
	{
		var digital = await GetAllQueryBuilder(filter, status).ToListAsync();

		return digital.Count;
	}

	private IQueryable<trSustainabilityLibrary> GetAllQueryBuilder(string? filter, int? status)
	{
		var query = Context.SustainabilityLibrary.Where(w => !w.IsDelete).AsNoTracking();
		if (!string.IsNullOrEmpty(filter))
		{
			query = query.Where(x => x.TopicEN.Trim().ToLower().Contains(filter.Trim().ToLower()));
		}

		if (status.HasValue)
		{
			bool isStatus = status.Value == Constant.DIGITAL_STATUS_ACTIVE;
			query = query.Where(x => x.IsActive == isStatus);
		}
		return query;
	}

	public async Task<Guid> DeleteContentManagement(DeleteContentManagementSustainability data, AuditableModel auditable)
	{
		trSustainabilityCMS cms = new trSustainabilityCMS()
		{
			IsSubMenu = false,
			Order = 1,
			MenuNameEn = "",
			IsActive = true,
			IsDelete = false,
		};


		if (data.Id.HasValue)
		{
			var cmsold = await Context.SustainabilityCMS.AsTracking().FirstOrDefaultAsync(w => w.Id == data.Id);
			if (cmsold != null)
			{
				cms = cmsold;
			}

			if (cms.ParentId.HasValue && cms.IsSubMenu)
			{
				var lstSub = await Context.SustainabilityCMS.AsTracking().Where(w => w.ParentId == cms.ParentId.Value && !w.IsDelete && w.Id != data.Id).OrderBy(o => o.Order).ToListAsync();
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
			else
			{
				var lstMain = await Context.SustainabilityCMS.AsTracking().Where(w => !w.IsDelete && w.Id != data.Id && !w.IsSubMenu).OrderBy(o => o.Order).ToListAsync();
				if (lstMain != null)
				{
					int nOrder = 1;
					foreach (var item in lstMain)
					{
						item.Order = nOrder;
						nOrder++;

						await Context.SaveChangesAsync();
					}
				}
			}


		}

		cms.IsDelete = true;
		cms.UpdatedBy = auditable.UpdatedBy;
		cms.UpdatedByName = auditable.UpdatedByName + "";
		cms.UpdatedDate = auditable.UpdatedDate;

		return cms.Id;
	}

	public async Task<Guid> UpdateContentManagement(ContentManagementSustainability data, AuditableModel auditable)
	{
		trSustainabilityCMS cms = new trSustainabilityCMS()
		{
			IsSubMenu = false,
			Order = 1,
			MenuNameEn = "",
			IsActive = true,
			IsDelete = false,
		};

		bool isnew = true;

		if (data.Id.HasValue)
		{
			var cmsold = await Context.SustainabilityCMS.AsTracking().FirstOrDefaultAsync(w => w.Id == data.Id);
			if (cmsold != null)
			{
				var existContent = await Context.SustainabilityCMS.AsTracking().FirstOrDefaultAsync(w => !w.IsDelete && w.MenuNameEn.Trim().ToLower() == (data.Detail.En.Menu + "").Trim().ToLower() && data.Id.Value != w.Id);
				if (existContent != null) throw new BadRequestException("Menu is duplicate in system");
				cms = cmsold;
				isnew = false;
			}
		}

		if (data.ParentId.HasValue && cms.ParentId.HasValue && data.ParentId.Value != cms.ParentId.Value)
		{
			////change parent
			int maxOrder = 0;
			if (await Context.SustainabilityCMS.AnyAsync())
			{
				maxOrder = await Context.SustainabilityCMS
						.Where(w => w.ParentId == data.ParentId.Value && !w.IsDelete)
						.MaxAsync(m => (int?)m.Order) ?? 0;
			}
			cms.Order = maxOrder + 1;
			var lstSub = await Context.SustainabilityCMS.AsTracking().Where(w => w.ParentId == cms.ParentId.Value && !w.IsDelete && w.Id != data.Id).OrderBy(o => o.Order).ToListAsync();
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

		cms.IsActive = data.Status;
		cms.IsDelete = false;
		cms.IsShowRelatedLink = data.IsShowRelatedLink;
		cms.ParentId = data.ParentId;
		cms.LayoutType = data.LayoutType;

		if (data.ParentId.HasValue)
		{
			cms.IsSubMenu = data.IsSubMenu;
		}

		cms.UpdatedBy = auditable.UpdatedBy;
		cms.UpdatedByName = auditable.UpdatedByName + "";
		cms.UpdatedDate = auditable.UpdatedDate;

		if (isnew)
		{
			var existContent = await Context.SustainabilityCMS.AsTracking().FirstOrDefaultAsync(w => !w.IsDelete && w.MenuNameEn.Trim().ToLower() == (data.Detail.En.Menu ?? "").Trim().ToLower());
			if (existContent != null) throw new BadRequestException("Menu is duplicate in system");
			cms.Id = Guid.NewGuid();
			int maxOrder = 0;
			if (await Context.SustainabilityCMS.Where(w => !w.IsDelete).AnyAsync())
			{
				maxOrder = await Context.SustainabilityCMS
						.Where(w => (data.IsSubMenu ? w.ParentId == data.ParentId : !w.IsSubMenu) && !w.IsDelete)
						.MaxAsync(m => (int?)m.Order) ?? 0;
			}
			cms.Order = maxOrder + 1;
			cms.CreatedBy = auditable.CreatedBy;
			cms.CreatedByName = auditable.CreatedByName + "";
			cms.CreatedDate = auditable.CreatedDate;

			Context.SustainabilityCMS.Add(cms);
		}

		ContentManagementLang detail = data.Detail;

		//en
		cms.MenuNameEn = (detail.En.Menu + "").Trim();
		cms.IntroduceEN = detail.En.Introduce?.Trim();
		cms.TitleRelatedEN = detail.En.TitleRelated;
		cms.CoverImageURLEN = detail.En.CoverImageURL;
		cms.CoverFileNameEN = detail.En.CoverFileName;
		cms.CoverOriginalFileNameEN = detail.En.CoverOriginalFileName;
		cms.HeadFileNameEN = detail.En.HeadFileName;
		cms.HeadImageURLEN = detail.En.HeadImageURL;
		cms.HeadOriginalFileNameEN = detail.En.HeadOriginalFileName;
		UpdateContentManagementContent(cms.Id, detail.En.CMS, "en", auditable);

		if (!detail.Cn.Menu.IsNullOrEmpty())
		{
			//cn
			cms.MenuNameCN = (detail.Cn.Menu + "").Trim();
			cms.IntroduceCN = detail.Cn.Introduce?.Trim();
			cms.TitleRelatedCN = detail.Cn.TitleRelated;
			cms.CoverImageURLCN = detail.Cn.CoverImageURL;
			cms.CoverFileNameCN = detail.Cn.CoverFileName;
			cms.CoverOriginalFileNameCN = detail.Cn.CoverOriginalFileName;
			cms.HeadFileNameCN = detail.Cn.HeadFileName;
			cms.HeadImageURLCN = detail.Cn.HeadImageURL;
			cms.HeadOriginalFileNameCN = detail.Cn.HeadOriginalFileName;
			UpdateContentManagementContent(cms.Id, detail.Cn.CMS, "zh", auditable);
		}
		else
		{
			cms.MenuNameCN = null;
			cms.IntroduceCN = null;
			cms.TitleRelatedCN = null;
			cms.CoverImageURLCN = null;
			cms.CoverFileNameCN = null;
			cms.CoverOriginalFileNameCN = null;
			cms.HeadFileNameCN = null;
			cms.HeadImageURLCN = null;
			cms.HeadOriginalFileNameCN = null;
			UpdateContentManagementContent(cms.Id, new List<CmsContent>(), "zh", auditable);
		}

		if (!detail.Th.Menu.IsNullOrEmpty())
		{
			//th
			cms.MenuNameTH = (detail.Th.Menu + "").Trim();
			cms.IntroduceTH = detail.Th.Introduce?.Trim();
			cms.TitleRelatedTH = detail.Th.TitleRelated;
			cms.CoverImageURLTH = detail.Th.CoverImageURL;
			cms.CoverFileNameTH = detail.Th.CoverFileName;
			cms.CoverOriginalFileNameTH = detail.Th.CoverOriginalFileName;
			cms.HeadFileNameTH = detail.Th.HeadFileName;
			cms.HeadImageURLTH = detail.Th.HeadImageURL;
			cms.HeadOriginalFileNameTH = detail.Th.HeadOriginalFileName;
			UpdateContentManagementContent(cms.Id, detail.Th.CMS, "th", auditable);
		}
		else
		{
			cms.MenuNameTH = null;
			cms.IntroduceTH = null;
			cms.TitleRelatedTH = null;
			cms.CoverImageURLTH = null;
			cms.CoverFileNameTH = null;
			cms.CoverOriginalFileNameTH = null;
			cms.HeadFileNameTH = null;
			cms.HeadImageURLTH = null;
			cms.HeadOriginalFileNameTH = null;
			UpdateContentManagementContent(cms.Id, new List<CmsContent>(), "th", auditable);
		}

		return cms.Id;
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

	private void UpdateContentManagementContent(Guid cmsid, List<CmsContent> cms, string lang, AuditableModel auditable)
	{
		List<Guid> lstguid = new List<Guid>();
		cms = cms.OrderBy(o => o.Order).ToList();

		cms.ForEach(item =>
		{
			trSustainabilityCMSContent content = new trSustainabilityCMSContent()
			{
				Id = Guid.NewGuid(),
				MenuId = cmsid,
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

			Context.SustainabilityCMSContent.Add(content);

			lstguid.Add(content.Id);
		});

		List<trSustainabilityCMSContent> lstDelete = Context.SustainabilityCMSContent.AsTracking().Where(w => w.MenuId == cmsid && w.Language == lang && !lstguid.Contains(w.Id)).ToList();
		Context.SustainabilityCMSContent.RemoveRange(lstDelete);

		////return lstguid;
	}

	private IQueryable<trSustainabilityCMS> GetAllQueryBuilderCMS(string? filter, int? status)
	{
		IQueryable<trSustainabilityCMS> query = Context.SustainabilityCMS.Where(w => !w.IsDelete).AsNoTracking();
		if (!string.IsNullOrEmpty(filter))
		{
			query = query.Where(x => x.MenuNameEn.Trim().ToLower().Contains(filter.Trim().ToLower()));
		}

		if (status.HasValue)
		{
			bool isStatus = status.Value == Constant.DIGITAL_STATUS_ACTIVE;
			query = query.Where(x => x.IsActive == isStatus);
		}
		return query;
	}

	private IQueryable<trSustainabilityPRBanner> GetAllQueryBuilderPRBanner(string? filter, int? status)
	{
		IQueryable<trSustainabilityPRBanner> query = Context.SustainabilityPRBanner.Where(w => !w.IsDelete).AsNoTracking();
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

	private IQueryable<trSustainabilityCMSContent> GetAllQueryBuilderCMSContent()
	{
		var query = Context.SustainabilityCMSContent.Where(w => !w.IsDelete).AsNoTracking();
		return query;
	}

	public async Task<GetContentManagementResult> GetCMSById(Guid cmsid)
	{
		var query = await GetAllQueryBuilderCMS(null, null).ToListAsync();
		var cms = query.Find(w => w.Id == cmsid);

		GetContentManagementResult result = new GetContentManagementResult();
		if (cms != null)
		{
			ContentManagementLang lang = new ContentManagementLang();
			var querycontent = await GetAllQueryBuilderCMSContent().Where(w => w.MenuId == cms.Id).ToListAsync();

			List<CmsContent> lstcontent = new List<CmsContent>();

			querycontent.ForEach(item =>
			{
				lstcontent.Add(new CmsContent()
				{
					Id = item.Id,
					MenuId = item.MenuId,
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

			lang.En = new ContentManagementDetail()
			{
				Menu = cms.MenuNameEn,
				Introduce = cms.IntroduceEN,
				CoverImageURL = cms.CoverImageURLEN,
				CoverFileName = cms.CoverFileNameEN,
				CoverOriginalFileName = cms.CoverOriginalFileNameEN,
				HeadImageURL = cms.HeadImageURLEN,
				HeadFileName = cms.HeadFileNameEN,
				HeadOriginalFileName = cms.HeadOriginalFileNameEN,
				TitleRelated = cms.TitleRelatedEN,
				CMS = lstcontent.Where(w => w.Language == "en").OrderBy(o => o.Order).ToList()
			};

			lang.Cn = new ContentManagementDetail()
			{
				Menu = cms.MenuNameCN,
				Introduce = cms.IntroduceCN,
				CoverImageURL = cms.CoverImageURLCN,
				CoverFileName = cms.CoverFileNameCN,
				CoverOriginalFileName = cms.CoverOriginalFileNameCN,
				HeadImageURL = cms.HeadImageURLCN,
				HeadFileName = cms.HeadFileNameCN,
				HeadOriginalFileName = cms.HeadOriginalFileNameCN,
				TitleRelated = cms.TitleRelatedCN,
				CMS = lstcontent.Where(w => w.Language == "zh").OrderBy(o => o.Order).ToList()
			};

			lang.Th = new ContentManagementDetail()
			{
				Menu = cms.MenuNameTH,
				Introduce = cms.IntroduceTH,
				CoverImageURL = cms.CoverImageURLTH,
				CoverFileName = cms.CoverFileNameTH,
				CoverOriginalFileName = cms.CoverOriginalFileNameTH,
				HeadImageURL = cms.HeadImageURLTH,
				HeadFileName = cms.HeadFileNameTH,
				HeadOriginalFileName = cms.HeadOriginalFileNameTH,
				TitleRelated = cms.TitleRelatedTH,
				CMS = lstcontent.Where(w => w.Language == "th").OrderBy(o => o.Order).ToList()
			};

			ContentManagementModel data = new ContentManagementModel()
			{
				Id = cms.Id,
				ParentId = cms.ParentId,
				IsDelete = cms.IsDelete,
				IsShowRelatedLink = cms.IsShowRelatedLink ?? false,
				IsSubMenu = cms.IsSubMenu,
				LayoutType = cms.LayoutType,
				Order = cms.Order,
				Status = cms.IsActive,
				IsDisabled = cms.IsSubMenu || query.Any(a => a.ParentId == cms.Id),
				Detail = new ContentManagementLang()
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

	public async Task<CmsResult> GetAllCMS(string? filter, int? status, Guid? parentID, TableState state)
	{
		List<trSustainabilityCMS> query = await GetAllQueryBuilderCMS(filter, status).ToListAsync();
		List<trSustainabilityCMS> queryOrder = await GetAllQueryBuilderCMS(null, null).ToListAsync();
		List<trSustainabilityCMS> oldquery = query;
		int max = 1;

		if (parentID.HasValue)
		{
			query = query.Where(w => w.IsSubMenu && w.ParentId.HasValue && w.ParentId.Value == parentID.Value).OrderBy(o => o.Order).ToList();
			queryOrder = queryOrder.Where(w => w.IsSubMenu && w.ParentId.HasValue && w.ParentId.Value == parentID.Value).OrderBy(o => o.Order).ToList();
			max = queryOrder.Any() ? queryOrder.Max(m => m.Order) : 1;
		}
		else
		{
			query = query.Where(w => !w.IsSubMenu).OrderBy(o => o.Order).ToList();
			queryOrder = queryOrder.Where(w => !w.IsSubMenu).OrderBy(o => o.Order).ToList();
			max = queryOrder.Any() ? queryOrder.Max(m => m.Order) : 1;
		}

		List<trSustainabilityCMSContent> querycontent = await GetAllQueryBuilderCMSContent().Where(w => w.Language == "en").ToListAsync();
		int total = query.Count;

		query = query.Skip(state.Skip).Take(state.Take).ToList();

		List<CmsTable> lstTable = new List<CmsTable>();

		query.ForEach(cms =>
		{
			bool isHasSubmenu = oldquery.Exists(w => w.ParentId == cms.Id);

			List<CmsContent> lstcontent = new List<CmsContent>();

			querycontent.Where(w => w.MenuId == cms.Id).OrderBy(o => o.Order).ToList().ForEach(item =>
			{
				lstcontent.Add(new CmsContent()
				{
					Id = item.Id,
					MenuId = item.MenuId,
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

			lstTable.Add(new CmsTable()
			{
				Id = cms.Id,
				Status = cms.IsActive ? "active" : "inactive",
				Sustainability = cms.MenuNameEn,
				IsHasSubMenu = isHasSubmenu,
				IsHasEN = !cms.MenuNameEn.IsNullOrEmpty(),
				IsHasCN = !cms.MenuNameCN.IsNullOrEmpty(),
				IsHasTH = !cms.MenuNameTH.IsNullOrEmpty(),
				LastUpdate = ToUnixTime(cms.UpdatedDate),
				Content = new ContentManagementDetail()
				{
					Menu = cms.MenuNameEn,
					Introduce = cms.IntroduceEN,
					TitleRelated = cms.TitleRelatedEN,
					CoverImageURL = cms.CoverImageURLEN,
					CoverFileName = cms.CoverFileNameEN,
					CoverOriginalFileName = cms.CoverOriginalFileNameEN,
					HeadImageURL = cms.HeadImageURLEN,
					HeadFileName = cms.HeadFileNameEN,
					HeadOriginalFileName = cms.HeadOriginalFileNameEN,
					CMS = lstcontent
				},
				ConfigOrder = new CmsOrder()
				{
					Current = cms.Order,
					Max = max,
				}

			});
		});

		int totalPage = (int)Math.Ceiling((double)total / state.Take);

		CmsResult result = new CmsResult()
		{
			Data = lstTable,
			Pagination = new DigitalPagination()
			{
				Total = total,
				Total_page = totalPage,
				Page_number = state.Page
			}
		};

		return result;
	}

	public async Task<object> ChangeOrder(ChangeOrderSustainability order, AuditableModel auditable)
	{
		object result = new object();
		try
		{
			if (order.Type == Constant.TYPE_DIGITAL_LIBRARY)
			{
				List<trSustainabilityLibrary> query = await Context.SustainabilityLibrary.Where(w => !w.IsDelete).OrderBy(o => o.Order).AsTracking().ToListAsync();
				trSustainabilityLibrary? data = query.Find(w => w.Id == order.Id);
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
					foreach (trSustainabilityLibrary item in lstChange)
					{
						item.Order = isOldMoreThanNew ? ++setOrder : setOrder++;
					}
					data.Order = newOrder;
					result = query;
				}
			}
			else if (order.Type == Constant.TYPE_CMS)
			{
				List<trSustainabilityCMS> query = await Context.SustainabilityCMS.Where(w => !w.IsDelete).OrderBy(o => o.Order).AsTracking().ToListAsync();
				trSustainabilityCMS? data = query.Find(w => w.Id == order.Id);
				if (data != null)
				{
					query = query.Where(w => data.IsSubMenu ? w.ParentId == data.ParentId : !w.IsSubMenu).ToList();
					int oldOrder = data.Order, newOrder = order.NewOrder;
					bool isOldMoreThanNew = oldOrder > newOrder; // เลขเดิมมากกว่าเลขใหม่

					var lstChange = query.Where(w => w.Id != order.Id &&
										(isOldMoreThanNew ?
										(oldOrder >= w.Order && newOrder <= w.Order) :
										(newOrder >= w.Order && oldOrder <= w.Order))
										).ToList();

					int setOrder = isOldMoreThanNew ? newOrder : oldOrder; // เลขลำดับ
					foreach (trSustainabilityCMS item in lstChange)
					{
						item.Order = isOldMoreThanNew ? ++setOrder : setOrder++;
					}
					data.Order = newOrder;
					result = query;
				}
			}
			else if (order.Type == Constant.TYPE_PR_BANNER)
			{
				List<trSustainabilityPRBanner> query = await Context.SustainabilityPRBanner.Where(w => !w.IsDelete).OrderBy(o => o.Order).AsTracking().ToListAsync();
				trSustainabilityPRBanner? data = query.Find(w => w.Id == order.Id);
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
					foreach (trSustainabilityPRBanner item in lstChange)
					{
						item.Order = isOldMoreThanNew ? ++setOrder : setOrder++;
					}
					data.Order = newOrder;
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

	public async Task<Guid> DeletePRBanner(DeleteBannerSustainability data, AuditableModel auditable)
	{
		trSustainabilityPRBanner banner = new trSustainabilityPRBanner()
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
			Type = 0
		};


		if (data.Id.HasValue)
		{
			trSustainabilityPRBanner? bannerold = await Context.SustainabilityPRBanner.AsTracking().FirstOrDefaultAsync(w => w.Id == data.Id);
			if (bannerold != null)
			{
				banner = bannerold;
			}
			var lstBanner = await Context.SustainabilityPRBanner.AsTracking().Where(w => !w.IsDelete && w.Id != data.Id).OrderBy(o => o.Order).ToListAsync();
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

	public async Task<Guid> UpdatePRBanner(PRBannerManagementSustainability data, AuditableModel auditable)
	{
		trSustainabilityPRBanner banner = new trSustainabilityPRBanner()
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
			Type = 0
		};

		bool isnew = true;

		if (data.Id.HasValue)
		{
			trSustainabilityPRBanner? bannerold = await Context.SustainabilityPRBanner.AsTracking().FirstOrDefaultAsync(w => w.Id == data.Id);
			if (bannerold != null)
			{
				trSustainabilityPRBanner? existBanner = await Context.SustainabilityPRBanner.AsTracking().FirstOrDefaultAsync(w => !w.IsDelete && w.BannerName.Trim().ToLower() == (data.BannerName + "").Trim().ToLower() && data.Id.Value != w.Id);
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

		if (data.Type == Constant.CONTENT_TEMPLATE_LINK)
		{
			banner.LinkToURL = data.LinkToURL;
		}

		banner.UpdatedBy = auditable.UpdatedBy;
		banner.UpdatedByName = auditable.UpdatedByName + "";
		banner.UpdatedDate = auditable.UpdatedDate;

		if (isnew)
		{
			trSustainabilityPRBanner? existBanner = await Context.SustainabilityPRBanner.AsTracking().FirstOrDefaultAsync(w => !w.IsDelete && w.BannerName.Trim().ToLower() == (data.BannerName + "").Trim().ToLower());
			if (existBanner != null) throw new BadRequestException("Banner name is duplicate in system");
			banner.Id = Guid.NewGuid();
			banner.Order = (await Context.SustainabilityPRBanner.Where(w => !w.IsDelete).AnyAsync() ? await Context.SustainabilityPRBanner.Where(w => !w.IsDelete).MaxAsync(m => m.Order) : 0) + 1;

			banner.CreatedBy = auditable.CreatedBy;
			banner.CreatedByName = auditable.CreatedByName + "";
			banner.CreatedDate = auditable.CreatedDate;

			Context.SustainabilityPRBanner.Add(banner);
		}

		PRBannerManagementLang detail = data.Detail;

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
		banner.ImageURLEN = detail.En.ImageURL + "";
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
			banner.ImageURLCN = detail.Cn.ImageURL;
			banner.FileNameCN = detail.Cn.FileName;
			banner.OriginalFileNameCN = detail.Cn.OriginalFileName;
			banner.HeaderFileNameCN = detail.Cn.HeaderFileName;
			banner.HeaderImageURLCN = detail.Cn.HeaderImageURL;
			banner.HeaderOriginalFileNameCN = detail.Cn.HeaderOriginalFileName;
			UpdateContentManagementContent(banner.Id, detail.Cn.CMS, "zh", auditable);
		}
		else
		{
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
			banner.ImageURLTH = detail.Th.ImageURL;
			banner.FileNameTH = detail.Th.FileName;
			banner.OriginalFileNameTH = detail.Th.OriginalFileName;
			banner.HeaderFileNameTH = detail.Th.HeaderFileName;
			banner.HeaderImageURLTH = detail.Th.HeaderImageURL;
			banner.HeaderOriginalFileNameTH = detail.Th.HeaderOriginalFileName;
			UpdateContentManagementContent(banner.Id, detail.Th.CMS, "th", auditable);
		}
		else
		{
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

	private double ToUnixTime(DateTime instance)
	{
		double result;
		DateTimeOffset dateValue = new DateTimeOffset(instance.ToUniversalTime());
		result = dateValue.ToUnixTimeMilliseconds();
		return result;
	}
	public async Task<GetPRBannerManagementResult> GetPRBannerById(Guid id)
	{
		var query = await GetAllQueryBuilderPRBanner(null, null).ToListAsync();
		var banner = query.Find(w => w.Id == id);

		GetPRBannerManagementResult result = new GetPRBannerManagementResult();
		if (banner != null)
		{
			PRBannerManagementLang lang = new PRBannerManagementLang();
			List<trSustainabilityCMSContent> querycontent = await GetAllQueryBuilderCMSContent().Where(w => w.MenuId == banner.Id).ToListAsync();

			List<CmsContent> lstcontent = new List<CmsContent>();

			querycontent.ForEach(item =>
			{
				lstcontent.Add(new CmsContent()
				{
					Id = item.Id,
					MenuId = item.MenuId,
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
				ImageURL = banner.ImageURLEN,
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
				ImageURL = banner.ImageURLCN,
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
				ImageURL = banner.ImageURLTH,
				FileName = banner.FileNameTH,
				OriginalFileName = banner.OriginalFileNameTH,
				HeaderImageURL = banner.HeaderImageURLTH,
				HeaderFileName = banner.HeaderFileNameTH,
				HeaderOriginalFileName = banner.HeaderOriginalFileNameTH,
				CMS = lstcontent.Where(w => w.Language == "th").OrderBy(o => o.Order).ToList()
			};

			PRBannerManagementModel data = new PRBannerManagementModel()
			{
				Id = banner.Id,
				IsDelete = banner.IsDelete,
				IsShowRelatedLink = banner.IsShowRelatedLink ?? false,
				BannerName = banner.BannerName,
				LinkToURL = banner.LinkToURL,
				Type = banner.Type,
				Order = banner.Order,
				Status = banner.IsActive,
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

	public async Task<PRBannerResult> GetAllPRBanner(string? filter, int? status, TableState state)
	{
		List<trSustainabilityPRBanner> query = await GetAllQueryBuilderPRBanner(filter, status).OrderBy(o => o.Order).ToListAsync();
		List<trSustainabilityPRBanner> queryOrder = await GetAllQueryBuilderPRBanner(null, null).OrderBy(o => o.Order).ToListAsync();
		int max = queryOrder.Any() ? queryOrder.Max(m => m.Order) : 1;

		List<trSustainabilityCMSContent> querycontent = await GetAllQueryBuilderCMSContent().Where(w => w.Language == "en").ToListAsync();
		int total = query.Count;

		query = query.Skip(state.Skip).Take(state.Take).ToList();

		List<PRBannerTable> lstTable = new List<PRBannerTable>();

		query.ForEach(banner =>
		{

			List<CmsContent> lstcontent = new List<CmsContent>();

			querycontent.Where(w => w.MenuId == banner.Id).OrderBy(o => o.Order).ToList().ForEach(item =>
			{
				lstcontent.Add(new CmsContent()
				{
					Id = item.Id,
					MenuId = item.MenuId,
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

			lstTable.Add(new PRBannerTable()
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
				Content = new PRBannerManagementDetail()
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
				ConfigOrder = new PRBannerOrder()
				{
					Current = banner.Order,
					Max = max,
				}

			});
		});

		int totalPage = (int)Math.Ceiling((double)total / state.Take);
		string sTime = "";
		trSustainabilityConfig? objConfig = await Context.SustainabilityConfig.Where(w => w.Type == 1).AsTracking().FirstOrDefaultAsync();
		if (objConfig != null)
		{
			sTime = objConfig.ValueInt + "";
		}

		PRBannerResult result = new PRBannerResult()
		{
			Data = lstTable,
			Pagination = new DigitalPagination()
			{
				Total = total,
				Total_page = totalPage,
				Page_number = state.Page
			},
			Time = sTime
		};

		return result;
	}

	public async Task<MainContentManagementResult> GetCMSMenu()
	{
		List<OptionSelection> lstCMS = await GetAllQueryBuilderCMS(null, null).Where(w => !w.IsSubMenu).OrderBy(o => o.Order).Select(s => new OptionSelection
		{
			Value = s.Id.ToString(),
			Name = s.MenuNameEn
		}).ToListAsync();

		MainContentManagementResult result = new MainContentManagementResult()
		{
			Data = lstCMS,
			StatusCode = StatusCodes.Status200OK
		};

		return result;
	}

	public async Task<GetInitialPRBannerResult> GetInitialBanner()
	{
		List<trSustainabilityPRBanner> query = await GetAllQueryBuilderPRBanner(null, null).OrderBy(o => o.Order).ToListAsync();
		InitialPRBannerModel objInit = new InitialPRBannerModel();
		objInit.IsHasContent = query.Any(a => a.Type == 1);
		GetInitialPRBannerResult result = new GetInitialPRBannerResult()
		{
			Data = objInit,
			StatusCode = StatusCodes.Status200OK
		};

		return result;
	}

	public async Task<object> UpdateConfig(ConfigSustainability data, AuditableModel auditable)
	{
		object result = new object();
		try
		{
			if (data.Type == Constant.CONFIG_PR_BANNER)
			{
				trSustainabilityConfig config = new trSustainabilityConfig()
				{
					Type = 1,
					ValueInt = 5,
					ValueString = ""
				};

				bool isnew = true;
				trSustainabilityConfig? objConfig = await Context.SustainabilityConfig.Where(w => w.Type == 1).AsTracking().FirstOrDefaultAsync();
				if (objConfig != null)
				{
					isnew = false;
					config = objConfig;
				}
				config.ValueInt = data.Time;
				config.UpdatedBy = auditable.UpdatedBy;
				config.UpdatedByName = auditable.UpdatedByName + "";
				config.UpdatedDate = auditable.UpdatedDate;
				if (isnew)
				{
					config.Id = Guid.NewGuid();
					config.CreatedBy = auditable.CreatedBy;
					config.CreatedByName = auditable.CreatedByName + "";
					config.CreatedDate = auditable.CreatedDate;
					Context.SustainabilityConfig.Add(config);
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
