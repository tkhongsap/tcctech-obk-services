namespace TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.CWO.CWODefaultConfig;
public class CWODefaultConfigResult
{
	public string AcknowledgementSigDisabled { get; set; } = null!;
	public string CompletionSigDisabled { get; set; } = null!;
	public string ClosureSigDisabled { get; set; } = null!;
	public string ClientVerifySigDisabled { get; set; } = null!;
	public string QrCodeValidationEnabled { get; set; } = null!;
	public string QrCodeValidationMandatory { get; set; } = null!;
	public string EnableQrScan { get; set; } = null!;
}
