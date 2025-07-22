namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Command.GetPaymentTransaction;
public class GetPaymentTransactionResult
{
	public string? status { get; set; }
	public GetPaymentTransactionData? data { get; set; }
}

public class GetPaymentTransactionData
{
	public string? transactionNo { get; set; }
	public string? invoiceNo { get; set; }
	public string? transactionDate { get; set; }
	public string? merchantId { get; set; }
	public string? merchantName { get; set; }
	public string? paymentChannel { get; set; }
	public int? amount { get; set; }
	public int? paidAmount { get; set; }
	public int? fee { get; set; }
	public int? feeVat { get; set; }
	public int? balance { get; set; }
	public int? transactionStatusId { get; set; }
	public string? description { get; set; }
	public string? deviceProfileId { get; set; }
}
