using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.PPMWO.Command;
public class PPMWOCommand : ICommand<PPMWOResult>
{
	public int MwoId { get; set; }
	public int ChecklistMapId { get; set; }

	public PPMWOCommand(PPMWORequest request)
	{
		MwoId = request.MasterWorkOrderId;
		ChecklistMapId = request.ChecklistMapId;
	}
}
