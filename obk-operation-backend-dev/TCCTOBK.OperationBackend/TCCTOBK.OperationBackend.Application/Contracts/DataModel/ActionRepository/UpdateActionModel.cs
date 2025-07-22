using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Model;

namespace TCCTOBK.OperationBackend.Application.Contracts.DataModel.ActionRepository;
public class UpdateActionModel
{
	public Guid AID { get; set; }
	public string Name { get; set; }
	public string? Description { get; set; }
	public GuardTourActionMetaDataResult? MetaData { get; set; } = default!;

	public UpdateActionModel(Guid aid, string name, string? description, GuardTourActionMetaDataResult metaData)
	{
		AID = aid;
		Name = name;
		Description = description;
		MetaData = metaData;
	}
}
