using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Domain.Entities;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;
using Microsoft.EntityFrameworkCore;
using Google.Apis.Util;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.DigitalLibrary.Model;

namespace TCCTOBK.OperationBackend.Application.Repositories;
internal class SustainabilityMobileRepository : BaseRepository<trSustainabilityBanner>, ISustainabilityMobileRepository
{
	public SustainabilityMobileRepository(ITCCTOBKContext context) : base(context)
	{
	}

	public async Task<List<trSustainabilityBanner>> GetBannerAll()
	{
		IQueryable<trSustainabilityBanner> lstData = Db.Where(w => !w.IsDelete).OrderBy(o => o.Type).AsNoTracking();
		return await lstData.ToListAsync();
	}
	public async Task<List<trSustainabilityPRBanner>> GetPRBannerAll()
	{
		IQueryable<trSustainabilityPRBanner> lstData = Context.SustainabilityPRBanner.Where(w => w.IsActive && !w.IsDelete).OrderBy(o => o.Order).AsNoTracking();
		return await lstData.ToListAsync();
	}
	public async Task<List<trSustainabilityCMS>> GetCMSAll()
	{
		IQueryable<trSustainabilityCMS> lstData = Context.SustainabilityCMS.Where(w => w.IsActive && !w.IsDelete).OrderBy(o => o.Order).AsNoTracking();
		return await lstData.ToListAsync();
	}
	public async Task<List<trSustainabilityCMSContent>> GetCMSContentAll()
	{
		IQueryable<trSustainabilityCMSContent> lstData = Context.SustainabilityCMSContent.Where(w => w.IsActive && !w.IsDelete).OrderBy(o => o.Order).AsNoTracking();
		return await lstData.ToListAsync();
	}
	public async Task<List<trSustainabilityLibrary>> GetDigitalLibraryAll()
	{
		IQueryable<trSustainabilityLibrary> lstData = Context.SustainabilityLibrary.Where(w => w.IsActive && !w.IsDelete).OrderBy(o => o.Order).AsNoTracking();
		return await lstData.ToListAsync();
	}
	public async Task<List<trSustainabilityLibraryFile>> GetDigitalLibraryFileAll()
	{
		IQueryable<trSustainabilityLibraryFile> lstData = Context.SustainabilityLibraryFile.Where(w => w.IsActive && !w.IsDelete).OrderBy(o => o.Order).AsNoTracking();
		return await lstData.ToListAsync();
	}
	public async Task<List<trSustainabilityConfig>> GetConfigAll()
	{
		IQueryable<trSustainabilityConfig> lstData = Context.SustainabilityConfig.AsNoTracking();
		return await lstData.ToListAsync();
	}
}
