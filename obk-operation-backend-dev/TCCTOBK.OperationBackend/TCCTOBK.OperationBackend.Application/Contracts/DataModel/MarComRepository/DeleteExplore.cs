namespace TCCTOBK.OperationBackend.Application;

public class DeleteExplore
{
	public Guid? Id { get; set; }
	public bool? IsCategory { get; set; }

	public DeleteExplore(Guid? id, bool? isCategory)
	{
		Id = id;
		IsCategory = isCategory;
	}
}
