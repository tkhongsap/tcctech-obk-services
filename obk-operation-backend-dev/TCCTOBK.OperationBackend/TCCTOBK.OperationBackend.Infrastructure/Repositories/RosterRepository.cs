
using System.Linq.Dynamic.Core;
using Microsoft.EntityFrameworkCore;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Contracts.DataModel.RosterRepository;
using TCCTOBK.OperationBackend.Application.Exceptions;
using TCCTOBK.OperationBackend.Application.Features.Operation.UsageMonitoring.Roster.Command.UpsertRoster;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;
using TCCTOBK.OperationBackend.Application.Helper.Service;
using TCCTOBK.OperationBackend.Application.Helper.Table;
using TCCTOBK.OperationBackend.Domain.Entities;
namespace TCCTOBK.OperationBackend.Application.Repositories;
internal class RosterRepository : BaseRepository<trRoster>, IRosterRepository
{

	private readonly IClientSiteService _clientSiteService;

	public RosterRepository(ITCCTOBKContext context, IClientSiteService clientSiteService) : base(context)
	{
		_clientSiteService = clientSiteService;
	}

	public Task<List<trRoster>> GetAll(string? component, DateTime? dateCheck)
	{
		var query = GetAllQueryBuilder(component, dateCheck, null);
		return query.ToListAsync();
	}

	public Task<List<trRoster>> GetRosterWithActive()
	{
		var query = GetAllQueryBuilder(null, null, null);
		query = query.Where(x => x.EndDateTime == null && x.IsActive == true); ;
		return query.ToListAsync();
	}

	private IQueryable<trRoster> GetAllQueryBuilder(string? component, DateTime? dateCheck, Guid? id)
	{
		var query = Db.AsQueryable();
		query = query.Where(x => x.EndDateTime == null && x.CSID == _clientSiteService.ClientSiteId);
		if (component != null)
		{
			query = query.Where(x => x.Component == component);
		}
		if (dateCheck != null)
		{
			query = query.Where(x => x.StartDateTime.Date == dateCheck.Value.Date);
		}
		if (id != null)
		{
			query = query.Where(x => x.Id == id);
		}
		return query;
	}

	public Task<int> GetAllCount(string? component, DateTime? dateCheck, Guid? id)
	{
		var query = GetAllQueryBuilder(component, dateCheck, id);
		query = query.Where(x => x.EndDateTime == null && x.StartDateTime > DateTime.Now);
		return query.CountAsync();
	}

	public async Task<SumWeekDayWeekEndModel> GetSumWeekDayAndWeekEnd(string? component, DateTime? dateCheck)
	{
		var query = GetAllQueryBuilder(component, null, null);
		var result = await query
			.Where(x => x.EndDateTime == null)
			.GroupBy(x => 1)
			.Select(g => new
			{
				WeekDay = g.Sum(x => x.WeekDay),
				WeekEnd = g.Sum(x => x.WeekEnd)
			})
			.FirstOrDefaultAsync();

		return new SumWeekDayWeekEndModel()
		{
			WeekDay = result?.WeekDay ?? 0,
			WeekEnd = result?.WeekEnd ?? 0
		};
	}

	public Task<List<trRoster>> Paginate(string? component, TableState state)
	{
		var query = GetAllQueryBuilder(component, null, null);
		query = query.Where(x => x.EndDateTime == null);

		if (!string.IsNullOrEmpty(state.OrderingName))
		{
			query = query.OrderBy(state.OrderingName);
		}
		return query.Skip(state.Skip).Take(state.Take).ToListAsync();
	}

	public async Task<trRoster> GetById(Guid id)
	{
		var result = await Db.AsTracking().FirstOrDefaultAsync(x => x.Id == id);
		if (result == null) throw new NotFoundException("ไม่พบ Roster นี้");
		return result;
	}

	public async Task<trRoster> GetByIdAndEndTime(Guid id)
	{
		var result = await Db.AsTracking().FirstOrDefaultAsync(x => x.Id == id && x.EndDateTime == null);
		if (result == null) throw new NotFoundException("ไม่พบ Roster นี้");
		return result;
	}

	public async Task<string> UpsertRoster(UpsertRosterCommand data)
	{
		if (data.Component == null) throw new BadRequestException();
		var result = await Db.AsTracking().FirstOrDefaultAsync(x => x.Component == data.Component && x.EndDateTime == null);
		if (result != null)
		{
			result.EndDateTime = DateTime.Now;
			Db.Update(result);
			var newAP = new trRoster()
			{
				Component = data.Component,
				LocationCode = data.LocationCode ?? "",
				WeekDay = data.WeekDay ?? 0,
				WeekEnd = data.WeekEnd ?? 0,
				IsActive = data.IsActive,
				StartDateTime = data.StartDateTime ?? DateTime.Now,
				CSID = _clientSiteService.ClientSiteId
			};
			Db.Add(newAP);
		}
		else
		{
			var newAP = new trRoster()
			{
				Component = data.Component,
				LocationCode = data.LocationCode ?? "",
				WeekDay = data.WeekDay ?? 0,
				WeekEnd = data.WeekEnd ?? 0,
				IsActive = data.IsActive,
				StartDateTime = data.StartDateTime ?? DateTime.Now,
				CSID = _clientSiteService.ClientSiteId
			};
			Db.Add(newAP);
		}


		return "save roster success";
	}

	public async Task UpdateRoster(UpsertRosterCommand data, AuditableModel auditable)
	{
		if (data.Id == null) throw new BadRequestException();
		var updatedata = await Db.AsTracking().Where(x => x.Id == data.Id && x.EndDateTime == null).FirstOrDefaultAsync();
		if (updatedata == null) throw new BadRequestException();
		updatedata.EndDateTime = DateTime.Now;
		updatedata.CSID = _clientSiteService.ClientSiteId;
		Db.Update(updatedata);
	}

	public Task<int> DeleteRoster(Guid id)
	{
		return Db.Where(x => x.Id == id && x.CSID == _clientSiteService.ClientSiteId).ExecuteDeleteAsync();
	}

}
