using TCCTOBK.OperationBackend.Application.Configuration.Commands;
using TCCTOBK.OperationBackend.Application.Features.CMS.HomeContent.Model;

namespace TCCTOBK.OperationBackend.Application.Features.CMS.HomeContent.Command.UploadHomeContent;

public class UploadHomeContentCommand : HomeContentUploadRequest, ICommand<UploadHomeContentResult>
{

}