namespace TCCTOBK.OperationBackend.Application;

public class CWOTransactionsResult : CWOTransaction
{
	public int? ImageId { get; set; }
	public bool IsImageAvailable => ImageId != null;
}
