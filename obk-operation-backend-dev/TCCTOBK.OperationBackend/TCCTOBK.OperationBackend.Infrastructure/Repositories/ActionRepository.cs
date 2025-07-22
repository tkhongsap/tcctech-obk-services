using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.Data;
using System.Linq.Dynamic.Core;
using System.Text.Json;
using System.Text.Json.Nodes;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Exceptions;
using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Model;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;
using TCCTOBK.OperationBackend.Application.Helper.Table;
using TCCTOBK.OperationBackend.Domain.Entities;
using TCCTOBK.OperationBackend.Application.Contracts.DataModel.ActionRepository;
using TCCTOBK.OperationBackend.Application.Helper.Service;

namespace TCCTOBK.OperationBackend.Application.Repositories;
internal class ActionRepository : BaseRepository<trAction>, IActionRepository
{
	private readonly IClientSiteService _clientSiteService;

	public ActionRepository(ITCCTOBKContext context, IClientSiteService clientSiteService) : base(context)
	{
		_clientSiteService = clientSiteService;
	}

	public Guid CreateAction(CreateActionModel action, AuditableModel auditable)
	{
		var newActionId = Guid.NewGuid();
		var newAction = new trAction()
		{
			Id = newActionId,
			Name = action.Name,
			Description = action.Description,
			ActionType = action.ActionType,
			MetaData = JsonConvert.SerializeObject(action.MetaData),
			CreatedBy = auditable.CreatedBy,
			CreatedByName = auditable.CreatedByName!,
			CreatedDate = auditable.CreatedDate,
			UpdatedBy = auditable.UpdatedBy,
			UpdatedByName = auditable.UpdatedByName!,
			UpdatedDate = auditable.UpdatedDate,
			CSID = _clientSiteService.ClientSiteId
		};
		Db.Add(newAction);
		return newActionId;
	}

	public async Task UpdateAction(UpdateActionModel action, AuditableModel auditable)
	{
		var fAction = await Db.AsTracking().FirstOrDefaultAsync(x => x.Id == action.AID) ?? throw new NotFoundException("ไม่พบ Action");

		fAction.Name = action.Name;
		fAction.Description = action.Description;
		fAction.MetaData = JsonConvert.SerializeObject(action.MetaData);
		fAction.UpdatedBy = auditable.UpdatedBy;
		fAction.UpdatedByName = auditable.UpdatedByName!;
		fAction.UpdatedDate = auditable.UpdatedDate;
		fAction.CSID = _clientSiteService.ClientSiteId;
	}

	public async Task<int> RemoveAction(Guid aid)
	{
		return await Db.Where(x => x.Id == aid).ExecuteDeleteAsync();
	}

	public Task<List<trAction>> GetAll(Guid? actionId, Guid? actionTypeId, string? filter, List<Guid>? idList, TableState state)
	{
		var query = GetAllQueryBuilder(actionId, actionTypeId, filter, idList);
		if (!string.IsNullOrEmpty(state.OrderingName))
		{
			query = query.OrderBy(state.OrderingName);
		}
		return query.Skip(state.Skip).Take(state.Take).ToListAsync();
	}

	private IQueryable<trAction> GetAllQueryBuilder(Guid? actionId, Guid? actionTypeId, string? filter, List<Guid>? idList)
	{
		var query = Db.AsQueryable();
		if (actionId != null)
		{
			query = query.Where(x => x.Id == actionId);
		}
		if (actionTypeId != null)
		{
			query = query.Where(x => x.ActionType == actionTypeId);
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
	public Task<int> GetAllCount(Guid? actionId, Guid? actionTypeId, string? filter, List<Guid>? idList)
	{
		var query = GetAllQueryBuilder(actionId, actionTypeId, filter, idList);
		return query.CountAsync();
	}

	private IQueryable<trAction> GetByIdQueryBuilder(Guid id, bool scope)
	{
		var query = Db.AsTracking();
		if (scope == true)
		{
			query = query.Include(x => x.mtActionType);
		}
		return query;
	}
	public async Task<trAction> GetById(Guid id, bool scope)
	{
		var query = GetByIdQueryBuilder(id, scope);
		var result = await query.FirstOrDefaultAsync(x => x.Id == id);
		if (result == null) throw new NotFoundException("ไม่พบ Action");
		return result;
	}
}
