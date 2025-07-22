using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Features.Marcom.Query.GetMainContent;

namespace TCCTOBK.OperationBackend.Application.Features.Marcom.Query.ClearCache;

public class ClearCacheQuery : IQuery<ResultApi>
{
    public GetContent Param { get; set; }
    public ClearCacheQuery(GetContent param)
    {
        Param = param;
    }
}
