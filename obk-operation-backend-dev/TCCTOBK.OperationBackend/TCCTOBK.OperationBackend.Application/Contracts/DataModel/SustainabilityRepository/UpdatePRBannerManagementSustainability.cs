using TCCTOBK.OperationBackend.Application.Features.Sustainability.DigitalLibraryManagement.Command.DigitalLibrary;

namespace TCCTOBK.OperationBackend.Application;

public class PRBannerManagementSustainability
{
	public Guid? Id { get; set; }
	public string BannerName { get; set; }
	public string? LinkToURL { get; set; }
	public bool Status { get; set; }
	public bool IsShowRelatedLink { get; set; }
	public int Type { get; set; }
	public bool IsDelete { get; set; }
	public int Order { get; set; }

	public PRBannerManagementLang Detail { get; set; }

	public PRBannerManagementSustainability(string bannerName, bool status, bool isShowRelatedLink, bool isDelete, int order, PRBannerManagementLang detail, int type, Guid? id, string? linkToURL)
	{
		Id = id;
		BannerName = bannerName;
		Type = type;
		Status = status;
		IsShowRelatedLink = isShowRelatedLink;
		IsDelete = isDelete;
		Order = order;
		Detail = detail;
		LinkToURL = linkToURL;
	}
}