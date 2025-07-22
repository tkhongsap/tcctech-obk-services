namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.Priorities;
public class PriorityLevelResult
{
	public int Id { get; set; }
	public string Code { get; set; } = string.Empty;
	public string Name { get; set; } = string.Empty;
	public string ColorCode { get; set; } = string.Empty;
	public int SLAConfigId { get; set; }
}