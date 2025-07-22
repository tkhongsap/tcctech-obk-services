
namespace TCCTOBK.OperationBackend.Application;

public class DeleteDigitalSustainability
{
	public Guid? Id { get; set; }

	public DeleteDigitalSustainability( Guid? id)
	{
		Id = id;
	}
}
