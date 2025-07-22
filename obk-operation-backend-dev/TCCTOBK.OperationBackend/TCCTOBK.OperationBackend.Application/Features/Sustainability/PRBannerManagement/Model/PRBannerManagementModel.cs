
using TCCTOBK.OperationBackend.Application.Features.Sustainability.DigitalLibraryManagement.Command.DigitalLibrary;

namespace TCCTOBK.OperationBackend.Application.Features.Sustainability.PRBannerManagement.Model;
public class PRBannerManagementModel
{
	public Guid? Id { get; set; }
	public string BannerName { get; set; } = default!;
	public string? LinkToURL { get; set; }
	public bool Status { get; set; }
	public bool IsShowRelatedLink { get; set; }
	public int Type { get; set; }
	public bool IsDelete { get; set; }
	public int Order { get; set; }
	public PRBannerManagementLang Detail { get; set; } = new PRBannerManagementLang();
}

public class InitialPRBannerModel
{
	public bool IsHasContent { get; set; }
}

