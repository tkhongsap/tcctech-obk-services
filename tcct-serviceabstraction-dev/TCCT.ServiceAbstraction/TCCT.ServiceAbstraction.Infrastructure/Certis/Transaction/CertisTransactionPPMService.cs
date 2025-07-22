using TCCT.ServiceAbstraction.Application.Contracts.Certis;
using TCCT.ServiceAbstraction.Application.Contracts.Certis.Transaction;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.AcknowledgeAssignment;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.AssignSupervisor;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.AssignTechnician;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.CheckListMaps;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.ClientVerify;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.Close;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.Comment.Command;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.Comment.Query;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.Complete;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.ConfirmTaskCompletion;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.DocumentsRelatedById;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.PPMMasterWorkOrder;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.PPMWO.Command;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.PPMWO.Query;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.Rework;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.ServicingObject;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.SupervisorReject;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.Task;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.TechnicianReject;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.Technicians;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.Transactions;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.UpdateTask;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.PPMUpdate;

namespace TCCT.ServiceAbstraction.Infrastructure.Certis.Transaction;
public partial class CertisTransactionPPMService : ICertisTransactionPPMService
{
	ICertisEndpointProvider _endpointprovider;
	ICertisMemoryCache _cache;

	public CertisTransactionPPMService(ICertisMemoryCache cache, ICertisEndpointProvider endpointProvider)
	{
		_endpointprovider = endpointProvider;
		_cache = cache;
	}
	public Task<AcknowledgeAssignmentResult> AcknowledgeAssignment(int woId, Guid ackedBy, string acknowledgementSignature)
	{
		return _endpointprovider.PPMAcknowledgeAssignment(woId, ackedBy, acknowledgementSignature);
	}

	public Task<AssignSupervisorResult> AssignSupervisor(int woId, Guid supervisorId, Guid assignedBy)
	{
		return _endpointprovider.PPMAssignSupervisor(woId, supervisorId, assignedBy);
	}

	public Task<AssignTechnicianResult> AssignTechnician(int woId, string technicianIds, Guid assignedBy)
	{
		return _endpointprovider.PPMAssignTechnician(woId, technicianIds, assignedBy);
	}

	public Task<ClientVerifyResult> ClientVerify(int woId, string clientVerificationComment, string clientVerifiedBy, string clientVerificationSignature, Guid clientVerificationSubmittedBy)
	{
		return _endpointprovider.PPMClientVerify(woId, clientVerificationComment, clientVerifiedBy, clientVerificationSignature, clientVerificationSubmittedBy);
	}

	public Task<CloseResult> CloseResult(int woId, string closureComment, string completionVerifiedBy, string closureSignature, Guid closedBy)
	{
		return _endpointprovider.PPMCloseResult(woId, closureComment, completionVerifiedBy, closureSignature, closedBy);
	}

	public Task<CommentResult> Comment(int woId, int commentTypeId, string comment, DateTime commentedOn, Guid commentedBy)
	{
		return _endpointprovider.PPMComment(woId, commentTypeId, comment, commentedOn, commentedBy);
	}

	public Task<CompleteResult> Complete(int woId, string completionComment, string completionSignature, Guid completedBy)
	{
		return _endpointprovider.PPMComplete(woId, completionComment, completionSignature, completedBy);
	}

	public Task<ConfirmTaskCompletionResult> ConfirmTaskCompletion(int objectId, Guid confirmedBy)
	{
		return _endpointprovider.PPMConfirmTaskCompletion(objectId, confirmedBy);
	}

	public Task<PPMWOResult> PPMWO(int mwoId, int checklistMapId)
	{
		return _endpointprovider.PPMWO(mwoId, checklistMapId);
	}

	public Task<ReworkResult> Rework(int woId, string reasonToRework, Guid reworkRequestedBy)
	{
		return _endpointprovider.PPMRework(woId, reasonToRework, reworkRequestedBy);
	}

	public Task<SupervisorRejectResult> SupervisorReject(int woId, Guid rejectedBy)
	{
		return _endpointprovider.PPMSupervisorReject(woId, rejectedBy);
	}

	public Task<TechnicianRejectResult> TechnicianReject(int woId, Guid rejectedBy, Guid technicianId)
	{
		return _endpointprovider.PPMTechnicianReject(woId, rejectedBy, technicianId);
	}

	public Task<UpdateTaskResult> UpdateTask(int id, string taskStatus, string remarks, string reading, Guid updatedBy, DateTime updatedOn, string documentId)
	{
		return _endpointprovider.PPMUpdateTask(id, taskStatus, remarks, reading, updatedBy, updatedOn, documentId);
	}
	public Task<List<PPMMasterResult>> Master()
	{
		return _endpointprovider.PPMMaster();
	}
	public Task<List<PPMMasterWorkOrderResult>> MasterWorkOrder()
	{
		return _endpointprovider.PPMMasterWorkOrder();
	}

	public Task<List<CheckListMapsResult>> CheckListMap()
	{
		return _endpointprovider.PPMCheckListMap();
	}
	public Task<List<TechniciansResult>> Technicians(string id)
	{
		return _endpointprovider.PPMTechnicians(id);
	}
	public Task<List<CommentsResult>> Comments(string woid)
	{
		return _endpointprovider.PPMComments(woid);
	}

	public Task<List<TransactionsResult>> Transactions(string woid)
	{
		return _endpointprovider.PPMTransactions(woid);
	}

	public Task<List<TaskResult>> GetTask(string workOrderId)
	{
		return _endpointprovider.GetTask(workOrderId);
	}

	public Task<List<ServicingObjectResult>> GetServicingObject(string workOrderId)
	{
		return _endpointprovider.GetServicingObject(workOrderId);
	}

	public Task<List<PPMDocumentsRelatedByIdResult>> DocumentsRelatedById(string id)
	{
		return _endpointprovider.PPMDocumentsRelatedById(id);
	}

	public Task<List<PPMUpdateResult>> PPMUpdate(string? fromDate, string? toDate, string? countData, string? skipData)
	{
		return _endpointprovider.PPMUpdate(fromDate, toDate, countData, skipData);
	}
}
