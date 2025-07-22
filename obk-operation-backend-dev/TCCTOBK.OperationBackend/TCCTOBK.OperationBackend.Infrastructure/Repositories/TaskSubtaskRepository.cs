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
using TCCTOBK.OperationBackend.Application.Contracts.DataModel.TaskSubtaskRepository;
using TCCTOBK.OperationBackend.Infrastructure;

namespace TCCTOBK.OperationBackend.Application.Repositories;
internal class TaskSubtaskRepository : BaseRepository<trTaskSubtask>, ITaskSubtaskRepository
{
	public TaskSubtaskRepository(ITCCTOBKContext context) : base(context)
	{
	}

	public async Task CreateTaskSubtask(List<CreateTaskSubtaskModel> fTaskSubtasks, AuditableModel auditable)
	{		
		Db.AddRange(fTaskSubtasks.Select((x, i) => new trTaskSubtask
		{
			Task = x.TID,
			Subtask = x.STID,
			Seq = i + 1,
			CreatedBy = auditable.CreatedBy,
			CreatedByName = auditable.CreatedByName!,
			CreatedDate = auditable.CreatedDate,
			UpdatedBy = auditable.UpdatedBy,
			UpdatedByName = auditable.UpdatedByName!,
			UpdatedDate = auditable.UpdatedDate,
		}));
	}

	public async Task RemoveTaskSubtasks(Guid tid)
	{
		var dataRemove = Db.AsTracking().Where(x => x.Task == tid);
		Db.RemoveRange(dataRemove);
	}

	public async Task<List<trTaskSubtask>> GetAll(Guid? tid, Guid? stid, bool scope)
	{
		var query = GetAllQueryBuilder(tid, stid, scope);
		var result = await query.ToListAsync();
		if (result == null) throw new NotFoundException("ไม่พบ Task");
		return result;
	}

	private IQueryable<trTaskSubtask> GetAllQueryBuilder(Guid? tid, Guid? stid, bool scope)
	{
		var query = Db.AsQueryable();
		if (tid != null) query = query.Where(x => x.Task == tid);
		if (stid != null) query = query.Where(x => x.Subtask == stid);
		if (scope == true){
			query = query.Include(x => x.trSubtask).ThenInclude(x => x.trSubtaskAction).ThenInclude(x => x.trAction).ThenInclude(x => x.mtActionType);
		}
		return query;
	}

}
