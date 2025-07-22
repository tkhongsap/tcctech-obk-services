using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Command.GenerateNewPresigned;
public class GenerateNewPresignedCommand : ICommand<GenerateNewPresignedResult>
{
	public string TenantId { get; set; }
	public string Filename { get; set; }
	public string MimeType { get; set; }
	public string Type { get; set; }
}