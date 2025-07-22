namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.DocumentsRelatedById;
public class DocumentsRelatedByIdResult
{
	public int Id { get; set; }
	public string DocumentName { get; set; }
	public int ObjectKey { get; set; }
	public string ObjectType { get; set; }
	public string Description { get; set; }
	public double LatestVersionId { get; set; }
	public string SearchTags { get; set; }
	public string AttachmentType { get; set; }
	public bool IsDefault { get; set; }
	public bool IsHidden { get; set; }
	public string CreatedBy { get; set; }
	public DateTime CreatedOn { get; set; }
	public string ModifiedBy { get; set; }
	public DateTime ModifiedOn { get; set; }

}
