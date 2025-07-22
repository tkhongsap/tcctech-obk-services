namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Command.GeneratePromptPayQr;
public class GeneratePromptPayQrResult
{
	public string? message { get; set; }
	public string? status { get; set; }
	public GeneratePromptPayQrResultData? data { get; set; }
}

public class GeneratePromptPayQrResultData
{
	public string? respCode { get; set; }
	public string? respDesc { get; set; }
	public string? qrImage { get; set; }
	public string? transactionNo { get; set; }
	public int? qrTimeOut { get; set; }
	public string? qrId { get; set; }
	public string? qrExpiredDate { get; set; }
	public string? paymentRecordId { get; set; }
	public string? thirdPartyApiLogId { get; set; }
}

