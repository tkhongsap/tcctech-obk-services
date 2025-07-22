using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.Data;
using System.Linq.Dynamic.Core;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Exceptions;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;
using TCCTOBK.OperationBackend.Application.Helper.Table;
using TCCTOBK.OperationBackend.Domain.Entities;
using TCCTOBK.OperationBackend.Application.Contracts.DataModel.CasesRepository;
using TCCTOBK.OperationBackend.Application.Features.Operation.Cases.Command.UpsertCases;
using TCCTOBK.OperationBackend.Application.Features.Operation.Cases.Query.GetCaseList;
using TCCTOBK.OperationBackend.Application.Helper.Service;

namespace TCCTOBK.OperationBackend.Application.Repositories;
internal class CasesRepository : BaseRepository<trCases>, ICasesRepository
{
	private readonly IClientSiteService _clientSiteService;

	public CasesRepository(ITCCTOBKContext context, IClientSiteService clientSiteService) : base(context)
	{
		_clientSiteService = clientSiteService;
	}

	public async Task<int> UpsertCases(UpsertCasesModel request)
	{
		var fCases = await Db.AsTracking().FirstOrDefaultAsync(x => x.Id == request.Id);
		if (fCases == null)
		{
			var newCases = new trCases()
			{
				Id = request.Id,
				ShortDesc = request.ShortDesc,
				CaseNo = request.CaseNo,
				EventTypeId = request.EventTypeId,
				EventTypeCode = request.EventTypeCode,
				LocationId = request.LocationId,
				LocationCode = request.LocationCode,
				LocationName = request.LocationName,
				PriorityLevelId = request.PriorityLevelId,
				SiteHandler = request.SiteHandler,
				StatusCode = request.StatusCode,
				Timestamp = request.Timestamp,
				CreatedOn = DateTime.SpecifyKind(request.CreatedOn, DateTimeKind.Unspecified),
				SlaConfigId = request.SlaConfigId,
				CaseTypeId = request.CaseTypeId,
				CreatedBy = request.CreatedBy,
				SlaFailed = request.SlaFailed,
				SlaDate = DateTime.SpecifyKind(request.SlaDate, DateTimeKind.Unspecified),
				ModifiedOn = request.ModifiedOn == null ? null : DateTime.SpecifyKind(request.ModifiedOn.Value, DateTimeKind.Unspecified),
				ModifiedBy = request.ModifiedBy,
				Requester = request.Requester,
				Description = request.Description,
				EquipmentTag = request.EquipmentTag,
				ExternalRefNo = request.ExternalRefNo,
				IsCritical = request.IsCritical,
				PriorityText = GetPriorityText(request.PriorityLevelId),
				SyncStatus = 1,
				CSID = _clientSiteService.ClientSiteId
			};
			Db.Add(newCases);
		}
		else
		{
			fCases.ShortDesc = request.ShortDesc;
			fCases.CaseNo = request.CaseNo;
			fCases.EventTypeId = request.EventTypeId;
			fCases.EventTypeCode = request.EventTypeCode;
			fCases.LocationId = request.LocationId;
			fCases.LocationCode = request.LocationCode;
			fCases.LocationName = request.LocationName;
			fCases.PriorityLevelId = request.PriorityLevelId;
			fCases.SiteHandler = request.SiteHandler;
			fCases.StatusCode = request.StatusCode;
			fCases.Timestamp = request.Timestamp;
			fCases.CreatedOn = DateTime.SpecifyKind(request.CreatedOn, DateTimeKind.Unspecified);
			fCases.SlaConfigId = request.SlaConfigId;
			fCases.CaseTypeId = request.CaseTypeId;
			fCases.CreatedBy = request.CreatedBy;
			fCases.SlaFailed = request.SlaFailed;
			fCases.SlaDate = DateTime.SpecifyKind(request.SlaDate, DateTimeKind.Unspecified);
			fCases.Description = request.Description;
			fCases.EquipmentTag = request.EquipmentTag;
			fCases.ExternalRefNo = request.ExternalRefNo;
			fCases.IsCritical = request.IsCritical;
			fCases.PriorityText = GetPriorityText(request.PriorityLevelId);
			fCases.ModifiedOn = request.ModifiedOn == null ? null : DateTime.SpecifyKind(request.ModifiedOn.Value, DateTimeKind.Unspecified);
			fCases.ModifiedBy = request.ModifiedBy;
			fCases.Requester = request.Requester;
			fCases.SyncStatus = 1;
			fCases.CSID = _clientSiteService.ClientSiteId;
		}

		return request.Id;
	}

