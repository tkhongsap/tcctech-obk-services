using System.Text.Json.Serialization;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.CaseAssetCategories;
public class CaseAssetCategoriesResult
{
	public int Id { get; set; }
	public string Name { get; set; }
	public string AssetCategoryCode { get; set; }
	[JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
	public int? AssetGroupId { get; set; }
	[JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
	public int? DataPointTemplateId { get; set; }
}


