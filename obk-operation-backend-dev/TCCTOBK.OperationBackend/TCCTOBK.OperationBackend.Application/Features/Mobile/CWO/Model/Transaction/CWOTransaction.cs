namespace TCCTOBK.OperationBackend.Application;

public class CWOTransaction
{
	public int Id { get; set; }
	public int CwoId { get; set; }
	public string? Message { get; set; }
	public string? CreatedBy { get; set; }
	public DateTime CreatedOn { get; set; }
	public string Comment { get; set; } = "-";
	public string CreatedDate { get; set; }
}
