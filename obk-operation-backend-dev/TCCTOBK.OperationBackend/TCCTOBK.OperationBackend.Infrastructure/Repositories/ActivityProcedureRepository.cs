using Microsoft.EntityFrameworkCore;
using System.Data;
using System.Linq.Dynamic.Core;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Contracts.DataModel.ActivityProcedureRepository;
using TCCTOBK.OperationBackend.Application.Exceptions;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;
using TCCTOBK.OperationBackend.Application.Helper.Service;
using TCCTOBK.OperationBackend.Application.Helper.Table;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Application.Repositories;
internal class ActivityProcedureRepository : BaseRepository<trActivityProcedure>, IActivityProcedureRepository
{
    private readonly IClientSiteService _clientSiteService;
    public ActivityProcedureRepository(ITCCTOBKContext context, IClientSiteService clientSiteService) : base(context)
    {
        _clientSiteService = clientSiteService;
    }

	public Task<bool> CheckDuplicate(string code)
	{
		return Db.AnyAsync(x => x.Code == code);
	}

	public async Task<Guid> CreateActivityProcedure(CreateActivityProcedureModel ap, AuditableModel auditable)
	{
		var newAPId = Guid.NewGuid();
		var newAP = new trActivityProcedure()
        {
            Id = newAPId,
            Code = ap.Code,
            TaskName = ap.TaskName,
            SubtaskActions = ap.SubtaskActions,
            LocationId = ap.LocationId,
            CreatedBy = auditable.CreatedBy,
            CreatedByName = auditable.CreatedByName!,
            CreatedDate = auditable.CreatedDate,
            UpdatedBy = auditable.UpdatedBy,
            UpdatedByName = auditable.UpdatedByName!,
            UpdatedDate = auditable.UpdatedDate,
            CSID = _clientSiteService.ClientSiteId
		};
		Db.Add(newAP);
		return newAPId;
	}

	public Task<List<trActivityProcedure>> GetAll(string? filter, bool scope, TableState state)
	{
		var query = GetAllQueryBuilder(filter, scope);
        query = query.Where(x => x.CSID == _clientSiteService.ClientSiteId);
		if (!string.IsNullOrEmpty(state.OrderingName))
        {
            query = query.OrderBy(state.OrderingName);
        }
		return query.Skip(state.Skip).Take(state.Take).ToListAsync();
	}

	public Task<int> GetAllCount(string? filter, bool scope)
	{
		var query = GetAllQueryBuilder(filter, scope);
		return query.CountAsync();
	}

	private IQueryable<trActivityProcedure> GetAllQueryBuilder(string? filter, bool scope)
	{
		var query = Db.AsQueryable();
		if (!string.IsNullOrEmpty(filter))
		{
			query = query.Where(x => x.Id.ToString().ToLower().Contains(filter.ToLower()) || x.Code.ToLower().Contains(filter.ToLower()));
		}
		if (scope)
		{
			query = query.Include(x => x.location);
		}
		return query;
	}

	public async Task<trActivityProcedure> GetById(Guid id, bool scope)
	{
		var query = Db.AsQueryable();
		if (scope)
		{
			query = query.Include(x => x.location);
		}
		var result = await query.FirstOrDefaultAsync(x => x.Id == id);
		if (result == null) throw new NotFoundException("ไม่พบ Activity Procedure");
		return result;
	}

	public async Task UpdateActivityProcedure(UpdateActivityProcedureModel ap, AuditableModel auditable)
	{
		var updateAP = await Db.AsTracking().Where(x => x.Id == ap.Id).FirstAsync();
		var apCodeExist = await Db.Where(x => x.Code == ap.Code && x.Id != ap.Id).AnyAsync();
		if (apCodeExist) throw new BadRequestException("Activity Procedure Code ซ้ำกันในระบบ");
		updateAP.TaskName = ap.TaskName;
		updateAP.Code = ap.Code;
		updateAP.SubtaskActions = ap.SubtaskActions;
		updateAP.LocationId = ap.LocationId;
		updateAP.UpdatedBy = auditable.UpdatedBy;
		updateAP.UpdatedByName = auditable.UpdatedByName!;
		updateAP.UpdatedDate = auditable.UpdatedDate;
		Db.Update(updateAP);
	}

	public Task<int> DeleteActivityProcedure(Guid id, AuditableModel auditable)
	{
		return Db.Where(x => x.Id == id).ExecuteDeleteAsync();
	}
}
