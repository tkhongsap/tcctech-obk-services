namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Command.UpdateVisitorStatus;
public class UpdateVisitorStatusResult
{
	public string? message { get; set; }
	public VisitorStatus data { get; set; } = new VisitorStatus();
}

public class VisitorStatus
{
	public string? id { get; set; }
	public string? orgId { get; set; }
	public string? companyId { get; set; }
	public bool isActive { get; set; }
	public int sourceOfRequest { get; set; }
	public string? qrCodeData { get; set; }
	public string? createdBy { get; set; }
	public string createdAt { get; set; }
	public string updatedAt { get; set; }
	public string? updatedBy { get; set; }
}
