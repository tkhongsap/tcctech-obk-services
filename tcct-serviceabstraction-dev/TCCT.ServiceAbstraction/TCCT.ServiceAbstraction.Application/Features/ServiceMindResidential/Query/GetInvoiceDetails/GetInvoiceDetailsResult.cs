using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetVisitorList;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetInvoiceDetails;
public class GetInvoiceDetailsResult
{
	public invoiceModel data { get; set; } = new();
}
public class invoiceModel
{
	public string? orgId { get; set; }
	public string? id { get; set; }
	public string? invoiceNo { get; set; }
	public string? docNo { get; set; }
	public string? companyName { get; set; }
	public string? compBranchName { get; set; }
	public string? companyTaxId { get; set; }
	public string? invoiceDate { get; set; }
	public string? dueDate { get; set; }
	public string? customerCode { get; set; }
	public string? customerName { get; set; }
	public string? customerTaxId { get; set; }
	public string? customerPhone { get; set; }
	public string? customerEmail { get; set; }
	public string? tenantId { get; set; }
	public string? unitId { get; set; }
	public string? subTotalAmount { get; set; }
	public string?	vatAmount { get; set; }
	public string? whtPercent { get; set; }
	public string? whtAmount { get; set; }
	public string? grandTotalAmount { get; set; }
	public string? contractNo { get; set; }
	public string? remarks { get; set; }
	public string? status { get; set; }
	public string? createdAt { get; set; }
	public string? updatedAt { get; set; }
	public string? location { get; set; }
	public string receivedAmount { get; set; }
	public string outstandingAmount { get; set; }
	public string pdfFileUrl { get; set; }
	public List<InvoiceDetail> invoiceDetails { get; set; }
	public PropertyData propertyData { get; set; }
	public TenantData tenantData { get; set; }
}

public class InvoiceDetail
{
	public string? orgId { get; set; }
	public string? id { get; set; }
	public string? invoiceId { get; set; }
	public int? invoiceSeq { get; set; }
	public string? chargeType { get; set; }
	public string? meterReadingId { get; set; }
	public string? description1 { get; set; }
	public string? description2 { get; set; }
	public string? chargeCode { get; set; }
	public string chargeDesc { get; set; }
	public string? subTotalAmount { get; set; }
	public string? vatAmount { get; set; }
	public string? whtPercent { get; set; }
	public string? whtAmount { get; set; }
	public string? grandTotalAmount { get; set; }
}

public class PropertyData
{
	public string? companyName { get; set; }
	public string? projectName { get; set; }
	public string? buildingName { get; set; }
	public string? buildingPhaseCode { get; set; }
	public string? unitNumber { get; set; }
	public string? houseNumber { get; set; }
}

public class TenantData
{
	public string? id { get; set; }
	public string? orgId { get; set; }
	public string? email { get; set; }
	public string? countryCode { get; set; }
	public string? phoneNumber { get; set; }
}
