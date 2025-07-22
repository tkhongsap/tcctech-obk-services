using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.Data;
using System.Linq.Dynamic.Core;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Exceptions;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;
using TCCTOBK.OperationBackend.Application.Helper.Table;
using TCCTOBK.OperationBackend.Domain.Entities;
using TCCTOBK.OperationBackend.Application.Features.Operation.PPM.Model;
using TCCTOBK.OperationBackend.Application.Helper.Service;
using TCCTOBK.OperationBackend.Domain;
using NPOI.SS.Formula.Functions;


namespace TCCTOBK.OperationBackend.Application.Repositories;
internal class PPMRepository : BaseRepository<trPPMs>, IPPMRepository
{

	private readonly IClientSiteService _clientSiteService;

	public PPMRepository(ITCCTOBKContext context, IClientSiteService clientSiteService) : base(context)
	{
		_clientSiteService = clientSiteService;
	}

	public async Task<int> UpsertPPM(PPMUpdatesResult request)
	{
		var fPPM = await Db.AsTracking().FirstOrDefaultAsync(x => x.Id == request.Id);
		if (fPPM == null)
		{
			var newPPM = new trPPMs()
			{
				Id = request.Id!.Value,
				Name = request.Name,
				MWOId = request.MWOId,
				LocationId = request.LocationId,
				ChecklistId = request.ChecklistId,
				ServiceCategoryId = request.ServiceCategoryId,
				ServiceProviderId = request.ServiceProviderId,
				ServicingGroupId = request.ServicingGroupId,
				AckedOn = request.AckedOn == null ? null : DateTime.SpecifyKind(request.AckedOn.Value, DateTimeKind.Unspecified),
				AckedBy = request.AckedBy,
				EstimatedTotalDuration = request.EstimatedTotalDuration,
				TargetStart = request.TargetStart == null ? null : DateTime.SpecifyKind(request.TargetStart.Value, DateTimeKind.Unspecified),
				TargetCompletion = request.TargetCompletion == null ? null : DateTime.SpecifyKind(request.TargetCompletion.Value, DateTimeKind.Unspecified),
				ActualStart = request.ActualStart == null ? null : DateTime.SpecifyKind(request.ActualStart.Value, DateTimeKind.Unspecified),
				ActualCompletion = request.ActualCompletion == null ? null : DateTime.SpecifyKind(request.ActualCompletion.Value, DateTimeKind.Unspecified),
				CompletedBy = request.CompletedBy,
				CompletionComment = request.CompletionComment,
				CompletionVerifiedBy = request.CompletionVerifiedBy,
				FrequencyTypeId = request.FrequencyTypeId,
				StatusId = request.StatusId,
				CreatedBy = request.CreatedBy,
				CreatedOn = request.CreatedOn == null ? null : DateTime.SpecifyKind(request.CreatedOn.Value, DateTimeKind.Unspecified),
				ModifiedOn = request.ModifiedOn == null ? null : DateTime.SpecifyKind(request.ModifiedOn.Value, DateTimeKind.Unspecified),
				IsActive = request.IsActive,
				ClosedOn = request.ClosedOn == null ? null : DateTime.SpecifyKind(request.ClosedOn.Value, DateTimeKind.Unspecified),
				ClosedBy = request.ClosedBy,
				ClosureComment = request.ClosureComment,
				IsReworkRequested = request.IsReworkRequested,
				SupervisorId = request.SupervisorId,
				SupervisorAssignedBy = request.SupervisorAssignedBy,
				SupervisorAssignedOn = request.SupervisorAssignedOn == null ? null : DateTime.SpecifyKind(request.SupervisorAssignedOn.Value, DateTimeKind.Unspecified),
				IsTechniciansAssigned = request.IsTechniciansAssigned,
				TechniciansAssignedBy = request.TechniciansAssignedBy,
				TechniciansAssignedOn = request.TechniciansAssignedOn == null ? null : DateTime.SpecifyKind(request.TechniciansAssignedOn.Value, DateTimeKind.Unspecified),
				IsCancelled = request.IsCancelled,
				WorkflowId = request.WorkflowId,
				IsAdhoc = request.IsAdhoc,
				IsPrevSupervisorRejected = request.IsPrevSupervisorRejected,
				IsPrevTechnicianRejected = request.IsPrevTechnicianRejected,
				ClientVerifiedBy = request.ClientVerifiedBy,
				ClientVerificationSubmittedBy = request.ClientVerificationSubmittedBy,
				ClientVerificationSubmittedOn = request.ClientVerificationSubmittedOn == null ? null : DateTime.SpecifyKind(request.ClientVerificationSubmittedOn.Value, DateTimeKind.Unspecified),
				ClientVerificationComment = request.ClientVerificationComment,
				AcknowledgementSignature = request.AcknowledgementSignature,
				CompletionSignature = request.CompletionSignature,
				ClosureSignature = request.ClosureSignature,
				ClientVerificationSignature = request.ClientVerificationSignature,
				CSID = _clientSiteService.ClientSiteId
			};
			Db.Add(newPPM);
		}
		else
		{
			fPPM.Id = request.Id!.Value;
			fPPM.Name = request.Name;
			fPPM.MWOId = request.MWOId;
			fPPM.LocationId = request.LocationId;
			fPPM.ChecklistId = request.ChecklistId;
			fPPM.ServiceCategoryId = request.ServiceCategoryId;
			fPPM.ServiceProviderId = request.ServiceProviderId;
			fPPM.ServicingGroupId = request.ServicingGroupId;
			fPPM.AckedOn = request.AckedOn == null ? null : DateTime.SpecifyKind(request.AckedOn.Value, DateTimeKind.Unspecified);
			fPPM.AckedBy = request.AckedBy;
			fPPM.EstimatedTotalDuration = request.EstimatedTotalDuration;
			fPPM.TargetStart = request.TargetStart == null ? null : DateTime.SpecifyKind(request.TargetStart.Value, DateTimeKind.Unspecified);
			fPPM.TargetCompletion = request.TargetCompletion == null ? null : DateTime.SpecifyKind(request.TargetCompletion.Value, DateTimeKind.Unspecified);
			fPPM.ActualStart = request.ActualStart == null ? null : DateTime.SpecifyKind(request.ActualStart.Value, DateTimeKind.Unspecified);
			fPPM.ActualCompletion = request.ActualCompletion == null ? null : DateTime.SpecifyKind(request.ActualCompletion.Value, DateTimeKind.Unspecified);
			fPPM.CompletedBy = request.CompletedBy;
			fPPM.CompletionComment = request.CompletionComment;
			fPPM.CompletionVerifiedBy = request.CompletionVerifiedBy;
			fPPM.FrequencyTypeId = request.FrequencyTypeId;
			fPPM.StatusId = request.StatusId;
			fPPM.CreatedBy = request.CreatedBy;
			fPPM.CreatedOn = request.CreatedOn == null ? null : DateTime.SpecifyKind(request.CreatedOn.Value, DateTimeKind.Unspecified);
			fPPM.ModifiedOn = request.ModifiedOn == null ? null : DateTime.SpecifyKind(request.ModifiedOn.Value, DateTimeKind.Unspecified);
			fPPM.IsActive = request.IsActive;
			fPPM.ClosedOn = request.ClosedOn == null ? null : DateTime.SpecifyKind(request.ClosedOn.Value, DateTimeKind.Unspecified);
			fPPM.ClosedBy = request.ClosedBy;
			fPPM.ClosureComment = request.ClosureComment;
			fPPM.IsReworkRequested = request.IsReworkRequested;
			fPPM.SupervisorId = request.SupervisorId;
			fPPM.SupervisorAssignedBy = request.SupervisorAssignedBy;
			fPPM.SupervisorAssignedOn = request.SupervisorAssignedOn == null ? null : DateTime.SpecifyKind(request.SupervisorAssignedOn.Value, DateTimeKind.Unspecified);
			fPPM.IsTechniciansAssigned = request.IsTechniciansAssigned;
			fPPM.TechniciansAssignedBy = request.TechniciansAssignedBy;
			fPPM.TechniciansAssignedOn = request.TechniciansAssignedOn == null ? null : DateTime.SpecifyKind(request.TechniciansAssignedOn.Value, DateTimeKind.Unspecified);
			fPPM.IsCancelled = request.IsCancelled;
			fPPM.WorkflowId = request.WorkflowId;
			fPPM.IsAdhoc = request.IsAdhoc;
			fPPM.IsPrevSupervisorRejected = request.IsPrevSupervisorRejected;
			fPPM.IsPrevTechnicianRejected = request.IsPrevTechnicianRejected;
			fPPM.ClientVerifiedBy = request.ClientVerifiedBy;
			fPPM.ClientVerificationSubmittedBy = request.ClientVerificationSubmittedBy;
			fPPM.ClientVerificationSubmittedOn = request.ClientVerificationSubmittedOn == null ? null : DateTime.SpecifyKind(request.ClientVerificationSubmittedOn.Value, DateTimeKind.Unspecified);
			fPPM.ClientVerificationComment = request.ClientVerificationComment;
			fPPM.AcknowledgementSignature = request.AcknowledgementSignature;
			fPPM.CompletionSignature = request.CompletionSignature;
			fPPM.ClosureSignature = request.ClosureSignature;
			fPPM.ClientVerificationSignature = request.ClientVerificationSignature;
			fPPM.CSID = _clientSiteService.ClientSiteId;
		}

		return request.Id!.Value;
	}

