using Microsoft.EntityFrameworkCore;
using System.Data;
using System.Linq.Dynamic.Core;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Exceptions;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;
using TCCTOBK.OperationBackend.Domain.Entities;
using TCCTOBK.OperationBackend.Application.Contracts.DataModel.ActionTypeRepository;
using TCCTOBK.OperationBackend.Application.Helper.Table;

namespace TCCTOBK.OperationBackend.Application.Repositories;
internal class ActionTypeRepository : BaseRepository<mtActionType>, IActionTypeRepository
{
	public ActionTypeRepository(ITCCTOBKContext context) : base(context)
	{
	}

	public async Task<Guid> CreateActionType(CreateActionTypeModel data, AuditableModel auditable)
	{
		var newActionTypeId = Guid.NewGuid();
		var newActionType = new mtActionType()
		{
			Id = newActionTypeId,
			Action = data.Action,
			CreatedBy = auditable.CreatedBy,
			CreatedByName = auditable.CreatedByName!,
			CreatedDate = auditable.CreatedDate,
			UpdatedBy = auditable.UpdatedBy,
			UpdatedByName = auditable.UpdatedByName!,
			UpdatedDate = auditable.UpdatedDate,
		};
		Db.Add(newActionType);
		return newActionTypeId;
	}

	public async Task UpdateActionType(UpdateActionTypeModel data, AuditableModel auditable)
	{
		var fActionType = await Db.AsTracking().FirstOrDefaultAsync(x => x.Id == data.ATID) ?? throw new NotFoundException("ไม่พบ Action Type");
		
		fActionType.Action = data.Action;
		fActionType.UpdatedBy = auditable.UpdatedBy;
		fActionType.UpdatedByName = auditable.UpdatedByName!;
		fActionType.UpdatedDate = auditable.UpdatedDate;
	}

	public async Task<int> RemoveActionType(Guid atid)
	{
		return await Db.Where(x => x.Id == atid).ExecuteDeleteAsync();
	}

	public Task<List<mtActionType>> GetAll(Guid? atid, string? filter, List<Guid>? idList, TableState state)
	{ 
		var query = GetAllQueryBuilder(atid, filter, idList);
		if (!string.IsNullOrEmpty(state.OrderingName))
		{
			query = query.OrderBy(state.OrderingName);
		}
		return query.Skip(state.Skip).Take(state.Take).ToListAsync();
	}

	private IQueryable<mtActionType> GetAllQueryBuilder(Guid? atid, string? filter, List<Guid>? idList)
	{
		var query = Db.AsQueryable();
		if (atid != null)
		{
			query = query.Where(x => x.Id == atid);
		}
		if (!string.IsNullOrEmpty(filter))
		{
			query = query.Where(x => x.Id.ToString().ToLower().Contains(filter.ToLower()) || x.Action.ToLower().Contains(filter.ToLower()));
		}
		if (idList != null && idList.Count > 0)
		{
			query = query.Where(x => idList.Contains(x.Id));
		}
		return query;
	}
	public Task<int> GetAllCount(Guid? atid, string? filter, List<Guid>? idList)
	{
		var query = GetAllQueryBuilder(atid, filter, idList);
		return query.CountAsync();
	}
	private IQueryable<mtActionType> GetByIdQueryBuilder()
	{
		var query = Db.AsTracking();
		return query;
	}
	public async Task<mtActionType> GetById(Guid id)
	{
		var query = GetByIdQueryBuilder();
		var result = await query.FirstOrDefaultAsync(x => x.Id == id);
		if (result == null) throw new NotFoundException("ไม่พบ Action Type");
		return result;
	}
}
