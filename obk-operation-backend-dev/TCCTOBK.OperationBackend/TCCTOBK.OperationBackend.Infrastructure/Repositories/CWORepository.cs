using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.Data;
using System.Linq.Dynamic.Core;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Exceptions;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;
using TCCTOBK.OperationBackend.Application.Helper.Table;
using TCCTOBK.OperationBackend.Domain.Entities;
using TCCTOBK.OperationBackend.Application.Contracts.DataModel.CWORepository;
using TCCTOBK.OperationBackend.Application.Features.Operation.CWO.Command.UpsertCWO;
using TCCTOBK.OperationBackend.Application.Features.Operation.CWO.Model;
using TCCTOBK.OperationBackend.Application.Helper.Service;
using TCCTOBK.OperationBackend.Domain;


namespace TCCTOBK.OperationBackend.Application.Repositories;
internal class CWORepository : BaseRepository<trCWOs>, ICWORepository
{

	private readonly IClientSiteService _clientSiteService;

	public CWORepository(ITCCTOBKContext context, IClientSiteService clientSiteService) : base(context)
	{
		_clientSiteService = clientSiteService;
	}

	public async Task<int> UpsertCWO(CWOUpdatesResult request)
	{
		var fCWO = await Db.AsTracking().FirstOrDefaultAsync(x => x.Id == request.Id);
		if (fCWO == null)
		{
			var newCWO = new trCWOs()
			{
				Id = request.Id,
				Name = request.Name,
				CwoTypeId = request.CwoTypeId,
				ProblemTypeId = request.ProblemTypeId,
				PriorityId = request.PriorityId,
				ServiceCategoryId = request.ServiceCategoryId,
				LocationId = request.LocationId,
				Description = request.Description,
				CreatedBy = request.CreatedBy,
				CreatedOn = request.CreatedOn == null ? null : DateTime.SpecifyKind(request.CreatedOn.Value, DateTimeKind.Unspecified),
				ModifiedBy = request.ModifiedBy,
				ModifiedOn = request.ModifiedOn == null ? null : DateTime.SpecifyKind(request.ModifiedOn.Value, DateTimeKind.Unspecified),
				RequesterId = request.RequesterId,
				RequestedOn = request.RequestedOn == null ? null : DateTime.SpecifyKind(request.RequestedOn.Value, DateTimeKind.Unspecified),
				IsActive = request.IsActive,
				StatusId = request.StatusId,
				AssetId = request.AssetId,
				AckedOn = request.AckedOn == null ? null : DateTime.SpecifyKind(request.AckedOn.Value, DateTimeKind.Unspecified),
				AckedBy = request.AckedBy,
				SlaStartDateTime = request.SlaStartDateTime,
				SlatoResolve = request.SlatoResolve,
				SlatoRespond = request.SlatoRespond,
				EstimatedTotalDuration = request.EstimatedTotalDuration,
				EstimatedCompletion = request.EstimatedCompletion == null ? null : DateTime.SpecifyKind(request.EstimatedCompletion.Value, DateTimeKind.Unspecified),
				SupervisorId = request.SupervisorId,
				SupervisorAssignedOn = request.SupervisorAssignedOn == null ? null : DateTime.SpecifyKind(request.SupervisorAssignedOn.Value, DateTimeKind.Unspecified),
				SupervisorAssignedBy = request.SupervisorAssignedBy,
				TechnicianId = request.TechnicianId,
				TechnicianAssignedOn = request.TechnicianAssignedOn == null ? null : DateTime.SpecifyKind(request.TechnicianAssignedOn.Value, DateTimeKind.Unspecified),
				TechnicianAssignedBy = request.TechnicianAssignedBy,
				OperatorNote = request.OperatorNote,
				ActualStartDateTime = request.ActualStartDateTime == null ? null : DateTime.SpecifyKind(request.ActualStartDateTime.Value, DateTimeKind.Unspecified),
				ActualCompletionDateTime = request.ActualCompletionDateTime == null ? null : DateTime.SpecifyKind(request.ActualCompletionDateTime.Value, DateTimeKind.Unspecified),
				CompletedBy = request.CompletedBy,
				ClosedOn = request.ClosedOn == null ? null : DateTime.SpecifyKind(request.ClosedOn.Value, DateTimeKind.Unspecified),
				ClosedBy = request.ClosedBy,
				IsTaskCompletionConfirmed = request.IsTaskCompletionConfirmed,
				TaskCompletionConfirmedBy = request.TaskCompletionConfirmedBy,
				TaskCompletionConfirmedOn = request.TaskCompletionConfirmedOn == null ? null : DateTime.SpecifyKind(request.TaskCompletionConfirmedOn.Value, DateTimeKind.Unspecified),
				IsCancelled = request.IsCancelled,
				ServiceProviderId = request.ServiceProviderId,
				CompletionComment = request.CompletionComment,
				ClosureComment = request.ClosureComment,
				SlaTriggerPoint = request.SlaTriggerPoint,
				IsReworkRequested = request.IsReworkRequested,
				ReworkRequestedBy = request.ReworkRequestedBy,
				ReworkRequestedOn = request.ReworkRequestedOn == null ? null : DateTime.SpecifyKind(request.ReworkRequestedOn.Value, DateTimeKind.Unspecified),
				ReasonToRework = request.ReasonToRework,
				IsPrevSupervisorRejected = request.IsPrevSupervisorRejected,
				PrevRejectedSupervisorId = request.PrevRejectedSupervisorId,
				IsPrevTechnicianRejected = request.IsPrevTechnicianRejected,
				PrevRejectedTechnicianId = request.PrevRejectedTechnicianId,
				AcknowledgementVerifiedBy = request.AcknowledgementVerifiedBy,
				CompletionAckedBy = request.CompletionAckedBy,
				CompletionVerifiedBy = request.CompletionVerifiedBy,
				ClientVerificationSubmittedBy = request.ClientVerificationSubmittedBy,
				ClientVerificationSubmittedOn = request.ClientVerificationSubmittedOn == null ? null : DateTime.SpecifyKind(request.ClientVerificationSubmittedOn.Value, DateTimeKind.Unspecified),
				ClientVerificationComment = request.ClientVerificationComment,
				ClientVerifiedUser = request.ClientVerifiedUser,
				IsWorkingOffline = request.IsWorkingOffline,
				WorkOfflineOn = request.WorkOfflineOn == null ? null : DateTime.SpecifyKind(request.WorkOfflineOn.Value, DateTimeKind.Unspecified),
				WorkOfflineBy = request.WorkOfflineBy,
				IsPaused = request.IsPaused,
				PausedBy = request.PausedBy,
				PausedOn = request.PausedOn == null ? null : DateTime.SpecifyKind(request.PausedOn.Value, DateTimeKind.Unspecified),
				PausedReason = request.PausedReason,
				ResumedBy = request.ResumedBy,
				ResumedOn = request.ResumedOn == null ? null : DateTime.SpecifyKind(request.ResumedOn.Value, DateTimeKind.Unspecified),
				AcknowledgementSignature = request.AcknowledgementSignature,
				CompletionSignature = request.CompletionSignature,
				ClosureSignature = request.ClosureSignature,
				ClientVerificationSignature = request.ClientVerificationSignature,
				IsSynced = request.IsSynced,
				ParentId = request.ParentId,
				SyncStatus = 1,
				CSID = _clientSiteService.ClientSiteId
			};
			Db.Add(newCWO);
		}
		else
		{
			fCWO.Id = request.Id;
			fCWO.Name = request.Name;
			fCWO.CwoTypeId = request.CwoTypeId;
			fCWO.ProblemTypeId = request.ProblemTypeId;
			fCWO.PriorityId = request.PriorityId;
			fCWO.ServiceCategoryId = request.ServiceCategoryId;
			fCWO.LocationId = request.LocationId;
			fCWO.Description = request.Description;
			fCWO.CreatedBy = request.CreatedBy;
			fCWO.CreatedOn = request.CreatedOn == null ? null : DateTime.SpecifyKind(request.CreatedOn.Value, DateTimeKind.Unspecified);
			fCWO.ModifiedBy = request.ModifiedBy;
			fCWO.ModifiedOn = request.ModifiedOn == null ? null : DateTime.SpecifyKind(request.ModifiedOn.Value, DateTimeKind.Unspecified);
			fCWO.RequesterId = request.RequesterId;
			fCWO.RequestedOn = request.RequestedOn == null ? null : DateTime.SpecifyKind(request.RequestedOn.Value, DateTimeKind.Unspecified);
			fCWO.IsActive = request.IsActive;
			fCWO.StatusId = request.StatusId;
			fCWO.AssetId = request.AssetId;
			fCWO.AckedOn = request.AckedOn == null ? null : DateTime.SpecifyKind(request.AckedOn.Value, DateTimeKind.Unspecified);
			fCWO.AckedBy = request.AckedBy;
			fCWO.SlaStartDateTime = request.SlaStartDateTime;
			fCWO.SlatoResolve = request.SlatoResolve;
			fCWO.SlatoRespond = request.SlatoRespond;
			fCWO.EstimatedTotalDuration = request.EstimatedTotalDuration;
			fCWO.EstimatedCompletion = request.EstimatedCompletion == null ? null : DateTime.SpecifyKind(request.EstimatedCompletion.Value, DateTimeKind.Unspecified);
			fCWO.SupervisorId = request.SupervisorId;
			fCWO.SupervisorAssignedOn = request.SupervisorAssignedOn == null ? null : DateTime.SpecifyKind(request.SupervisorAssignedOn.Value, DateTimeKind.Unspecified);
			fCWO.SupervisorAssignedBy = request.SupervisorAssignedBy;
			fCWO.TechnicianId = request.TechnicianId;
			fCWO.TechnicianAssignedOn = request.TechnicianAssignedOn == null ? null : DateTime.SpecifyKind(request.TechnicianAssignedOn.Value, DateTimeKind.Unspecified);
			fCWO.TechnicianAssignedBy = request.TechnicianAssignedBy;
			fCWO.OperatorNote = request.OperatorNote;
			fCWO.ActualStartDateTime = request.ActualStartDateTime == null ? null : DateTime.SpecifyKind(request.ActualStartDateTime.Value, DateTimeKind.Unspecified);
			fCWO.ActualCompletionDateTime = request.ActualCompletionDateTime == null ? null : DateTime.SpecifyKind(request.ActualCompletionDateTime.Value, DateTimeKind.Unspecified);
			fCWO.CompletedBy = request.CompletedBy;
			fCWO.ClosedOn = request.ClosedOn == null ? null : DateTime.SpecifyKind(request.ClosedOn.Value, DateTimeKind.Unspecified);
			fCWO.ClosedBy = request.ClosedBy;
			fCWO.IsTaskCompletionConfirmed = request.IsTaskCompletionConfirmed;
			fCWO.TaskCompletionConfirmedBy = request.TaskCompletionConfirmedBy;
			fCWO.TaskCompletionConfirmedOn = request.TaskCompletionConfirmedOn == null ? null : DateTime.SpecifyKind(request.TaskCompletionConfirmedOn.Value, DateTimeKind.Unspecified);
			fCWO.IsCancelled = request.IsCancelled;
			fCWO.ServiceProviderId = request.ServiceProviderId;
			fCWO.CompletionComment = request.CompletionComment;
			fCWO.ClosureComment = request.ClosureComment;
			fCWO.SlaTriggerPoint = request.SlaTriggerPoint;
			fCWO.IsReworkRequested = request.IsReworkRequested;
			fCWO.ReworkRequestedBy = request.ReworkRequestedBy;
			fCWO.ReworkRequestedOn = request.ReworkRequestedOn == null ? null : DateTime.SpecifyKind(request.ReworkRequestedOn.Value, DateTimeKind.Unspecified);
			fCWO.ReasonToRework = request.ReasonToRework;
			fCWO.IsPrevSupervisorRejected = request.IsPrevSupervisorRejected;
			fCWO.PrevRejectedSupervisorId = request.PrevRejectedSupervisorId;
			fCWO.IsPrevTechnicianRejected = request.IsPrevTechnicianRejected;
			fCWO.PrevRejectedTechnicianId = request.PrevRejectedTechnicianId;
			fCWO.AcknowledgementVerifiedBy = request.AcknowledgementVerifiedBy;
			fCWO.CompletionAckedBy = request.CompletionAckedBy;
			fCWO.CompletionVerifiedBy = request.CompletionVerifiedBy;
			fCWO.ClientVerificationSubmittedBy = request.ClientVerificationSubmittedBy;
			fCWO.ClientVerificationSubmittedOn = request.ClientVerificationSubmittedOn == null ? null : DateTime.SpecifyKind(request.ClientVerificationSubmittedOn.Value, DateTimeKind.Unspecified);
			fCWO.ClientVerificationComment = request.ClientVerificationComment;
			fCWO.ClientVerifiedUser = request.ClientVerifiedUser;
			fCWO.IsWorkingOffline = request.IsWorkingOffline;
			fCWO.WorkOfflineOn = request.WorkOfflineOn == null ? null : DateTime.SpecifyKind(request.WorkOfflineOn.Value, DateTimeKind.Unspecified);
			fCWO.WorkOfflineBy = request.WorkOfflineBy;
			fCWO.IsPaused = request.IsPaused;
			fCWO.PausedBy = request.PausedBy;
			fCWO.PausedOn = request.PausedOn == null ? null : DateTime.SpecifyKind(request.PausedOn.Value, DateTimeKind.Unspecified);
			fCWO.PausedReason = request.PausedReason;
			fCWO.ResumedBy = request.ResumedBy;
			fCWO.ResumedOn = request.ResumedOn == null ? null : DateTime.SpecifyKind(request.ResumedOn.Value, DateTimeKind.Unspecified);
			fCWO.AcknowledgementSignature = request.AcknowledgementSignature;
			fCWO.CompletionSignature = request.CompletionSignature;
			fCWO.ClosureSignature = request.ClosureSignature;
			fCWO.ClientVerificationSignature = request.ClientVerificationSignature;
			fCWO.IsSynced = request.IsSynced;
			fCWO.ParentId = request.ParentId;
			fCWO.SyncStatus = 1;
			fCWO.CSID = _clientSiteService.ClientSiteId;
		}

		return request.Id;
	}

