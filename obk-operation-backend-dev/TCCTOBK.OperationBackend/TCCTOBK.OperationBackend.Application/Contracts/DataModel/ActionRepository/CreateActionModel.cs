using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Model;

namespace TCCTOBK.OperationBackend.Application.Contracts.DataModel.ActionRepository;
public class CreateActionModel
{
	public string Name { get; set; }
	public string? Description { get; set; }
	public Guid ActionType { get; set; }
	public GuardTourActionMetaDataResult? MetaData { get; set; }

	public CreateActionModel(string name, string? description, Guid actionType, GuardTourActionMetaDataResult? metaData)
	{
		Name = name;
		Description = description;
		ActionType = actionType;
		MetaData = metaData;
	}
}
