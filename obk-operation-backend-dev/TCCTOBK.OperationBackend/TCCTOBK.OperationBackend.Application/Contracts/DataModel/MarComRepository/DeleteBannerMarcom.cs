namespace TCCTOBK.OperationBackend.Application;

public class DeleteBannerMarcom
{
	public Guid? Id { get; set; }

	public DeleteBannerMarcom(Guid? id)
	{
		Id = id;
	}
}
