using TCCTOBK.OperationBackend.Application.Features.Sustainability.DigitalLibraryManagement.Command.DigitalLibrary;

namespace TCCTOBK.OperationBackend.Application;

public class DeleteContentManagementSustainability
{
	public Guid? Id { get; set; }

	public DeleteContentManagementSustainability(Guid? id)
	{
		Id = id;
	}
}