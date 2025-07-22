using MediatR;
using TCCTOBK.OperationBackend.Application.Configuration.Commands;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;

namespace TCCTOBK.OperationBackend.Application.Features.Sustainability.BannerManagement.Command.Banner;

public class BannerCommand : AuditableModel, ICommand<BannerResult>
{
	public List<BannerDetail> lstBanner { get; set; } = new List<BannerDetail>();
}

public class BannerDetail
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
}
