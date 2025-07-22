namespace TCCTOBK.OperationBackend.Application;

public class GetDocumentImageResult
{
	public string ContentType { get; set; } = default!;
	public byte[] ByteArray { get; set; } = default!;
}
