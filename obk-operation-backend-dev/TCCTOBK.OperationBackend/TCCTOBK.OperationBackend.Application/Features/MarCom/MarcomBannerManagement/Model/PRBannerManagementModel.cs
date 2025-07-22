
using TCCTOBK.OperationBackend.Application.Features.Sustainability.DigitalLibraryManagement.Command.DigitalLibrary;

namespace TCCTOBK.OperationBackend.Application.Features.Sustainability.PRBannerManagement.Model;
public class MarcomBannerManagementModel
{
	public Guid? Id { get; set; }
	public string BannerName { get; set; } = default!;
	public string? LinkToURL { get; set; }
	public bool Status { get; set; }
	public bool IsShowRelatedLink { get; set; }
	public int Type { get; set; }
	public bool IsDelete { get; set; }
	public int Order { get; set; }
	public double Start { get; set; }
	public double? End { get; set; }
	public bool Alltime { get; set; }
	public PRBannerManagementLang Detail { get; set; } = new PRBannerManagementLang();
}

public class InitialMarcomBannerModel
{
	public bool IsHasContent { get; set; }
}

