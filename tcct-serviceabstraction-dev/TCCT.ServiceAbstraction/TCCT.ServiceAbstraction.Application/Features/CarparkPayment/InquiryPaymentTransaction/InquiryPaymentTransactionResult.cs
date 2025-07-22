namespace TCCT.ServiceAbstraction.Application.Features.CarparkPayment.InquiryPaymentTransaction;

public class InquiryPaymentTransactionResult
{
	/*
{
		"transactionNo": "ARG24061901728294",
		"invoiceNo": "2024061912084410",
		"transactionDate": "2024-06-19 13:38:43",
		"merchantId": "00870194-565e-4242-ac80-bc4180a58440",
		"merchantName": "Parking One Bangkok",
		"paymentChannel": "promptpay",
		"amount": 60,
		"paidAmount": null,
		"fee": 0,
		"feeVat": 0,
		"balance": 0,
		"transactionStatusId": 3,
		"description": "Thai Qr",
		"deviceProfileId": null
}
	 */

	public string TransactionNo { get; set; }
	public string InvoiceNo { get; set; }
	public string TransactionDate { get; set; }
	public string MerchantId { get; set; }
	public string MerchantName { get; set; }
	public string PaymentChannel { get; set; }
	public decimal Amount { get; set; }
	public decimal? PaidAmount { get; set; }
	public decimal Fee { get; set; }
	public decimal FeeVat { get; set; }
	public decimal Balance { get; set; }
	public int TransactionStatusId { get; set; }
	public string Description { get; set; }
	public string DeviceProfileId { get; set; }

}
