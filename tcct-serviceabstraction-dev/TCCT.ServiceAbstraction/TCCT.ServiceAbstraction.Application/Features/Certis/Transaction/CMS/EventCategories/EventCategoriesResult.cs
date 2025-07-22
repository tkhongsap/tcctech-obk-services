namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.EventCategories;
public class EventCategoriesResult
{
	public int Id { get; set; }
	public string Code { get; set; } = string.Empty;
	public string Name { get; set; } = string.Empty;
	public string ColorCode { get; set; } = string.Empty;
	public int UserGroupSelection { get; set; }
	public string Description { get; set; } = string.Empty;
}