	private string GetPriorityText(int id)
	{
		if (id == 1)
		{
			return "cat 1";
		}
		if (id == 2)
		{
			return "cat 2";
		}
		if (id == 3)
		{
			return "cat 3";
		}
		return "";
	}

	public Task<List<trCases>> GetAll(int? casesId, string? filter, List<int>? idList, int? status, bool scope, TableState state, int? staffId)
	{ 
		var query = GetAllQueryBuilder(casesId, filter, idList, status, scope, staffId);
		if (!string.IsNullOrEmpty(state.OrderingName))
		{
			query = query.OrderBy(state.OrderingName);
		}
		return query.Skip(state.Skip).Take(state.Take).ToListAsync();
	}

	private IQueryable<trCases> GetAllQueryBuilder(int? casesId, string? filter, List<int>? idList, int? status, bool scope, int? staffId)
	{
		var query = Db.AsQueryable();
		if (casesId != null)
		{
			query = query.Where(x => x.Id == casesId);
		}
		if (status != null)
		{
			query = query.Where(x => x.SyncStatus == status);
		}
		if (!string.IsNullOrEmpty(filter))
		{
			query = query.Where(x => x.Id.ToString().ToLower().Contains(filter.ToLower()) || x.CaseNo!.ToLower().Contains(filter.ToLower()));
		}
		if (idList != null && idList.Count > 0)
		{
			query = query.Where(x => idList.Contains(x.Id));
		}
		if (scope == true)
		{
			query = query.Include(x => x.trCaseTasks);
			if (staffId != null)
			{
				query = query.Where(x => x.trCaseTasks.Any(y => y.AssignedStaffId == staffId));
			}
		}
		query = query.Where(x => x.CreatedOn >= DateTime.Now.ToUniversalTime().AddDays(-15));
		query = query.OrderByDescending(x => x.CreatedOn);
		return query;
	}
	public Task<int> GetAllCount(int? casesId, string? filter, List<int>? idList, int? status, bool scope, int? staffId)
	{
		var query = GetAllQueryBuilder(casesId, filter, idList, status, scope, staffId);
		return query.CountAsync();
	}

	private IQueryable<trCases> GetByIdQueryBuilder(int id, bool scope)
	{
		var query = Db.AsTracking();
		query = query.Where(x => x.Id == id);
		if (scope == true)
		{
			//query = query.Include(x => x.trCaseTasks).Include(x => x.trCaseMedias);
			query = query.Include(x => x.trCaseTasks);
		}
		return query;
	}
	public async Task<trCases> GetById(int id, bool scope)
	{
		var query = GetByIdQueryBuilder(id, scope);
		var result = await query.FirstOrDefaultAsync();
		if (result == null) throw new NotFoundException("ไม่พบ Cases");
		return result;
	}

	public async Task<trCases> GetLast()
	{
		var query = Db.AsQueryable();
		var result = await query.OrderByDescending(x => x.Id).FirstOrDefaultAsync();
		if (result == null) throw new NotFoundException("ไม่พบ Cases");
		return result;
	}

	public async Task UpdateSyncStatus(List<int> idList, int updateStatus)
	{
		var fCases = await Db.AsTracking().Where(x => idList.Contains(x.Id)).ToListAsync();
		foreach (var fCase in fCases)
		{
			fCase.CSID = _clientSiteService.ClientSiteId;
			fCase.SyncStatus = updateStatus;
		}
	}
}