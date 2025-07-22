namespace TCCTOBK.OperationBackend.Application.Features.Mobile.MasterData.Query.CWODefaultConfig;
public class CWODefaultConfigResult
{
	public string CompletionSigDisabled { get; set; }
	public string ClosureSigDisabled { get; set; }
	public string ClientVerifySigDisabled { get; set; }
	public string QrCodeValidationEnabled { get; set; }
	public string QrCodeValidationMandatory { get; set; }
	public string EnableQrScan { get; set; }
}
