using Microsoft.EntityFrameworkCore;
using Minio.DataModel.Notification;
using System.Data;
using System.Linq.Dynamic.Core;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Exceptions;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;
using TCCTOBK.OperationBackend.Application.Helper.Table;
using TCCTOBK.OperationBackend.Domain.Entities;
using TCCTOBK.OperationBackend.Application.Contracts.DataModel.TaskRepository;
using TCCTOBK.OperationBackend.Application.Helper.Service;

namespace TCCTOBK.OperationBackend.Application.Repositories;
internal class TaskRepository : BaseRepository<trTask>, ITaskRepository
{

	private readonly IClientSiteService _clientSiteService;

	public TaskRepository(ITCCTOBKContext context, IClientSiteService clientSiteService) : base(context)
	{
		_clientSiteService = clientSiteService;
	}

	private IQueryable<trTask> GetAllQueryBuilder(Guid? memberId, string? filter, List<Guid>? idList, string? dateStart, string? dateEnd, int? status)
	{
		var query = Db.AsQueryable();
		if (status != null)
		{
			query = query.Where(x => x.StatusId == status);
		}
		if (memberId != null)
		{
			query = query.Where(x => x.MemberId == memberId);
		}
		if (dateStart != null)
		{
			DateTime startDate = DateTime.ParseExact(dateStart, "yyyy-MM-dd HH:mm:ss", System.Globalization.CultureInfo.InvariantCulture);
			query = query.Where(x => x.StartDate >= startDate);
		}
		if (dateEnd != null)
		{
			DateTime endDate = DateTime.ParseExact(dateEnd, "yyyy-MM-dd HH:mm:ss", System.Globalization.CultureInfo.InvariantCulture);
			query = query.Where(x => x.EndDate <= endDate);
		}
		if (!string.IsNullOrEmpty(filter))
		{
			query = query.Where(x => x.Id.ToString().ToLower().Contains(filter.ToLower()) || x.Name.ToLower().Contains(filter.ToLower()));
		}
		if (idList != null && idList.Count > 0)
		{
			query = query.Where(x => idList.Contains(x.Id));
		}
		return query;
	}
	public Task<int> GetAllCount(Guid? userId, string? filter, List<Guid>? idList, string? dateStart, string? dateEnd, int? status)
	{
		var query = GetAllQueryBuilder(userId, filter, idList, dateStart, dateEnd, status);
		return query.CountAsync();
	}

	public Task<Dictionary<int, int>> GetStatusCount(Guid? userId, string? filter, List<Guid>? idList, string? dateStart, string? dateEnd, int? status)
	{
		var query = GetAllQueryBuilder(userId, filter, idList, dateStart, dateEnd, status);
		var statusCounts = query.GroupBy(x => x.StatusId).ToDictionaryAsync(g => g.Key, g => g.Count());

		return statusCounts;
	}

	private IQueryable<trTask> GetByIdQueryBuilder(Guid id, bool scope)
	{
		var query = Db.AsTracking();
		if (scope == true)
		{
			query = query.Include(x => x.location).Include(x => x.trTaskSubtask).ThenInclude(x => x.trSubtask).ThenInclude(x => x.trSubtaskAction).ThenInclude(x => x.trAction).ThenInclude(x => x.mtActionType);
		}
		return query;
	}
	public async Task<trTask> GetById(Guid id, bool scope)
	{
		var query = GetByIdQueryBuilder(id, scope);
		var result = await query.FirstOrDefaultAsync(x => x.Id == id);
		if (result == null) throw new NotFoundException("ไม่พบ Task");
		return result;
	}

	public Task<bool> CheckDuplicate(string name)
	{
		return Db.AnyAsync(x => x.Name == name);
	}

	public Task<bool> CheckDuplicate(Guid id, string name)
	{
		return Db.AnyAsync(x => x.Id != id && x.Name == name);
	}

	public async Task<trTask> UpdateById(Guid id)
	{
		var result = await Db.AsTracking().FirstOrDefaultAsync(x => x.Id == id);
		if (result == null) throw new NotFoundException("ไม่พบ Task");
		return result;
	}

	public async Task<Guid> UpdateTaskById(UpdateTaskModel task, AuditableModel auditable)
	{
		var m = await UpdateById(task.TID);
		if (task.Name != null)
		{
			m.Name = task.Name;
		}
		if (task.StatusId != null)
		{
			m.StatusId = task.StatusId;
		}
		if (task.StartDate != null)
		{
			m.StartDate = task.StartDate;
		}
		if (task.EndDate != null)
		{
			m.EndDate = task.EndDate;
		}
		if (task.LocationId != null && task.LocationId != Guid.Empty)
		{
			m.LocationId = task.LocationId;
		}
		if (task.MemberId != null && task.MemberId != Guid.Empty)
		{
			m.MemberId = task.MemberId;
		}
		if (task.CompleteDate != null)
		{
			m.CompleteDate = task.CompleteDate;
		}
		if (task.IsLate != null)
		{
			m.IsLate = task.IsLate;
		}
		if (task.AcknowledgeDate != null)
		{
			m.AcknowledgeDate = task.AcknowledgeDate;
		}
		m.UpdatedDate = auditable.UpdatedDate;
		m.UpdatedBy = auditable.UpdatedBy;
		m.UpdatedByName = auditable.UpdatedByName!;
		m.CancelReason = task.CancelReason;
		m.CSID = _clientSiteService.ClientSiteId;
		return m.Id;
	}

	public async Task<Guid> CreateTask(CreateTaskModel task, AuditableModel auditable)
	{
		var newTaskId = Guid.NewGuid();
		var newTask = new trTask()
		{
			Id = newTaskId,
			Name = task.Name,
			StatusId = task.StatusId,
			LocationId = task.LocationId,
			StartDate = task.StartDate,
			EndDate = task.EndDate,
			MemberId = task.MemberId,
			CreatedBy = auditable.CreatedBy,
			CreatedByName = auditable.CreatedByName!,
			CreatedDate = auditable.CreatedDate,
			UpdatedBy = auditable.UpdatedBy,
			UpdatedByName = auditable.UpdatedByName!,
			UpdatedDate = auditable.UpdatedDate,
			CSID = _clientSiteService.ClientSiteId
		};
		Db.Add(newTask);
		return newTaskId;
	}

	public async Task RemoveTask(Guid tid)
	{
		var dataRemove = Db.AsTracking().Where(x => x.Id == tid && x.CSID == _clientSiteService.ClientSiteId);
		Db.RemoveRange(dataRemove);
	}

	public Task<List<trTask>> GetAll(Guid? memberId, string? filter, List<Guid>? idList, string? dateStart, string? dateEnd, TableState state, int? status)
	{
		var query = GetAllQueryBuilder(memberId, filter, idList, dateStart, dateEnd, status);

		if (!string.IsNullOrEmpty(state.OrderingName))
		{
			query = query.OrderBy(state.OrderingName);
		}
		return query.Skip(state.Skip).Take(state.Take).ToListAsync();
	}

}