using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.Data;
using System.Linq.Dynamic.Core;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Domain;
using TCCTOBK.OperationBackend.Application.Contracts.DataModel.CasesRepository;
using TCCTOBK.OperationBackend.Application.Helper.Table;
using TCCTOBK.OperationBackend.Application.Exceptions;
using TCCTOBK.OperationBackend.Application.Helper.Service;

namespace TCCTOBK.OperationBackend.Application.Repositories;
internal class CaseTasksRepository : BaseRepository<trCaseTasks>, ICaseTasksRepository
{

	private readonly IClientSiteService _clientSiteService;

	public CaseTasksRepository(ITCCTOBKContext context, IClientSiteService clientSiteService) : base(context)
	{
		_clientSiteService = clientSiteService;
	}

	public async Task<int> CreateCaseTasks(CaseIncidentTaskItem task)
	{
		var newCaseTasks = new trCaseTasks()
		{
			Id = task.Id,
			Name = task.Name,
			CaseId = task.CaseId,
			StatusCode = task.StatusCode,
			Sequence = task.Sequence,
			CreatedBy = task.CreatedBy,
			CreatedOn = DateTime.SpecifyKind(task.CreatedOn, DateTimeKind.Unspecified),
			ModifiedBy = task.ModifiedBy,
			AssignedStaffId = task.AssignedStaffId,
			AssignedStaffDisplayName = task.AssignedStaffDisplayName,
			ModifiedOn = DateTime.SpecifyKind(task.ModifiedOn, DateTimeKind.Unspecified),
			IsCritical = task.IsCritical,
			TaskCategoryId = task.TaskCategoryId,
			CSID = _clientSiteService.ClientSiteId
		};
		Db.Add(newCaseTasks);
		return task.Id;
	}
	public async Task<int> RemoveCaseTasks(int caseId)
	{
		return await Db.Where(x => x.CaseId == caseId && x.CSID == _clientSiteService.ClientSiteId).ExecuteDeleteAsync();
	}

	public Task<List<trCaseTasks>> GetAll(int? id, string? filter, List<int>? idList, int? status, bool scope, TableState state, int? assignedStaffId, int? locationId, int? priorityLevelId, int? caseStatusCode, int? caseId)
	{
		var query = GetAllQueryBuilder(id, filter, idList, status, scope, assignedStaffId, locationId, priorityLevelId, caseStatusCode, caseId);
		if (!string.IsNullOrEmpty(state.OrderingName))
		{
			query = query.OrderBy(state.OrderingName);
		}
		return query.Skip(state.Skip).Take(state.Take).ToListAsync();
	}

	private IQueryable<trCaseTasks> GetAllQueryBuilder(int? id, string? filter, List<int>? idList, int? status, bool scope, int? assignedStaffId, int? locationId, int? priorityLevelId, int? caseStatusCode, int? caseId)
	{
		var query = Db.AsQueryable();
		if (id != null)
		{
			query = query.Where(x => x.Id == id);
		}
		if (caseId != null)
		{
			query = query.Where(x => x.CaseId == caseId);
		}
		if (status != null)
		{
			query = query.Where(x => x.StatusCode == status);
		}
		if (!string.IsNullOrEmpty(filter))
		{
			query = query.Where(x => x.Id.ToString().ToLower().Contains(filter.ToLower()) || x.Name.ToLower().Contains(filter.ToLower()) || x.AssignedStaffDisplayName.ToLower().Contains(filter.ToLower()));
		}
		if (idList != null && idList.Count > 0)
		{
			query = query.Where(x => idList.Contains(x.Id));
		}
		if (assignedStaffId != null)
		{
			query = query.Where(x => x.AssignedStaffId == assignedStaffId);
		}
		if (scope == true)
		{
			query = query.Include(x => x.trCases);
			if (locationId != null)
			{
				query = query.Where(x => x.trCases.LocationId == locationId);
			}
			if (priorityLevelId != null)
			{
				query = query.Where(x => x.trCases.PriorityLevelId == priorityLevelId);
			}
			if (caseStatusCode != null)
			{
				query = query.Where(x => x.trCases.StatusCode == caseStatusCode);
			}
		}
		return query;
	}
	public Task<int> GetAllCount(int? id, string? filter, List<int>? idList, int? status, bool scope, int? assignedStaffId, int? locationId, int? priorityLevelId, int? caseStatusCode, int? caseId)
	{
		var query = GetAllQueryBuilder(id, filter, idList, status, scope, assignedStaffId, locationId, priorityLevelId, caseStatusCode, caseId);
		return query.CountAsync();
	}

	private IQueryable<trCaseTasks> GetByIdQueryBuilder(int id, bool scope)
	{
		var query = Db.AsTracking();
		query = query.Where(x => x.Id == id);
		if (scope == true)
		{
			query = query.Include(x => x.trCases);
		}
		return query;
	}
	public async Task<trCaseTasks> GetById(int id, bool scope)
	{
		var query = GetByIdQueryBuilder(id, scope);
		var result = await query.FirstOrDefaultAsync();
		if (result == null) throw new NotFoundException("ไม่พบ Case Tasks");
		return result;
	}

	public async Task<int> RemoveCaseTasksByIds(List<int> idList)
	{
		return await Db.Where(x => idList.Contains(x.Id)).ExecuteDeleteAsync();
	}

	public async Task<trCaseTasks> UpdateById(int id)
	{
		var result = await Db.AsTracking().FirstOrDefaultAsync(x => x.Id == id);
		if (result == null) throw new NotFoundException("ไม่พบ Case Tasks");
		return result;
	}

	public async Task<int> UpdateCaseTasks(CaseIncidentTaskItem task)
	{
		var m = await UpdateById(task.Id);
		if (task.Name != null)
		{
			m.Name = task.Name;
		}
		if (task.CreatedBy != null)
		{
			m.CreatedBy = task.CreatedBy;
		}
		if (task.ModifiedBy != null)
		{
			m.ModifiedBy = task.ModifiedBy;
		}
		if (task.AssignedStaffId != null)
		{
			m.AssignedStaffId = task.AssignedStaffId;
		}
		if (task.AssignedStaffDisplayName != null)
		{
			m.AssignedStaffDisplayName = task.AssignedStaffDisplayName;
		}
		m.CaseId = task.CaseId;
		m.StatusCode = task.StatusCode;
		m.Sequence = task.Sequence;
		m.CreatedOn = task.CreatedOn;
		m.ModifiedOn = task.ModifiedOn;
		m.IsCritical = task.IsCritical;
		m.TaskCategoryId = task.TaskCategoryId;
		m.CSID = _clientSiteService.ClientSiteId;
		return task.Id;
	}

	public async Task<bool> UpdateTaskStatus(int id, int status)
	{
		var data = await Db.AsTracking().FirstOrDefaultAsync(x => x.Id == id);
		if (data == null) return false;
		data.StatusCode = status;
		return true;
	}

}
