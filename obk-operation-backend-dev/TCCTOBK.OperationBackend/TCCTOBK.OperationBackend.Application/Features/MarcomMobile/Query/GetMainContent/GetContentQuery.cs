using TCCTOBK.OperationBackend.Application.Configuration.Queries;

namespace TCCTOBK.OperationBackend.Application.Features.Marcom.Query.GetMainContent;

public class GetContentQuery : IQuery<GetMainContentResult>
{
    public GetContent Param { get; set; }
    public GetContentQuery(GetContent param)
    {
        Param = param;
    }
}
