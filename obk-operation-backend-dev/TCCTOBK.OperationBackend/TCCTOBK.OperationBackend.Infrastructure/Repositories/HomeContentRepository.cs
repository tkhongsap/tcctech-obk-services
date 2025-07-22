using Microsoft.EntityFrameworkCore;
using System.Linq.Dynamic.Core;
using TCCTOBK.OperationBackend.Application;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;
using TCCTOBK.OperationBackend.Application.Helper.Table;
using TCCTOBK.OperationBackend.Application.Repositories;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Infrastructure;

public class HomeContentRepository : BaseRepository<mtHomeContent>, IHomeContentRepository
{
	public HomeContentRepository(ITCCTOBKContext context) : base(context)
	{

	}
	public async Task Create(HomeContentUpsert data, AuditableModel auditable)
	{
		var homecontent = new mtHomeContent()
		{
			HCID = Guid.NewGuid(),
			Version = data.Version,
			ImageURL = data.ImageURL,
			IsVisible = data.IsVisible,
			Note = data.Note,
			RemoteConfigDataJson = data.RemoteConfigDataJson,
			RemoteConfigResponseDataJson = data.RemoteConfigResponseDataJson,
			FileName = data.FileName,
			OriginalFileName = data.OriginalFileName,
			CreatedBy = auditable.CreatedBy,
			CreatedByName = auditable.CreatedByName!,
			CreatedDate = auditable.CreatedDate,
			UpdatedBy = auditable.UpdatedBy,
			UpdatedByName = auditable.UpdatedByName!,
			UpdatedDate = auditable.UpdatedDate,

		};
		await Db.AddAsync(homecontent);
	}

	public async Task<List<mtHomeContent>> GetList(TableState state)
	{
		var query = Db.OrderByDescending(x => x.UpdatedDate).AsQueryable();
		if (!string.IsNullOrEmpty(state.OrderingName))
		{
			query = query.OrderBy(state.OrderingName);
		}
		return await query.Skip(state.Skip).Take(state.Take).ToListAsync();
	}
	public Task<int> GetListCount()
	{
		return Db.CountAsync();
	}

	public async Task<mtHomeContent> Get(Guid id)
	{
		return await Db.FirstAsync(x => x.HCID == id);
	}

	public async Task<mtHomeContent> GetCurrentVersion()
	{
		var lhomecontent = Db.OrderByDescending(x => x.UpdatedDate);
		return await lhomecontent.FirstOrDefaultAsync(x => x.IsVisible);
	}
}
