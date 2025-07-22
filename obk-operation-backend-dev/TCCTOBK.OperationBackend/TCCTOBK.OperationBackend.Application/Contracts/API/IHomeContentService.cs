using Refit;
using TCCTOBK.OperationBackend.Application.Features.CMS.HomeContent.Model;

namespace TCCTOBK.OperationBackend.Application.Contracts.API;
public interface IHomeContentService
{
	[Post("/upload")]
	Task<HomeContentUploadResponse> Upload([Body] HomeContentUploadRequest data);

}
