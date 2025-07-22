using System.Linq.Dynamic.Core;
using Microsoft.EntityFrameworkCore;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Contracts.DataModel.EventsLogRepository;
using TCCTOBK.OperationBackend.Application.Exceptions;
using TCCTOBK.OperationBackend.Application.Features.Operation.UsageMonitoring.EventLogs.Command.CreateEventLog;
using TCCTOBK.OperationBackend.Application.Features.Operation.UsageMonitoring.Query.EventsLog;
using TCCTOBK.OperationBackend.Application.Helper.Service;
using TCCTOBK.OperationBackend.Application.Helper.Table;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Application.Repositories;
internal class EventsLogRepository : BaseRepository<EventsLog>, IEventsLogRepository
{

	private readonly IClientSiteService _clientSiteService;

	public EventsLogRepository(ITCCTOBKContext context, IClientSiteService clientSiteService) : base(context)
	{
		_clientSiteService = clientSiteService;
	}

	public async Task<long> GetLastRow()
	{
		var query = GetByIdQueryBuilder();
		var result = await query.OrderByDescending(e => e.Time).FirstOrDefaultAsync();
		if (result == null) return 0;
		var time = ConvertDateTimeToUnixTimeMilliseconds(result.Time);
		return time;
	}

	public async Task<int> CountGroupUser()
	{
		var query = GetByIdQueryBuilder();
		var groupedResult = await query
			.Where(x => x.Type == "LOGIN" && x.Time.Date == DateTime.Now.Date)
			.GroupBy(x => x.Username)
			.Select(g => new { Username = g.Key, Count = g.Count() })
			.CountAsync();
		return groupedResult;
	}

	public async Task<int> GetCountInDay(DateTime date, List<Guid>? ids = null)
	{
		var query = GetAllQueryBuilder(null, null, ids);
		query = query.Where(x => x.Time.Date == date.Date);
		return await query.CountAsync();
	}

	public Task<List<EventsLog>> GetAll(Guid? username, DateTime? startDate)
	{
		var query = GetAllQueryBuilder(startDate, username, null);
		return query.ToListAsync();
	}

	public Task<int> GetAllCount(Guid? username, DateTime? startDate)
	{
		var query = GetAllQueryBuilder(startDate, username, null);
		return query.CountAsync();
	}
	private IQueryable<EventsLog> GetAllQueryBuilder(DateTime? startDate, Guid? username, List<Guid>? ids)
	{
		var query = Db.AsQueryable();
		if (startDate != null)
		{
			query = query.Where(x => x.Time >= startDate);
		}
		if (username != null)
		{
			query = query.Where(x => x.Username == username);
		}
		if (ids != null)
		{
			query = query.Where(x => ids.Contains(x.Username));
		}
		return query;
	}

	private IQueryable<EventsLog> GetByIdQueryBuilder()
	{
		var query = Db.AsTracking();
		return query;
	}
	public async Task<EventsLog> GetById(int id)
	{
		var query = GetByIdQueryBuilder();
		var result = await query.FirstOrDefaultAsync(x => x.Id == id);
		if (result == null) throw new NotFoundException("ไม่พบ Staff");
		return result;
	}

	public async Task<List<SummaryGroupModel>> CountGroupUserList(DateTime date)
	{
		var query = GetByIdQueryBuilder();
		var groupedResult = await query
			.Where(x => x.Type == "LOGIN" && x.Time.AddHours(7).Date == date.Date && x.CSID == _clientSiteService.ClientSiteId)
			.GroupBy(x => x.Username)
			.Select(g => new SummaryGroupModel { Username = g.Key, Count = g.Count() })
			.ToListAsync();
		return groupedResult;
	}

	public async Task<List<SummaryGroupModel>> CountGroupUserListWithError(DateTime date)
	{
		var query = GetByIdQueryBuilder();
		var groupedResult = await query
			.Where(x => x.Type == "LOGIN" && x.Time.AddHours(7).Date == date.Date && x.CSID == _clientSiteService.ClientSiteId)
			.GroupBy(x => x.Username)
			.Select(g => new SummaryGroupModel { Username = g.Key, Count = g.Count() })
			.ToListAsync();
		if (groupedResult.Count == 0) throw new ArgumentNullException("Out of Log Data");
		return groupedResult;
	}

