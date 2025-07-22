using System.Text.Json;
using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Contracts.Minio;
using TCCTOBK.OperationBackend.Domain;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Application.Features.Urgent.Query.ServiceRequest.GetServiceRequest;

public class GetServiceRequestHandler : IQueryHandler<GetServiceRequestQuery, GetServiceRequestResult>
{
    IUnitOfWork _uow;
    private readonly IMinioService _minioservice;
    public GetServiceRequestHandler(IUnitOfWork uow, IMinioService minioservice)
    {
        _uow = uow;
        _minioservice = minioservice;
    }
    public async Task<GetServiceRequestResult> Handle(GetServiceRequestQuery request, CancellationToken cancellationToken)
    {

        var serviceRequest = await _uow.ServiceRequestRepository.GetById(request.Id);

        var sREventsDecoded = JsonSerializer.Deserialize<List<Guid>>(
            serviceRequest.SREventId
        );
        var sRProblemDecoded = JsonSerializer.Deserialize<List<Guid>>(
            serviceRequest.SRProblemId
        );
        var sRProblems = await _uow.SRProblemRepository.GetFromList(sRProblemDecoded);
        var sREvents = await _uow.SREventRepository.GetFromList(sREventsDecoded);

        List<string> imageList = new List<string>();
        foreach (var item in JsonSerializer.Deserialize<List<string>>(serviceRequest.Image))
        {
            var getImage = await _minioservice.GetObject(DomainConfig.Minio.BucketServiceRequest, item);
            imageList.Add(getImage);
        }

        var result = new GetServiceRequestResult
        {
            Id = serviceRequest.Id,
            Title = serviceRequest.Title,
            Description = serviceRequest.Description,
            Acc_id = serviceRequest.Acc_id,
            Status = serviceRequest.Status,
            Comment = serviceRequest.Comment,
            Location = serviceRequest.Location,
            Image = JsonSerializer.Serialize(imageList),
            Priority = serviceRequest.Priority,
            SREventId = serviceRequest.SREventId,
            SRProblemId = serviceRequest.SRProblemId,
            CreatedBy = serviceRequest.CreatedBy,
            CreatedDate = serviceRequest.CreatedDate.ToUniversalTime(),
            CreatedByName = serviceRequest.CreatedByName,
            UpdatedBy = serviceRequest.UpdatedBy,
            UpdatedDate = serviceRequest.UpdatedDate.ToUniversalTime(),
            UpdatedByName = serviceRequest.UpdatedByName,
            Event = sREvents,
            Problem = sRProblems,
        };
        return result;
    }
}
