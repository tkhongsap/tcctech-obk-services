using Microsoft.EntityFrameworkCore;
using System.Data;
using System.Linq.Dynamic.Core;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Exceptions;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;
using TCCTOBK.OperationBackend.Application.Helper.Table;
using TCCTOBK.OperationBackend.Domain.Entities;
using TCCTOBK.OperationBackend.Application.Contracts.DataModel.SubtaskRepository;

namespace TCCTOBK.OperationBackend.Application.Repositories;
internal class SubtaskRepository : BaseRepository<trSubtask>, ISubtaskRepository
{
	public SubtaskRepository(ITCCTOBKContext context) : base(context)
	{
	}

	public Task<List<trSubtask>> GetAll(string? filter, List<Guid>? idList, TableState state)
	{
		var query = GetAllQueryBuilder(filter, idList);
		if (!string.IsNullOrEmpty(state.OrderingName))
		{
			query = query.OrderBy(state.OrderingName);
		}
		return query.Skip(state.Skip).Take(state.Take).Include(x => x.trSubtaskAction).ThenInclude(x => x.trAction).ThenInclude(x => x.mtActionType).ToListAsync();
	}

	public Task<int> GetAllCount(string? filter, List<Guid>? idList)
	{
		var query = GetAllQueryBuilder(filter, idList);
		return query.CountAsync();
	}

	private IQueryable<trSubtask> GetAllQueryBuilder(string? filter, List<Guid>? idList)
	{
		var query = Db.Include(x => x.trSubtaskAction).ThenInclude(x => x.trAction).ThenInclude(x => x.mtActionType).AsQueryable();
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

	public async Task<Guid> CreateSubtask(CreateSubtaskModel subtask, AuditableModel auditable)
	{
		var newSubtaskId = Guid.NewGuid();
		var newSubtask = new trSubtask()
		{
			Id = newSubtaskId,
			Name = subtask.Name,
			StatusId = subtask.StatusId,
			CreatedBy = auditable.CreatedBy,
			CreatedByName = auditable.CreatedByName!,
			CreatedDate = auditable.CreatedDate,
			UpdatedBy = auditable.UpdatedBy,
			UpdatedByName = auditable.UpdatedByName!,
			UpdatedDate = auditable.UpdatedDate,
		};
		Db.Add(newSubtask);
		return newSubtaskId;
	}

	public async Task<List<Guid>> BulkCreateSubtask(List<CreateSubtaskModel> subtasks, AuditableModel auditable)
	{
		List<Guid> newSubtaskIds = new List<Guid>();
		foreach (var item in subtasks)
		{
			var subtask = await CreateSubtask(item, auditable);
			newSubtaskIds.Add(subtask);
		}

		return newSubtaskIds;
	}

	public async Task UpdateSubtask(UpdateSubtaskModel subtask, AuditableModel auditable)
	{
		var fSubtask = await Db.AsTracking().FirstOrDefaultAsync(x => x.Id == subtask.STID) ?? throw new NotFoundException("ไม่พบ Subtask");

		if (subtask.Name != null)
		{
			fSubtask.Name = subtask.Name;
		}
		if (subtask.StatusId != null)
		{
			fSubtask.StatusId = subtask.StatusId;
		}
		if (!string.IsNullOrEmpty(subtask.Remarks))
		{
			fSubtask.Remarks = subtask.Remarks.Trim();
		}
		fSubtask.UpdatedBy = auditable.UpdatedBy;
		fSubtask.UpdatedByName = auditable.UpdatedByName!;
		fSubtask.UpdatedDate = auditable.UpdatedDate;
	}

	public async Task RemoveSubtask(List<Guid> stids)
	{
		var dataRemove = Db.AsTracking().Where(x => stids.Contains(x.Id));
		Db.RemoveRange(dataRemove);
	}
	private IQueryable<trSubtask> GetByIdQueryBuilder(Guid id, bool scope)
	{
		var query = Db.AsTracking();
		if (scope == true)
		{
			query = query.Include(x => x.trSubtaskAction).ThenInclude(x => x.trAction).ThenInclude(x => x.mtActionType);
		}
		return query;
	}
	public async Task<trSubtask> GetById(Guid id, bool scope)
	{
		var query = GetByIdQueryBuilder(id, scope);
		var result = await query.FirstOrDefaultAsync(x => x.Id == id);
		if (result == null) throw new NotFoundException("ไม่พบ Subtask");
		return result;
	}
}
