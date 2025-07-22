namespace TCCTOBK.OperationBackend.Application;

public class DeleteBannerSustainability
{
	public Guid? Id { get; set; }

	public DeleteBannerSustainability(Guid? id)
	{
		Id = id;
	}
}
