using TCCTOBK.OperationBackend.Application.Features.Sustainability.DigitalLibraryManagement.Query.GetAllDigitalLibrary;

namespace TCCTOBK.OperationBackend.Application.Features.Sustainability.DigitalLibrary.Model;
public class DigitalLibraryDataModel
{
	public string? Topic { get; set; }
	public string? Introduce { get; set; }
	public List<DigitalLibraryFile> ListFile { get; set; } = new List<DigitalLibraryFile>();
}

public class DigitalLibraryFile
{
	public Guid? Id { get; set; }
	public string ImageURL { get; set; } = default!;
	public string FileName { get; set; } = default!;
	public string OriginalFileName { get; set; } = default!;
	public string AttachFileName { get; set; } = default!;
	public string? AttachFileURL { get; set; }
	public string OriginalAttachFileName { get; set; } = default!;
	public string AttachFileType { get; set; } = default!;
	public string AttachFileSize { get; set; } = default!;
	public int Order { get; set; } = default!;
	public bool IsDelete { get; set; } = default!;
	public DigitalOrder? ConfigOrder { get; set; }
}

