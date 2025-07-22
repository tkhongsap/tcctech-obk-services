using System;
using System.Net;
using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts.Minio;
using TCCTOBK.OperationBackend.Application.Exceptions;
using TCCTOBK.OperationBackend.Domain;

namespace TCCTOBK.OperationBackend.Application.Features.LBS.Wayfinding.Query.GetDefaultIcon;

public class GetDefaultIconHandler : IQueryHandler<GetDefaultIconQuery, GetDefaultIconResult>
{
	private readonly IMinioService _minioservice;

	public GetDefaultIconHandler(IMinioService minioservice)
	{
		_minioservice = minioservice;
	}

	public async Task<GetDefaultIconResult> Handle(GetDefaultIconQuery request, CancellationToken cancellationToken)
	{
		var objectName = request.DefaultIcon;
		if (!objectName.EndsWith(".svg"))
		{
			objectName += ".svg";
		}
		var url = await _minioservice.GetObject(DomainConfig.Minio.BucketLBS, objectName);
		if (url == null)
		{
			throw new NotFoundException("File not found.");
		}
		using (var httpClient = new HttpClient())
		{
			httpClient.DefaultRequestHeaders.Add("User-Agent", "Other");
			var result = await httpClient.GetAsync(url);
			if (result.StatusCode != HttpStatusCode.OK)
			{
				var errContent = await result.Content.ReadAsStringAsync();
				throw new BadRequestException("Can't get image from minio " + errContent);
			}
			var content = await result.Content.ReadAsByteArrayAsync();
			var contentType = result.Content.Headers.GetValues("Content-Type").First();
			return new GetDefaultIconResult(contentType, content);
		}
	}
}
