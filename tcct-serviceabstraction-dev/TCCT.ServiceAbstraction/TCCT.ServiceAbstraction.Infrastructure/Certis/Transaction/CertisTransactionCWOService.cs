using TCCT.ServiceAbstraction.Application.Contracts.Certis;
using TCCT.ServiceAbstraction.Application.Contracts.Certis.Transaction;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.AcknowledgeAssignment;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.AssignSupervisor;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.AssignTechnician;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.ClientVerify;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.Close;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.CommentById;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.Complete;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.ConfirmTaskCompletion;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.CWO;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.DocumentsRelatedById;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.Master;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.Pause;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.Resume;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.Rework;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.SupervisorReject;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.SupportiveTeam;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.Task;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.TechnicianReject;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.Transactions;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.UpdateTask;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.WorkOffline;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.WorkOnline;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.CWOUpdate;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.CreateCWOExternal;

namespace TCCT.ServiceAbstraction.Infrastructure.Certis.Transaction;
public partial class CertisTransactionCWOService : ICertisTransactionCWOService
{
	ICertisEndpointProvider _endpointprovider;
	ICertisMemoryCache _cache;

	public CertisTransactionCWOService(ICertisMemoryCache cache, ICertisEndpointProvider endpointProvider)
	{
		_endpointprovider = endpointProvider;
		_cache = cache;
	}
	public Task<AcknowledgeAssignmentResult> AcknowledgeAssignment(int cwoId, Guid ackedBy, string ackVerifiedBy, string acknowledgementSignature, string supportiveTechnicianIds, bool isWorkingOffline, string workOfflineReason, int locationId, string description, int requesterId, int assetId)
	{
		return _endpointprovider.CWOAcknowledgeAssignment(cwoId, ackedBy, ackVerifiedBy, acknowledgementSignature, supportiveTechnicianIds, isWorkingOffline, workOfflineReason, locationId, description, requesterId, assetId);
	}

	public Task<AssignSupervisorResult> AssignSupervisor(int cwoId, Guid supervisorId, Guid assignedBy, int locationId, string description, int requesterId, int asset)
	{
		return _endpointprovider.CWOAssignSupervisor(cwoId, supervisorId, assignedBy, locationId, description, requesterId, asset);
	}

	public Task<AssignTechnicianResult> AssignTechnician(int cwoId, Guid assignedBy, Guid technicianId, string operatorNote, int locationId, string description, int requesterId, int asset)
	{
		return _endpointprovider.CWOAssignTechnician(cwoId, assignedBy, technicianId, operatorNote, locationId, description, requesterId, asset);
	}

	public Task<ClientVerifyResult> ClientVerify(int cwoId, string clientVerificationComment, string clientVerifiedBy, string clientVerificationSignature, Guid clientVerificationSubmittedBy)
	{
		return _endpointprovider.CWOClientVerify(cwoId, clientVerificationComment, clientVerifiedBy, clientVerificationSignature, clientVerificationSubmittedBy);
	}

	public Task<CloseResult> Close(int cwoId, string closureComment, string completionVerifiedBy, string closureSignature, Guid closedBy)
	{
		return _endpointprovider.CWOClose(cwoId, closureComment, completionVerifiedBy, closureSignature, closedBy);
	}

	public Task<Application.Features.Certis.Transaction.CWO.Comment.Command.CommentResult> Comment(int cwoId, int commentTypeId, string comment, DateTime commentedOn, Guid commentedBy)
	{
		return _endpointprovider.CWOComment(cwoId, commentTypeId, comment, commentedOn, commentedBy);
	}

	public Task<CompleteResult> Complete(int cwoId, string completionComment, string completionAckedBy, string completionSignature, Guid completedBy, int locationId, string description, int requesterId, int? assetId)
	{
		return _endpointprovider.CWOComplete(cwoId, completionComment, completionAckedBy, completionSignature, completedBy, locationId, description, requesterId, assetId);
	}

