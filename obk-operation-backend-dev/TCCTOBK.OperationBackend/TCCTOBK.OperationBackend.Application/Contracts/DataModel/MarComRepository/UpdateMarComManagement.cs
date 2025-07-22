
using TCCTOBK.OperationBackend.Application.Features.Sustainability.DigitalLibraryManagement.Command.DigitalLibrary;

namespace TCCTOBK.OperationBackend.Application;

public class MarcomManagementDataModel
{
	public Guid? Id { get; set; }
	public string BannerName { get; set; }
	public string? LinkToURL { get; set; }
	public bool Status { get; set; }
	public bool IsShowRelatedLink { get; set; }
	public int Type { get; set; }
	public bool IsDelete { get; set; }
	public int Order { get; set; }
	public double Start { get; set; }
	public double? End { get; set; }
	public bool Alltime { get; set; }
	public MarcomBannerManagementLang Detail { get; set; } = new MarcomBannerManagementLang();

	public MarcomManagementDataModel(string bannerName, bool status, bool isShowRelatedLink, bool isDelete, int order, MarcomBannerManagementLang detail, int type, Guid? id, string? linkToURL,double start, double? end,bool alltime)
	{
		Id = id;
		BannerName = bannerName;
		Type = type;
		Status = status;
		IsShowRelatedLink = isShowRelatedLink;
		IsDelete = isDelete;
		Order = order;
		LinkToURL = linkToURL;
		Detail = detail;
		Start = start;
		End = end;
		Alltime = alltime;
	}
}