using System;
using TCCTOBK.OperationBackend.Application.Configuration.Commands;
using TCCTOBK.OperationBackend.Application.Contracts.Minio;
using TCCTOBK.OperationBackend.Domain;

namespace TCCTOBK.OperationBackend.Application.Features.Urgent.Command.ServiceRequest.upload;

public class UploadHandler : ICommandHandler<UploadCommand, UploadResult>
{
	private readonly IMinioService _minioservice;

	public UploadHandler(IMinioService minioservice)
	{
		_minioservice = minioservice;
	}

	public async Task<UploadResult> Handle(UploadCommand request, CancellationToken cancellationToken)
	{
		using (var ms = new MemoryStream())
		{
			request.File.CopyTo(ms);
			var bytes = ms.ToArray();
			string base64 = Convert.ToBase64String(bytes);
			await _minioservice.PutObject(DomainConfig.Minio.BucketServiceRequest, base64, request.FileName);
			var result = await _minioservice.GetObject(DomainConfig.Minio.BucketServiceRequest, request.FileName);
			return new UploadResult { fileURL = result };
		}
	}
}