	public Task<List<trPPMs>> GetAll(int? ppmId, string? filter, List<int>? idList, int? status, bool? isPPMList, string? userId, int? roleId, TableState state)
	{
		var query = GetAllQueryBuilder(ppmId, filter, idList, status, isPPMList, userId, roleId);
		if (!string.IsNullOrEmpty(state.OrderingName))
		{
			query = query.OrderBy(state.OrderingName);
		}
		return query.Skip(state.Skip).Take(state.Take).ToListAsync();
	}


	private IQueryable<trPPMs> GetAllQueryBuilder(int? ppmId, string? filter, List<int>? idList, int? status, bool? isPPMList, string? userId, int? roleId)
	{
		var query = Db.AsQueryable();
		if (ppmId != null)
		{
			query = query.Where(x => x.Id == ppmId);
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

		if (isPPMList != null && isPPMList == true)
		{
			// query where by status
			int ParseOrDefault(string? input, int fallback = 15)
			{
				return int.TryParse(input, out var result) && result > 0 ? result : fallback;
			}

			int newDays = ParseOrDefault(DomainConfig.OpsApp.PPMNewDisplay);
			int assignedDays = ParseOrDefault(DomainConfig.OpsApp.PPMAssignedDisplay);
			int inProgressDays = ParseOrDefault(DomainConfig.OpsApp.PPMInprogressDisplay);
			int completedDays = ParseOrDefault(DomainConfig.OpsApp.PPMCompletedDisplay);
			int closeDays = ParseOrDefault(DomainConfig.OpsApp.PPMCloseDisplay);
			int clientVerifyDays = ParseOrDefault(DomainConfig.OpsApp.PPMClientVerifyDisplay);
			int cancelDays = ParseOrDefault(DomainConfig.OpsApp.PPMCancelDisplay);

			var now = DateTime.Now.ToUniversalTime().Date;

			query = query.Where(x => x.StatusId != 1 && (
					(x.StatusId == 2 && x.CreatedOn!.Value.ToUniversalTime() >= now.AddDays(-newDays)) ||
					(x.StatusId == 3 && x.CreatedOn!.Value.ToUniversalTime() >= now.AddDays(-assignedDays)) ||
					(x.StatusId == 4 && x.CreatedOn!.Value.ToUniversalTime() >= now.AddDays(-inProgressDays)) ||
					(x.StatusId == 5 && x.ActualCompletion!.Value.ToUniversalTime() >= now.AddDays(-completedDays)) ||
					(x.StatusId == 6 && x.ActualCompletion!.Value.ToUniversalTime() >= now.AddDays(-closeDays)) ||
					(x.StatusId == 7 && x.ActualCompletion!.Value.ToUniversalTime() >= now.AddDays(-clientVerifyDays)) ||
					(x.StatusId > 7 && x.CreatedOn!.Value.ToUniversalTime() >= now.AddDays(-cancelDays))
			));
		}

		if (roleId != null)
		{
			if (roleId == 1)
			{
				query = query.Where(x => x.TechniciansAssignedBy == userId || x.SupervisorId == userId);
			}
			else if (roleId == 3)
			{
				query = query.Where(x => x.TechniciansAssignedBy == userId);
			}
		}
		query = query.OrderByDescending(x => x.CreatedOn);
		// if (scope == true)
		// {
		// 	query = query.Include(x => x.Locations);
		// }

		return query;
	}
	public Task<int> GetAllCount(int? ppmId, string? filter, List<int>? idList, int? status, bool? isPPMList, string? userId, int? roleId)
	{
		var query = GetAllQueryBuilder(ppmId, filter, idList, status, isPPMList, userId, roleId);
		return query.CountAsync();
	}

	private IQueryable<trPPMs> GetByIdQueryBuilder(int id, bool scope, List<int>? statusList)
	{
		var query = Db.AsTracking();
		query = query.Where(x => x.Id == id);
		// if (scope == true)
		// {
		// 	query = query.Include(x => x.Locations);
		// }
		if (statusList != null && statusList.Count > 0)
		{
			query = query.Where(x => statusList.Contains(x.StatusId!.Value));
		}
		return query;
	}
	public async Task<trPPMs> GetById(int id, bool scope, List<int>? statusList, bool? isThrow = true)
	{
		var query = GetByIdQueryBuilder(id, scope, statusList);
		var result = await query.FirstOrDefaultAsync();
		if (result == null && isThrow == true) throw new NotFoundException("ไม่พบ PPM");
		return result;
	}

	public async Task<trPPMs> GetLast()
	{
		var query = Db.AsQueryable();
		var result = await query.OrderByDescending(x => x.Id).FirstOrDefaultAsync();
		if (result == null) throw new NotFoundException("ไม่พบ PPM");
		return result;
	}
}