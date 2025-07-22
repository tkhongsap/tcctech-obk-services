using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace TCCTOBK.OperationBackend.Application.Repositories;
internal class MarcomMobileRepository : BaseRepository<trMarcomCMSExplore>, IMarcomMobileRepository
{
	public MarcomMobileRepository(ITCCTOBKContext context) : base(context)
	{
	}

	public async Task<List<trMarcomCMSExplore>> GetExploreAll()
	{
		IQueryable<trMarcomCMSExplore> lstData = Db.Where(w => w.IsActive && !w.IsDelete).OrderBy(o => o.Order).AsNoTracking();
		return await lstData.ToListAsync();
	}
	public async Task<List<trMarcomCMSExploreContent>> GetExploreContentAll()
	{
		IQueryable<trMarcomCMSExploreContent> lstData = Context.MarcomCMSExploreContent.Where(w => w.IsActive && !w.IsDelete).OrderBy(o => o.Order).AsNoTracking();
		return await lstData.ToListAsync();
	}
	public async Task<List<trMarcomCMSTag>> GetTagAll()
	{
		IQueryable<trMarcomCMSTag> lstData = Context.MarcomCMSTag.Where(w => !w.IsDelete).OrderBy(o => o.Order).AsNoTracking();
		return await lstData.ToListAsync();
	}
	public async Task<List<trMarcomCMSWhatHappenCategory>> GetWhatHappenCategoryAll()
	{
		IQueryable<trMarcomCMSWhatHappenCategory> lstData = Context.MarcomCMSWhatHappenCategory.Where(w => w.IsActive && !w.IsDelete).OrderBy(o => o.Order).AsNoTracking();
		return await lstData.ToListAsync();
	}
	public async Task<List<trMarcomCMSWhatHappenContent>> GetWhatHappenContentAll()
	{
		IQueryable<trMarcomCMSWhatHappenContent> lstData = Context.MarcomCMSWhatHappenContent.Where(w => w.IsActive && !w.IsDelete).OrderBy(o => o.Order).AsNoTracking();
		return await lstData.ToListAsync();
	}
	public async Task<List<trMarcomCMSWhatHappenSub>> GetWhatHappenSubAll()
	{
		IQueryable<trMarcomCMSWhatHappenSub> lstData = Context.MarcomCMSWhatHappenSub.Where(w => w.IsActive && !w.IsDelete).OrderBy(o => o.Order).AsNoTracking();
		return await lstData.ToListAsync();
	}
	public async Task<List<trMarcomPRBanner>> GetPRBannerAll()
	{
		IQueryable<trMarcomPRBanner> lstData = Context.MarcomPRBanner.Where(w => w.IsActive && !w.IsDelete).OrderBy(o => o.Order).AsNoTracking();
		return await lstData.ToListAsync();
	}
	public async Task<List<trMarcomSpecialEvent>> GetSpecialEventAll()
	{
		IQueryable<trMarcomSpecialEvent> lstData = Context.MarcomSpecialEvent.Where(w => w.IsActive && !w.IsDelete).OrderBy(o => o.Order).AsNoTracking();
		return await lstData.ToListAsync();
	}
	public async Task<List<trMarcomConfig>> GetConfigAll()
	{
		IQueryable<trMarcomConfig> lstData = Context.MarcomConfig.AsNoTracking();
		return await lstData.ToListAsync();
	}
}
