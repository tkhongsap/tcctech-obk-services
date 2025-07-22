namespace TCCTOBK.OperationBackend.Application;

public class DocumentCertisResult
{
	public int Id { get; set; }
	public string? DocumentName { get; set; }
	public int ObjectKey { get; set; }
	public string? ObjectType { get; set; }
	public string? Description { get; set; }
	public double LatestVersionId { get; set; } = default!;
	public string? SearchTags { get; set; }
	public string? AttachmentType { get; set; }
	public bool IsDefault { get; set; }
	public bool IsHidden { get; set; }
	public string? CreatedBy { get; set; }
	public DateTime CreatedOn { get; set; }
	public string? ModifiedBy { get; set; }
	public DateTime ModifiedOn { get; set; }
	public bool IsSynced { get; set; }
	public List<UploadDocumentCertisVersionResult> DocumentVersions { get; set; } = new();
}

public class UploadDocumentCertisVersionResult
{
	public int Id { get; set; }
	public int DocumentId { get; set; }
	public double VersionId { get; set; }
	public string? PhysicalFilePath { get; set; }
	public string? VersionedFileName { get; set; }
	public string? MimeType { get; set; }
	public string? CreatedBy { get; set; }
	public DateTime CreatedOn { get; set; }
	public string? ModifiedBy { get; set; }
	public DateTime ModifiedOn { get; set; }
}