using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.CreateCWOExternal;
public class CreateCWOExternalCommand : ICommand<CreateCWOExternalResult>
{
	public int CwoTypeId { get; set; }
	public int LocationId { get; set; }
	public int ProblemTypeId { get; set; }
	public string Description { get; set; }
}