using System;
using TCCTOBK.OperationBackend.Application.Configuration.Commands;
using TCCTOBK.OperationBackend.Application.Contracts.Minio;
using TCCTOBK.OperationBackend.Domain;

namespace TCCTOBK.OperationBackend.Application.Features.LBS.Wayfinding.Command.UploadDefaultIcon;

public class UploadDefaultIconHandler : ICommandHandler<UploadDefaultIconCommand, UploadDefaultIconResult>
{
	private readonly IMinioService _minioservice;

	public UploadDefaultIconHandler(IMinioService minioservice)
	{
		_minioservice = minioservice;
	}

	public async Task<UploadDefaultIconResult> Handle(UploadDefaultIconCommand request, CancellationToken cancellationToken)
	{
		using (var ms = new MemoryStream())
		{
			request.File.CopyTo(ms);
			var bytes = ms.ToArray();
			string base64 = Convert.ToBase64String(bytes);
			await _minioservice.PutObject(DomainConfig.Minio.BucketLBS, base64, request.FileName);
			var result = await _minioservice.GetObject(DomainConfig.Minio.BucketLBS, request.FileName);
			return new UploadDefaultIconResult { fileURL = result };
		}
	}
}
