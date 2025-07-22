using Microsoft.EntityFrameworkCore;
using System.Data;
using System.Linq.Dynamic.Core;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Exceptions;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;
using TCCTOBK.OperationBackend.Domain.Entities;
using TCCTOBK.OperationBackend.Application.Contracts.DataModel.SchedulePlanRepository;
using TCCTOBK.OperationBackend.Application.Helper.Table;
using Newtonsoft.Json;
using TCCTOBK.OperationBackend.Application.Helper.Service;

namespace TCCTOBK.OperationBackend.Application.Repositories;
internal class SchedulePlanRepository : BaseRepository<trSchedulePlan>, ISchedulePlanRepository
{

	private readonly IClientSiteService _clientSiteService;

	public SchedulePlanRepository(ITCCTOBKContext context, IClientSiteService clientSiteService) : base(context)
	{
		_clientSiteService = clientSiteService;
	}

	public async Task<List<Guid>> CreateSchedulePlan(List<CreateSchedulePlanModel> data, AuditableModel auditable)
	{
		List<Guid> newSchedulePlanIds = new List<Guid>();
		foreach (var item in data)
		{
			var newSchedulePlanId = Guid.NewGuid();
			var newSchedulePlan = new trSchedulePlan()
			{
				Id = newSchedulePlanId,
				Route = item.Route,
				StartTime = item.StartTime,
				EndTime = item.EndTime,
				MID = item.MemberId,
				Frequency = JsonConvert.SerializeObject(item.Frequency),
				IsActive = item.IsActive,
				CreatedBy = auditable.CreatedBy,
				CreatedByName = auditable.CreatedByName!,
				CreatedDate = auditable.CreatedDate,
				UpdatedBy = auditable.UpdatedBy,
				UpdatedByName = auditable.UpdatedByName!,
				UpdatedDate = auditable.UpdatedDate,
				CSID = _clientSiteService.ClientSiteId
			};
			Db.Add(newSchedulePlan);
			newSchedulePlanIds.Add(newSchedulePlanId);
		}
		return newSchedulePlanIds;
	}

	public async Task UpdateSchedulePlan(UpdateSchedulePlanModel data, AuditableModel auditable)
	{
		var fSchedulePlan = await Db.AsTracking().FirstOrDefaultAsync(x => x.Id == data.SDPID) ?? throw new NotFoundException("ไม่พบ Schedule Plan");

		fSchedulePlan.Route = data.Route;
		fSchedulePlan.MID = data.MemberId;
		if (data.StartTime != null) fSchedulePlan.StartTime = (TimeSpan)data.StartTime;
		if (data.EndTime != null) fSchedulePlan.EndTime = (TimeSpan)data.EndTime;
		if (data.Frequency != null && data.Frequency.Count > 0) fSchedulePlan.Frequency = JsonConvert.SerializeObject(data.Frequency);
		fSchedulePlan.IsActive = data.IsActive;
		fSchedulePlan.UpdatedBy = auditable.UpdatedBy;
		fSchedulePlan.UpdatedByName = auditable.UpdatedByName!;
		fSchedulePlan.UpdatedDate = auditable.UpdatedDate;
		fSchedulePlan.CSID = _clientSiteService.ClientSiteId;
	}

	public async Task<int> RemoveSchedulePlan(Guid sdpid)
	{
		return await Db.Where(x => x.Id == sdpid && x.CSID == _clientSiteService.ClientSiteId).ExecuteDeleteAsync();
	}

	public Task<List<trSchedulePlan>> GetAll(Guid? sdpid, string? filter, List<Guid>? idList, string? day, System.TimeSpan? timeStart, System.TimeSpan? timeEnd, Boolean scope, TableState state, bool? status)
	{
		var query = GetAllQueryBuilder(sdpid, filter, idList, day, timeStart, timeEnd, scope, status);
		if (!string.IsNullOrEmpty(state.OrderingName))
		{
			query = query.OrderBy(state.OrderingName);
		}
		return query.Skip(state.Skip).Take(state.Take).ToListAsync();
	}

	private IQueryable<trSchedulePlan> GetAllQueryBuilder(Guid? sdpid, string? filter, List<Guid>? idList, string? day, System.TimeSpan? escapedTimeStart, System.TimeSpan? escapedTimeEnd, Boolean scope, bool? status)
	{
		var query = Db.AsQueryable();
		if (scope)
		{
			query = query.Include(x => x.trActivityProcedure).Include(x => x.taMember);
		}
		if (sdpid != null)
		{
			query = query.Where(x => x.Id == sdpid);
		}
		if (!string.IsNullOrEmpty(filter))
		{
			query = query.Where(x => x.Id.ToString().ToLower().Contains(filter.ToLower()) || x.Route.ToLower().Contains(filter.ToLower()));
		}
		if (idList != null && idList.Count > 0)
		{
			query = query.Where(x => idList.Contains(x.Id));
		}
		if (day != null)
		{
			var escapedDay = JsonConvert.ToString(day);
			query = query.Where(e => EF.Functions.JsonContains(e.Frequency, escapedDay));
		}
		if (status != null)
		{
			query = query.Where(x => x.IsActive == status);
		}
		if (escapedTimeStart != null && escapedTimeEnd != null)
		{
			query = escapedTimeStart > escapedTimeEnd
				? query.Where(x => x.StartTime >= escapedTimeStart || x.EndTime <= escapedTimeEnd)
				: query.Where(x => x.StartTime >= escapedTimeStart && x.EndTime <= escapedTimeEnd && x.EndTime >= x.StartTime);
		}

		return query;
	}
	public Task<int> GetAllCount(Guid? sdpid, string? filter, List<Guid>? idList, bool? status)
	{
		var query = GetAllQueryBuilder(sdpid, filter, idList, null, null, null, false, status);
		return query.CountAsync();
	}
	private IQueryable<trSchedulePlan> GetByIdQueryBuilder(bool scope)
	{
		var query = Db.AsTracking();
		if (scope)
		{
			query = query.Include(x => x.trActivityProcedure).Include(x => x.taMember);
		}
		return query;
	}
	public async Task<trSchedulePlan> GetById(Guid id, bool scope)
	{
		var query = GetByIdQueryBuilder(scope);
		var result = await query.FirstOrDefaultAsync(x => x.Id == id);
		if (result == null) throw new NotFoundException("ไม่พบ Schedule Plan");
		return result;
	}
}
