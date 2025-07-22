using System;

namespace TCCTOBK.OperationBackend.Application.Features.LBS.Wayfinding.Query.GetDefaultIcon;

public class GetDefaultIconResult
{
	public string ContentType { get; set; }
	public byte[] Content { get; set; }

	public GetDefaultIconResult(string contentType, byte[] content)
	{
		ContentType = contentType;
		Content = content;
	}
}
