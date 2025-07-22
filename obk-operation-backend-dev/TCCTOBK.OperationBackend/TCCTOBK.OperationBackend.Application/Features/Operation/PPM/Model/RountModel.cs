namespace TCCTOBK.OperationBackend.Application.Features.Operation.PPM.Model;
public class RountModel
{
	public Guid id { get; set; }
	public List<FilePair> Files { get; set; } = new();

}
public class FilePair
{
	public int FileId { get; set; }
	public Guid Id { get; set; }
}