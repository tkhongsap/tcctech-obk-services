
using TCCTOBK.OperationBackend.Application.Features.Sustainability.ContentManagement.Model;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.ContentManagement.Command.ContentManagement;

namespace TCCTOBK.OperationBackend.Application.Features.Sustainability.ContentManagement.Query.GetContentManagement;
public class GetContentManagementResult
{
	public ContentManagementModel Data { get; set; } = new ContentManagementModel();
	public int StatusCode { get; set; }
	public string? Message { get; set; }
}

public class MainContentManagementResult
{
	public List<OptionSelection> Data { get; set; } = new List<OptionSelection>();
	public int StatusCode { get; set; }
	public string? Message { get; set; }
}

public class OptionSelection
{
	public string? Name { get; set; }
	public string? Value { get; set; }
}