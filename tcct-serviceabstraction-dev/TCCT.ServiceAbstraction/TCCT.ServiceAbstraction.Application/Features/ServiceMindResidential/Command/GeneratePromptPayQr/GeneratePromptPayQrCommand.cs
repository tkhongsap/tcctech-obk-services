using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Command.GeneratePromptPayQr;

public class GeneratePromptPayQrCommand : ICommand<GeneratePromptPayQrResult>
{
	public string TenantId { get; set; }
	public int InvoiceType { get; set; }
	public string InvoiceNo { get; set; }
	public string Description { get; set; }
	public decimal Amount { get; set; }
	public string SubCode { get; set; } 
	public bool? Cache { get; set; } = false;
}