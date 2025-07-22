namespace TCCT.ServiceAbstraction.Application.Features.Payment.ArgentoInquiryPaymentTransaction;


public class ArgentoInquiryPaymentTransactionResult
{
	public string? transactionNo { get; set; }
	public string? invoiceNo { get; set; }
	public string? transactionDate { get; set; }
	public string? merchantId { get; set; }
	public string? merchantName { get; set; }
	public string? paymentChannel { get; set; }
	public decimal? amount { get; set; }
	public decimal? paidAmount { get; set; }
	public decimal? fee { get; set; }
	public decimal? feeVat { get; set; }
	public decimal? balance { get; set; }
	public int? transactionStatusId { get; set; }
	public string? description { get; set; }
	public string? deviceProfileId { get; set; }
}
