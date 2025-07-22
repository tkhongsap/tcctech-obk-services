

namespace TCCTOBK.OperationBackend.Application.Contracts.DataModel.CasesRepository;
public class CreateCaseMediasModel
{
	public int Id { get; set; }
	public int CaseId { get; set; }
	public string? FileName { get; set; }
	public string? Data { get; set; }
	public string? MimeType { get; set; }
	public CreateCaseMediasModel(int id, int caseId, string? fileName, string? data, string? mimeType)
	{
		Id = id;
		CaseId = caseId;
		FileName = fileName;
		Data = data;
		MimeType = mimeType;
	}
}