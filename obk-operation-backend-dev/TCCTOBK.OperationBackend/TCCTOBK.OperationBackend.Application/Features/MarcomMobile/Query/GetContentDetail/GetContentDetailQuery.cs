using TCCTOBK.OperationBackend.Application.Configuration.Queries;

namespace TCCTOBK.OperationBackend.Application.Features.Marcom.Query.GetContentDetail;

public class GetContentDetailQuery : IQuery<ContentDetailResult>
{
    public GetContentDetail Param { get; set; }
    public GetContentDetailQuery(GetContentDetail param)
    {
        Param = param;
    }
}
