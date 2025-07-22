using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Helper.Table;

namespace TCCTOBK.OperationBackend.Application.Features.Sustainability.DigitalLibraryManagement.Query.GetDigitalLibrary;

public class GetDigitalLibraryQuery : IQuery<GetDigitalLibraryResult>
{
	public Guid DLID { get; set; }
	public GetDigitalLibraryQuery(Guid dlid)
	{
		DLID = dlid;
	}
}
