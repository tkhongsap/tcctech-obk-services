using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Features.Netatmo.Command.Synchomeschedule;

namespace TCCT.ServiceAbstraction.Application.Features.Netatmo.Command.ValidateNewHomeScheduleCooling;
public class ValidateNewHomeScheduleCoolingCommand : ICommand<ValidateNewHomeScheduleCoolingResult>
{
	public List<Template> Template { get; set; } = null!;
}

public class Template
{	
	public bool? IsHome { get; set; }
	public string? StartTime { get; set; }
	public string? EndTime { get; set; }
}