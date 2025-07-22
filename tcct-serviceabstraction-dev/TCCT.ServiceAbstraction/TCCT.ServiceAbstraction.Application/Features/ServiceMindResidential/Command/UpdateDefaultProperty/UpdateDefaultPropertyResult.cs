namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Command.UpdateDefaultProperty;
public class UpdateDefaultPropertyResult
{

	public string? message { get; set; }

	public Property property { get; set; } = new Property();
}

public class Property
{
	public string? propertyUnitId { get; set; }
}