namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Command.GenerateNewPresigned;
public class GenerateNewPresignedResult
{
	public GenerateNewPresignedData? data { get; set; }
	public string? message { get; set; }
}

public class GenerateNewPresignedData
{
	public UploadUrlData? uploadUrlData { get; set; }
}

public class UploadUrlData
{
	public string? uploadURL { get; set; }
	public string? fileName { get; set; }
	public string? uploadPath { get; set; }
	public string? resourceUrl { get; set; }
}
