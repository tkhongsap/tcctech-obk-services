namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.DMS.Query.DmsById;
public class DmsDetailByIdResult
{
	public int Id { get; set; }
	public string DocumentName { get; set; } = string.Empty;
	public int ObjectKey { get; set; }
	public string ObjectType { get; set; } = string.Empty;
	public string Description { get; set; } = string.Empty;
	public double LatestVersionId { get; set; }
	public string SearchTags { get; set; } = string.Empty;
	public string AttachmentType { get; set; } = string.Empty;
	public bool IsDefault { get; set; }
	public bool IsHidden { get; set; }
	public string CreatedBy { get; set; } = string.Empty;
	public DateTime CreatedOn { get; set; }
	public string ModifiedBy { get; set; } = string.Empty;
	public DateTime ModifiedOn { get; set; }
	public bool IsSynced { get; set; }
	public List<object> DocumentVersions { get; set; } = new List<object>();
}
