namespace TCCTOBK.OperationBackend.Application.Helper.Auditable;
public class AuditableModel
{
	public Guid CreatedBy { get; set; }
	public string? CreatedByName { get; set; }
	public DateTime CreatedDate { get; set; }
	public Guid UpdatedBy { get; set; }
	public string? UpdatedByName { get; set; }
	public DateTime UpdatedDate { get; set; }
}
