
using TCCTOBK.OperationBackend.Application.Features.Sustainability.DigitalLibrary.Model;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.DigitalLibraryManagement.Command.DigitalLibrary;

namespace TCCTOBK.OperationBackend.Application.Features.Sustainability.DigitalLibraryManagement.Query.GetAllDigitalLibrary;
public class GetAllDigitalLibraryResult
{
	public DigitalResult Data { get; set; } = new DigitalResult();
	public int StatusCode { get; set; }
	public string? Message { get; set; }
}

public class DigitalResult
{
	public List<DigitalTable> Data { get; set; } = new List<DigitalTable>();
	public DigitalPagination Pagination { get; set; } = new DigitalPagination();
}

public class DigitalPagination
{
	public int Total { get; set; }
	public int Page_number { get; set; }
	public int Total_page { get; set; }
}

public class DigitalTable
{
	public Guid Id { get; set; }
	public string? Topic { get; set; }
	public bool IsHasEN { get; set; }
	public bool IsHasCN { get; set; }
	public bool IsHasTH { get; set; }
	public double? LastUpdate { get; set; }
	public string? Status { get; set; }
	public DigitalOrder? ConfigOrder { get; set; }
}

public class DigitalOrder
{
	public int? Current { get; set; }
	public int? Max { get; set; }
}
