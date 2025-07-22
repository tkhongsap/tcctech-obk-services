
namespace TCCTOBK.OperationBackend.Application.Features.Sustainability.BannerManagement.Query.GetBanner;
public class GetBannerResult
{
	public List<Banner> banners {get; set;} = new List<Banner>();
	public int StatusCode { get; set;}
	public string? Message { get; set;}
}

public class Banner
{
	public Guid? Id { get; set; }
	public int Type { get; set; }
	public string ImageURL { get; set; } = default!;
	public string FileName { get; set; } = default!;
	public string OriginalFileName { get; set; } = default!;
	public string? LabelLevel1 { get; set; }
	public string? LabelLevel2 { get; set; }
	public string? LabelLevel1TH { get; set; }
	public string? LabelLevel2TH { get; set; }
	public string? LabelLevel1CN { get; set; }
	public string? LabelLevel2CN { get; set; }
	public string? LabelIntroduce { get; set; }
	public string? LabelIntroduceTH { get; set; }
	public string? LabelIntroduceCN { get; set; }
	public bool IsDelete { get; set; }
	public bool IsChanged { get; set; }
    public string? UpdatedByName { get; set; }
    public string? UpdatedDate { get; set; }
}