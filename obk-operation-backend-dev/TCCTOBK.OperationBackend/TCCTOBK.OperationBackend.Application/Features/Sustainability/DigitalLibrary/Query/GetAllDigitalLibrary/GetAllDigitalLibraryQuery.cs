using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Helper.Table;

namespace TCCTOBK.OperationBackend.Application.Features.Sustainability.DigitalLibraryManagement.Query.GetAllDigitalLibrary;

public class GetAllDigitalLibraryQuery : TableState, IQuery<GetAllDigitalLibraryResult>
{
	public string? Filter { get; set; }
	public int? Status { get; set; }
}
