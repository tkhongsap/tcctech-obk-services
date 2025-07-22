namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Command.RegisterNewTenant;
public class RegisterNewTenantResult
{
	public Data data { get; set; } = new Data();
}

public class Data
{
	public int syncToMtel { get; set; }
	public bool syncToBim { get; set; }
}