	public Task<ConfirmTaskCompletionResult> ConfirmTaskCompletion(int cwoId, Guid confirmedBy)
	{
		return _endpointprovider.CWOConfirmTaskCompletion(cwoId, confirmedBy);
	}

	public Task<CWOResult> CWO(DateTime requestedOn, int requesterId, int cwoTypeId, int problemTypeId, int priorityId, int serviceCategoryId, int locationId, Guid createdBy, string description, int assetId)
	{
		return _endpointprovider.CWO(requestedOn, requesterId, cwoTypeId, problemTypeId, priorityId, serviceCategoryId, locationId, createdBy, description, assetId);
	}

	public Task<PauseResult> Pause(int cwoId, Guid pausedBy, string reason)
	{
		return _endpointprovider.CWOPause(cwoId, pausedBy, reason);
	}

	public Task<ResumeResult> Resume(int cwoId, Guid resumedBy)
	{
		return _endpointprovider.CWOResume(cwoId, resumedBy);
	}

	public Task<ReworkResult> Rework(int cwoId, string reasonToRework, Guid reworkRequestedBy)
	{
		return _endpointprovider.CWORework(cwoId, reasonToRework, reworkRequestedBy);
	}

	public Task<SupervisorRejectResult> SupervisorReject(int cwoId, Guid rejectedBy, int locationId, string description, int requesterId, int assetId)
	{
		return _endpointprovider.CWOSupervisorReject(cwoId, rejectedBy, locationId, description, requesterId, assetId);
	}

	public Task<TechnicianRejectResult> TechnicianReject(int cwoId, Guid rejectedBy, Guid technicianId, string operatorNote, int locationId, string description, int requesterId, int assetId)
	{
		return _endpointprovider.CWOTechnicianReject(cwoId, rejectedBy, technicianId, operatorNote, locationId, description, requesterId, assetId);
	}

	public Task<UpdateTaskResult> UpdateTask(int id, string taskStatus, string remark, string reading, Guid updatedBy, DateTime updatedOn)
	{
		return _endpointprovider.CWOUpdateTask(id, taskStatus, remark, reading, updatedBy, updatedOn);
	}

	public Task<WorkOfflineResult> WorkOffline(int cwoId, Guid workOfflineBy, string reason)
	{
		return _endpointprovider.CWOWorkOffline(cwoId, workOfflineBy, reason);
	}

	public Task<WorkOnlineResult> WorkOnline(int cwoId, Guid reactivatedBy)
	{
		return _endpointprovider.CWOWorkOnline(cwoId, reactivatedBy);
	}

	public Task<List<TaskResult>> Task(string cwoIdsCsv)
	{
		return _endpointprovider.CWOTask(cwoIdsCsv);
	}
	public Task<List<CWOMasterResult>> Master()
	{
		return _endpointprovider.CWOMaster();
	}

	public Task<List<CWOUpdateResult>> CWOUpdate(string? fromDate, string? toDate, string? countData, string? skipData)
	{
		return _endpointprovider.CWOUpdate(fromDate, toDate, countData, skipData);
	}

	public Task<List<Application.Features.Certis.Transaction.CWO.Comment.Query.CommentResult>> GetComments(string cwoIdsCsv)
	{
		return _endpointprovider.GetComments(cwoIdsCsv);
	}

	public Task<List<SupportiveTeamResult>> SupportiveTeam(string id)
	{
		return _endpointprovider.CWOSupportiveTeam(id);
	}
	public Task<List<TransactionsResult>> Transactions(string id)
	{
		return _endpointprovider.CWOTransactions(id);
	}
	public Task<List<CommentByIdResult>> CommentById(string id)
	{
		return _endpointprovider.CWOCommentById(id);
	}
	public Task<List<DocumentsRelatedByIdResult>> DocumentsRelatedById(string id)
	{
		return _endpointprovider.CWODocumentsRelatedById(id);
	}
	public Task<CreateCWOExternalResult> CWOExternal(CreateCWOExternalCommand data)
	{
		return _endpointprovider.CWOExternal(data);
	}
}