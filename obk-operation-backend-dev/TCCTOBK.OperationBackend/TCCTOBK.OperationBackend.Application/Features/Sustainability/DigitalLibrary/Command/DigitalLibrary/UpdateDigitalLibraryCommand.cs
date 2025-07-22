using MediatR;
using TCCTOBK.OperationBackend.Application.Configuration.Commands;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.DigitalLibrary.Model;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;

namespace TCCTOBK.OperationBackend.Application.Features.Sustainability.DigitalLibraryManagement.Command.DigitalLibrary;

public class DigitalLibraryCommand : AuditableModel, ICommand<DigitalLibraryResult>
{
	public Guid? Id { get; set; }
	public bool Status { get; set; }
	public DigitalLibraryData Data { get; set; } = new DigitalLibraryData();
}

public class DigitalLibraryData
{
	public DigitalLibraryDataModel En { get; set; } = new DigitalLibraryDataModel();
	public DigitalLibraryDataModel Th { get; set; } = new DigitalLibraryDataModel();
	public DigitalLibraryDataModel Cn { get; set; } = new DigitalLibraryDataModel();
}
