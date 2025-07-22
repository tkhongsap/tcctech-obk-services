using TCCTOBK.OperationBackend.Application.Features.Sustainability.DigitalLibrary.Model;

namespace TCCTOBK.OperationBackend.Application;

public class DigitalSustainability
{
	public Guid? Id { get; set; }
	public bool Status { get; set; }
	public DigitalLibraryDataModel LibraryEn { get; set; }
	public DigitalLibraryDataModel LibraryTh { get; set; }
	public DigitalLibraryDataModel LibraryCn { get; set; }

	public DigitalSustainability(bool status, DigitalLibraryDataModel libraryEn, DigitalLibraryDataModel libraryTh, DigitalLibraryDataModel libraryCn, Guid? id)
	{
		Id = id;
		Status = status;
		LibraryEn = libraryEn;
		LibraryTh = libraryTh;
		LibraryCn = libraryCn;
	}
}
