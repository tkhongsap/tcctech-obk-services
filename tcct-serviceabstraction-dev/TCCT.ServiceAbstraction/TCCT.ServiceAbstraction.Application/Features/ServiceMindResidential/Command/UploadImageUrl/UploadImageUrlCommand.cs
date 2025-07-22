using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using Microsoft.AspNetCore.Http;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Command.UploadImageUrl;

public class UploadImageUrlCommand : ICommand<UploadImageUrlResult>
{
	public string UploadURL { get; set; }
	public IFormFile Image { get; set; } = null!;
}