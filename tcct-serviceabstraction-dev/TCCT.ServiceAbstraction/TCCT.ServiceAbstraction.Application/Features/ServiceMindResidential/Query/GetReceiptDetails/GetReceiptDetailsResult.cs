using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetReceiptDetails;
public class GetReceiptDetailsResult
{
	public GetReceiptDetailsResultmodel data { get; set; }
}

public class GetReceiptDetailsResultmodel
{
	public string? orgId { get; set; }
	public string? id { get; set; }
	public string? invoiceId { get; set; }
	public string? invoicePaymentId { get; set; }
	public string? receiptNo { get; set; }
	public string? receiptDate { get; set; }
	public string? receivedAmount { get; set; }
	public string? tenantId { get; set; }
	public string? unitId { get; set; }
	public string? subTotalAmount { get; set; }
	public string? vatAmount { get; set; }
	public string? whtPercent { get; set; }
	public string? whtAmount { get; set; }
	public string? grandTotalAmount { get; set; }
	public string? remarks { get; set; }
	public string? createdAt { get; set; }
	public string? updatedAt { get; set; }
	public string? pdfFileUrl { get; set; }

	public List<receiptDetail>? receiptDetails { get; set; }
	public propertyData? propertyData { get; set; }
	public tenantData? tenantData { get; set; }
	public paymentData? paymentData { get; set; }
}

public class receiptDetail
{
	public string? orgId { get; set; }
	public string? id { get; set; }
	public string? receiptId { get; set; }
	public string? invoiceDetailId { get; set; }
	public int? receiptSeq { get; set; }
	public string? description1 { get; set; }
	public string? description2 { get; set; }
	public string? subTotalAmount { get; set; }
	public string? vatAmount { get; set; }
	public string? whtPercent { get; set; }
	public string? whtAmount { get; set; }
	public string? grandTotalAmount { get; set; }
}

public class propertyData
{
	public string? companyName { get; set; }
	public string? projectName { get; set; }
	public string? buildingName { get; set; }
	public string? buildingPhaseCode { get; set; }
	public string? unitNumber { get; set; }
	public string? houseNumber { get; set; }
}

public class tenantData
{
	public string? id { get; set; }
	public string? orgId { get; set; }
	public string? email { get; set; }
	public string? countryCode { get; set; }
	public string? phoneNumber { get; set; }
}

public class paymentData
{
	public string? id { get; set; }
	public string? orgId { get; set; }
	public string? tenantId { get; set; }
	public int? invoiceType { get; set; }
	public string? invoiceNo { get; set; }
	public string? transactionNo { get; set; }
	public string? transactionDate { get; set; }
	public string? subCode { get; set; }
	public string? description { get; set; }
	public string? paymentChannel { get; set; }
	public string? amount { get; set; }
	public string? paidAmount { get; set; }
	public string? fee { get; set; }
	public string? feeVat { get; set; }
	public string? balance { get; set; }
	public int? status { get; set; }
	public string? deviceProfileId { get; set; }
	public string? merchantId { get; set; }
	public string? merchantName { get; set; }
	public string? createdAt { get; set; }
	public string? updatedAt { get; set; }
	public string? generateQrApiLogId { get; set; }
	public string? paymentCallbackLogId { get; set; }
	public string? paymentInquiryApiLogId { get; set; }
}