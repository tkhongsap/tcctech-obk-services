using MediatR;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Application.Features.Urgent.Command.ServiceRequest.Upsert;

public class UpsertServiceRequestCommand : AuditableModel, IRequest<trServiceRequest>
{
    public Guid? Id { get; set; }
    public string? Title { get; set; }
    public string? Description { get; set; }
    public Guid? Acc_id { get; set; }
    public string? Status { get; set; } = "Pending";
    public string? Comment { get; set; }
    public string? Location { get; set; }
    public string? Image { get; set; }
    public string? Priority { get; set; }
    public List<string>? SREventId { get; set; }
    public List<string>? SRProblemId { get; set; }
    public string? SREventOther { get; set; }
    public string? SRProblemOther { get; set; }
    public string? LocationType { get; set; }
    public List<UploadRequest>? Files { get; set; }
}


public class UploadRequest
{
    public string? FileName { get; set; }
    public string? Base64Data { get; set; }
}