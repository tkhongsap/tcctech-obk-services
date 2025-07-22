namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.PPMWO.Command;
public class PPMWORequest
{
	public int MasterWorkOrderId { get; set; }
	public int ChecklistMapId { get; set; }

	public PPMWORequest()
	{

	}

	public PPMWORequest(int masterWorkOrderId, int checklistMapId)
	{
		MasterWorkOrderId = masterWorkOrderId;
		ChecklistMapId = checklistMapId;
	}
}
