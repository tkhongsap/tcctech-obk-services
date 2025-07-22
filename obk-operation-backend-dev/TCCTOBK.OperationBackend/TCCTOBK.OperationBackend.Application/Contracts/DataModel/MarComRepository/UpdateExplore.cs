
using TCCTOBK.OperationBackend.Application.Features.Marcom.Explore.Model;

namespace TCCTOBK.OperationBackend.Application;

public class ExploreDataModel
{
	public Guid? Id { get; set; }
	public bool Status { get; set; }
	public bool IsShowRelate { get; set; }
	public bool IsDelete { get; set; }
	public int Order { get; set; }
	public List<string>? Tag { get; set; } = new List<string>();
	public ExploreLang Detail { get; set; } = new ExploreLang();

	public ExploreDataModel(bool status, bool isDelete, int order, ExploreLang detail,Guid? id, bool isShowRelate, List<string>? tag)
	{
		Id = id;
		Status = status;
		IsDelete = isDelete;
		Order = order;
		Detail = detail;
		IsShowRelate = isShowRelate;
		Tag = tag;
	}
}