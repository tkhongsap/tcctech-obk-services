using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Features.SustainabilityMobile.Query.GetMainContentDetail;

namespace TCCTOBK.OperationBackend.Application.Features.SustainabilityMobile.Query.GetDigitalLibraryFile;

public class GetDigitalLibraryFileQuery : IQuery<GetDigitalFileResult>
{
    public GetContentDetail Param { get; set; }
    public GetDigitalLibraryFileQuery(GetContentDetail param)
    {
        Param = param;
    }
}
