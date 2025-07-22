namespace TCCTOBK.OperationBackend.Application;

public class DeleteEvent
{
	public Guid? Id { get; set; }

	public DeleteEvent(Guid? id)
	{
		Id = id;
	}
}