	public async Task<Dictionary<string,SummaryGroupModel>> CountGroupUserList2(DateTime date)
	{
		var query = GetByIdQueryBuilder();
		var groupedResult = await query
			.Where(x => x.Type == "LOGIN" && x.Time.Date == date.Date && x.CSID == _clientSiteService.ClientSiteId)
			.GroupBy(x => x.Username)
			.Select(g => new SummaryGroupModel { Username = g.Key, Count = g.Count() })
			.ToListAsync();
			var patten = new Dictionary<string,SummaryGroupModel>();
			foreach (var item in groupedResult)
			{
				patten[item.Username.ToString()] = item;
			}
		return patten;
	}

	public async Task<bool> FindLoginToDay(string id, DateTime date)
	{
		var query = GetByIdQueryBuilder();
		var result = query.FirstOrDefault(x => x.Username == Guid.Parse(id) && x.Time.AddHours(7).Date == date.Date && x.CSID == _clientSiteService.ClientSiteId);
		if (result == null) return false;
		return true;
	}
	public Task<List<EventsLog>> Paginate(DateTime? startDate, Guid? username, TableState state)
	{
		var query = GetAllQueryBuilder(startDate, username, null);
		// if (!string.IsNullOrEmpty(state.OrderingName))
		// {
		// 	query = query.OrderBy(state.OrderingName);
		// }
		return query.Skip(state.Skip).Take(state.Take).ToListAsync();
	}

	public Task<int> DeleteStaff(int id)
	{
		return Db.Where(x => x.Id == id && x.CSID == _clientSiteService.ClientSiteId).ExecuteDeleteAsync();
	}
	public DateTime ConvertUnixTimeMillisecondsToDateTime(long unixTimeMilliseconds)
	{
        // Unix timestamp is milliseconds past epoch
        DateTime dateTime = DateTimeOffset.FromUnixTimeMilliseconds(unixTimeMilliseconds).UtcDateTime;
		return dateTime;
	}
	public long ConvertDateTimeToUnixTimeMilliseconds(DateTime dateTime)
	{
		DateTimeOffset dateTimeOffset = new DateTimeOffset(dateTime).UtcDateTime;
		return dateTimeOffset.ToUnixTimeMilliseconds();
	}
	public async Task<string> CreateEventsLogFromApi(List<EventsLogResult> data)
	{
		var lastTime = await GetLastRow();
		var newEventsLogs = data.Where(p => p.Time > lastTime).Select(x => new EventsLog
		{
			Time = ConvertUnixTimeMillisecondsToDateTime(x.Time),
			IpAddress = x.IpAddress ?? string.Empty,
			AuthMethod = x.Details.AuthMethod ?? string.Empty,
			TokenId = x.Details.TokenId,
			Type = x.Type ?? string.Empty,
			GrantType = x.Details.GrantType ?? string.Empty,
			RefreshTokenType = x.Details.RefreshTokenType ?? string.Empty,
			Scope = x.Details.Scope ?? string.Empty,
			RefreshTokenId = x.Details.RefreshTokenId,
			ClientAuthMethod = x.Details.ClientAuthMethod ?? string.Empty,
			Username = x.Details.Username,
			CSID = _clientSiteService.ClientSiteId
		}).ToList();
		await Db.AddRangeAsync(newEventsLogs);

        return "Events logs created successfully";
	}
	
	public async Task<string> CreateEventsLog(CreateEventlogCommand data)
	{
		var newEventsLogs = new EventsLog()
		{
			Time = data.Time ?? DateTime.UtcNow,
			IpAddress = data.ipAddress ?? string.Empty,
			AuthMethod = data.AuthMethod ?? string.Empty,
			TokenId = data.TokenId ?? Guid.Empty,
			Type = data.Type ?? string.Empty,
			GrantType = data.GrantType ?? string.Empty,
			RefreshTokenType = data.RefreshTokenType ?? string.Empty,
			Scope = data.Scope ?? string.Empty,
			RefreshTokenId = data.RefreshTokenId ?? Guid.Empty,
			ClientAuthMethod = data.ClientAuthMethod ?? string.Empty,
			Username = data.UserName ?? Guid.Empty,
			CSID = data.CSID
		};
		await Db.AddAsync(newEventsLogs);
		return "Events logs created successfully";
	}
	
}