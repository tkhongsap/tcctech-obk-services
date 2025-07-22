namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.DMS.Command;
public class DocumentManagementResult
{
	public int Id { get; set; }
	public string DocumentName { get; set; } = null!;
	public int ObjectKey { get; set; }
	public string ObjectType { get; set; } = null!;
	public string Description { get; set; } = null!;
	public double LatestVersionId { get; set; }
	public string SearchTags { get; set; } = null!;
	public string AttachmentType { get; set; } = null!;
	public bool IsDefault { get; set; }
	public bool IsHidden { get; set; }
	public string CreatedBy { get; set; } = null!;
	public DateTime CreatedOn { get; set; }
	public string ModifiedBy { get; set; } = null!;
	public DateTime ModifiedOn { get; set; }
	public bool IsSynced { get; set; }
	public List<DocumentVersion> DocumentVersions { get; set; } = new List<DocumentVersion>();
}

public class DocumentVersion
{
	public int Id { get; set; }
	public int DocumentId { get; set; }
	public double VersionId { get; set; }
	public string PhysicalFilePath { get; set; } = null!;
	public string VersionedFileName { get; set; } = null!;
	public string MimeType { get; set; } = null!;
	public string CreatedBy { get; set; } = null!;
	public DateTime CreatedOn { get; set; }
	public string ModifiedBy { get; set; } = null!;
	public DateTime ModifiedOn { get; set; }
}