	public Task<List<trCWOs>> GetAll(int? cwoId, string? filter, List<int>? idList, int? syncStatus, bool scope, string? userId, int? roleId, bool? isSOC, int? status, bool? isCWOList, TableState state)
	{
		var query = GetAllQueryBuilder(cwoId, filter, idList, syncStatus, scope, userId, roleId, isSOC, status, isCWOList);
		if (!string.IsNullOrEmpty(state.OrderingName))
		{
			query = query.OrderBy(state.OrderingName);
		}
		return query.Skip(state.Skip).Take(state.Take).ToListAsync();
	}

	private IQueryable<trCWOs> GetAllQueryBuilder(int? cwoId, string? filter, List<int>? idList, int? syncStatus, bool scope, string? userId, int? roleId, bool? isSOC, int? status, bool? isCWOList)
	{
		var query = Db.AsQueryable();
		if (cwoId != null)
		{
			query = query.Where(x => x.Id == cwoId);
		}
		if (syncStatus != null)
		{
			query = query.Where(x => x.SyncStatus == syncStatus);
		}
		if (status != null)
		{
			query = query.Where(x => x.StatusId == status);
		}
		if (!string.IsNullOrEmpty(filter))
		{
			query = query.Where(x => x.Id.ToString().ToLower().Contains(filter.ToLower()) || x.Name.ToLower().Contains(filter.ToLower()));
		}
		if (idList != null && idList.Count > 0)
		{
			query = query.Where(x => idList.Contains(x.Id));
		}
		if (roleId != null)
		{
			if (roleId == 1)
			{
				query = query.Where(x => x.TechnicianId == userId || x.SupervisorId == userId);
			}
			else if (roleId == 3)
			{
				query = query.Where(x => x.TechnicianId == userId);
			}
		}

		if (isCWOList != null && isCWOList == true)
		{
			var now = DateTime.Now.ToUniversalTime();
			query = query.Where(x => x.StatusId != 1).Where(x => x.CreatedOn!.Value.ToUniversalTime() >= now.AddDays(-15));
			query = query.Where(x => x.StatusId != 1 && (
				(x.StatusId == 2 && x.CreatedOn!.Value.ToUniversalTime() >= DateTime.Now.ToUniversalTime().AddDays(Constant.CWO_NEW_DISPLAY)) ||
				(x.StatusId == 3 && x.CreatedOn!.Value.ToUniversalTime() >= DateTime.Now.ToUniversalTime().AddDays(Constant.CWO_ASSIGN_DISPLAY)) ||
				(x.StatusId == 4 && x.CreatedOn!.Value.ToUniversalTime() >= DateTime.Now.ToUniversalTime().AddDays(Constant.CWO_INPROGRESS_DISPLAY)) ||
				(x.StatusId == 5 && x.CreatedOn!.Value.ToUniversalTime() >= DateTime.Now.ToUniversalTime().AddDays(Constant.CWO_COMPLETE_DISPLAY)) ||
				(x.StatusId == 6 && x.CreatedOn!.Value.ToUniversalTime() >= DateTime.Now.ToUniversalTime().AddDays(Constant.CWO_CLOSE_DISPLAY)) ||
				(x.StatusId == 7 && x.CreatedOn!.Value.ToUniversalTime() >= DateTime.Now.ToUniversalTime().AddDays(Constant.CWO_CLIENTVERIFY_DISPLAY))
				)
			);
		}


		if (isSOC != null && isSOC == true)
		{
			query = query.Where(x => x.ServiceCategoryId == Constant.CERTIS_SOC_SERVICE_CATEGORY);
		}
		query = query.OrderByDescending(x => x.CreatedOn);
		// if (scope == true)
		// {
		// 	query = query.Include(x => x.Locations);
		// }

		return query;
	}
	public Task<int> GetAllCount(int? cwoId, string? filter, List<int>? idList, int? syncStatus, bool scope, string? userId, int? roleId, bool? isSOC, int? status, bool? isCWOList)
	{
		var query = GetAllQueryBuilder(cwoId, filter, idList, syncStatus, scope, userId, roleId, isSOC, status, isCWOList);
		return query.CountAsync();
	}

	private IQueryable<trCWOs> GetByIdQueryBuilder(int id, bool scope)
	{
		var query = Db.AsTracking();
		query = query.Where(x => x.Id == id);
		// if (scope == true)
		// {
		// 	query = query.Include(x => x.Locations);
		// }
		return query;
	}
	public async Task<trCWOs> GetById(int id, bool scope, bool? isThrow = true)
	{
		var query = GetByIdQueryBuilder(id, scope);
		var result = await query.FirstOrDefaultAsync();
		if (result == null && isThrow == true) throw new NotFoundException("ไม่พบ CWO");
		return result;
	}

	public async Task<trCWOs> GetLast()
	{
		var query = Db.AsQueryable();
		var result = await query.OrderByDescending(x => x.Id).FirstOrDefaultAsync();
		if (result == null) throw new NotFoundException("ไม่พบ CWO");
		return result;
	}

	public async Task UpdateSyncStatus(List<int> idList, int updateStatus)
	{
		var fCWO = await Db.AsTracking().Where(x => idList.Contains(x.Id) && x.CSID == _clientSiteService.ClientSiteId).ToListAsync();
		foreach (var fCase in fCWO)
		{
			fCase.SyncStatus = updateStatus;
		}
	}
}