using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Features.SustainabilityMobile.Query.GetMainContent;

namespace TCCTOBK.OperationBackend.Application.Features.SustainabilityMobile.Query.GetDigitalLibraryCategory;

public class GetDigitalLibraryCategoryQuery : IQuery<GetDigitalCategoryResult>
{
    public GetContent Param { get; set; }
    public GetDigitalLibraryCategoryQuery(GetContent param)
    {
        Param = param;
    }
}
