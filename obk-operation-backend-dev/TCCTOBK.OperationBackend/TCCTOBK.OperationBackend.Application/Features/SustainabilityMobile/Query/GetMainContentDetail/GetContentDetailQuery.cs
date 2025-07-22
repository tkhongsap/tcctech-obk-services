using TCCTOBK.OperationBackend.Application.Configuration.Queries;

namespace TCCTOBK.OperationBackend.Application.Features.SustainabilityMobile.Query.GetMainContentDetail;

public class GetContentDetailQuery : IQuery<GetContentDetailResult>
{
    public GetContentDetail Param { get; set; }
    public GetContentDetailQuery(GetContentDetail param)
    {
        Param = param;
    }
}
