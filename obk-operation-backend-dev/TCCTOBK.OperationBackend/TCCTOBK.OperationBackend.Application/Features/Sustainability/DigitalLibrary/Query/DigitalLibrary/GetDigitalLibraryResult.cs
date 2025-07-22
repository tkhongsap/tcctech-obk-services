
using TCCTOBK.OperationBackend.Application.Features.Sustainability.DigitalLibrary.Model;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.DigitalLibraryManagement.Command.DigitalLibrary;

namespace TCCTOBK.OperationBackend.Application.Features.Sustainability.DigitalLibraryManagement.Query.GetDigitalLibrary;
public class GetDigitalLibraryResult
{
	public DigitalLibraryByIdResult Data { get; set; } = new DigitalLibraryByIdResult();
	public int StatusCode { get; set; }
	public string? Message { get; set; }
}

public class DigitalLibraryByIdResult
{
	public DigitalLibraryData Data { get; set; } = new DigitalLibraryData();
	public bool Status { get; set; }
}