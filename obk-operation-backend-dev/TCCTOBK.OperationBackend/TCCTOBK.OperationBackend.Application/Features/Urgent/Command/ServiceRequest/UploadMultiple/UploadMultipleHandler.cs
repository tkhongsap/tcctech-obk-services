using TCCTOBK.OperationBackend.Application.Configuration.Commands;
using TCCTOBK.OperationBackend.Application.Contracts.Minio;
using TCCTOBK.OperationBackend.Domain;

namespace TCCTOBK.OperationBackend.Application.Features.Urgent.Command.ServiceRequest.UploadMultiple;

public class UploadMultipleHandler : ICommandHandler<UploadMultipleCommand, List<string>>
{
    private readonly IMinioService _minioservice;

    public UploadMultipleHandler(IMinioService minioservice)
    {
        _minioservice = minioservice;
    }

    public async Task<List<string>> Handle(UploadMultipleCommand request, CancellationToken cancellationToken)
    {
        var uploadedFiles = new List<string>();

        foreach (var file in request.Images)
        {
            try
            {
                var objectName = $"{Guid.NewGuid()}_{file.FileName}";
                await _minioservice.PutObject(DomainConfig.Minio.BucketServiceRequest, file.Base64Data, objectName);
                var result = await _minioservice.GetObject(DomainConfig.Minio.BucketServiceRequest, objectName);
                uploadedFiles.Add(objectName);

            }
            catch (Exception ex)
            {
                throw new InvalidOperationException($"Upload failed for {file.FileName}: {ex.Message}");
            }
        }
        return uploadedFiles;
    }
}
