
using TCCTOBK.OperationBackend.Application.Features.Marcom.Happening.Model;

namespace TCCTOBK.OperationBackend.Application.Features.Marcom.Happening.Query.GetHappening;
public class GetHappeningResult
{
	public HappeningModel Data { get; set; } = new HappeningModel();
	public int StatusCode { get; set; }
	public string? Message { get; set; }
}

public class CategoryListResult
{
	public List<OptionSelection> Data { get; set; } = new List<OptionSelection>();
	public int StatusCode { get; set; }
	public string? Message { get; set; }
}

public class OptionSelection
{
	public string? Name { get; set; }
	public string? Value { get; set; }
	public bool IsArtC { get; set; }
	public bool IsSelectMenu { get; set; }
}