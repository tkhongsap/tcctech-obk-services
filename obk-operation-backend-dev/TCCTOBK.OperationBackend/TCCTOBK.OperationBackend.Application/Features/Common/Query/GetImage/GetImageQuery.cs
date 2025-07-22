using TCCTOBK.OperationBackend.Application.Configuration.Queries;

namespace TCCTOBK.OperationBackend.Application.Features.Common.Query.GetImage;
public class GetImageQuery : IQuery<List<GetImageResult>>
{
	public required string ImageList { get; set; }
}
