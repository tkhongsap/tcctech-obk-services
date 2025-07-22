namespace TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.PPM.DefaultConfig;
public class PPMDefaultConfigResult
{
	public string AcknowledgementSigDisabled { get; set; } = null!;
	public string CompletionSigDisabled { get; set; } = null!;
	public string ClosureSigDisabled { get; set; } = null!;
	public string ClientVerifySigDisabled { get; set; } = null!;
	public string EnableQrScan { get; set; } = null!;
}
