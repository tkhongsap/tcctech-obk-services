using System.Text.Json;
using System.Text.Json.Nodes;
using System.Text.RegularExpressions;
using MediatR;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Contracts.DataModel.StaffRepository;
using UploadMultipleNamespace = TCCTOBK.OperationBackend.Application.Features.Urgent.Command.ServiceRequest.UploadMultiple;
using TCCTOBK.OperationBackend.Domain.Entities;
using TCCTOBK.OperationBackend.Application.Features.Urgent.Command.ServiceRequest.UploadMultiple;

namespace TCCTOBK.OperationBackend.Application.Features.Urgent.Command.ServiceRequest.Upsert;

public class UpsertServiceRequestHandler : IRequestHandler<UpsertServiceRequestCommand, trServiceRequest>
{
    private readonly IUnitOfWork _uow;
    IMediator _mediator;

    public UpsertServiceRequestHandler(IUnitOfWork uow, IMediator mediator)
    {
        _uow = uow;
        _mediator = mediator;
    }

    public async Task<trServiceRequest> Handle(UpsertServiceRequestCommand request, CancellationToken cancellationToken)
    {
        if (request.Id.HasValue)
        {
            return await UpdateServiceRequest(request);
        }
        else
        {
            return await CreateServiceRequest(request);
        }
    }

    private async Task<trServiceRequest> UpdateServiceRequest(UpsertServiceRequestCommand request)
    {
        var serviceRequest = await _uow.ServiceRequestRepository.GetById((Guid)request.Id);
        if (serviceRequest == null)
        {
            throw new KeyNotFoundException($"Service request with ID {request.Id.Value} not found.");
        }

        serviceRequest.Status = request.Status;
        serviceRequest.Comment = request.Comment;
        serviceRequest.UpdatedBy = request.UpdatedBy;
        serviceRequest.UpdatedDate = request.UpdatedDate;
        serviceRequest.UpdatedByName = request.UpdatedByName;

        await _uow.ServiceRequestRepository.Update(serviceRequest);
        return serviceRequest;
    }

    private async Task<trServiceRequest> CreateServiceRequest(UpsertServiceRequestCommand request)
    {
        var uploadMultipleCommand = new UploadMultipleCommand();
        var imageResult = new List<string>();
        if (request.Files != null && request.Files.Count > 0)
        {
            foreach (var file in request.Files)
            {
                var imageBytes = Convert.FromBase64String(file.Base64Data.Split(";base64,").Last());
                var uploadObject = new UploadRequestImage
                {
                    FileName = file.FileName,
                    Base64Data = Convert.ToBase64String(imageBytes)
                };
                uploadMultipleCommand.Images.Add(uploadObject);
            }
            imageResult = await _mediator.Send(uploadMultipleCommand);
        }
        var serviceRequest = new trServiceRequest();
        
            serviceRequest.Title = request.Title;
            serviceRequest.Description = request.Description;
            serviceRequest.Acc_id = request.Acc_id ?? Guid.Empty;
            serviceRequest.Status = request.Status ?? "Pending";
            serviceRequest.Comment = request.Comment;
            serviceRequest.Location = request.Location;
            serviceRequest.Image = JsonSerializer.Serialize(imageResult);
            serviceRequest.Priority = request.Priority;
            serviceRequest.SREventId = JsonSerializer.Serialize(request.SREventId);
            serviceRequest.SRProblemId = JsonSerializer.Serialize(request.SRProblemId);
            serviceRequest.SREventOther = request.SREventOther;
            serviceRequest.SRProblemOther = request.SRProblemOther;
            serviceRequest.LocationType = request.LocationType;
            serviceRequest.CreatedBy = request.CreatedBy;
            serviceRequest.CreatedByName = request.CreatedByName;
            serviceRequest.CreatedDate = request.CreatedDate;
            serviceRequest.UpdatedBy = request.UpdatedBy;
            serviceRequest.UpdatedDate = request.UpdatedDate;
            serviceRequest.UpdatedByName = request.UpdatedByName;
        

        await _uow.ServiceRequestRepository.Add(serviceRequest);
        return serviceRequest;
    }
}
