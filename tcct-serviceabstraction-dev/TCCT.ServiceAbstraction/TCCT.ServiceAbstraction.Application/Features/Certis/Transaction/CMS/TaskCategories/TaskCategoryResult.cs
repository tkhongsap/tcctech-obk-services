namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.TaskCategories;
public class TaskCategoryResult
{
	public int Id { get; set; }
	public string Name { get; set; } = string.Empty;
	public string Description { get; set; } = string.Empty;
	public int Type { get; set; }
}
