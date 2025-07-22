namespace TCCT.ServiceAbstraction.Application.Contracts.FinedayIviva;
public interface IFinedayIvivaService
{
	//IFinedayIvivaLoginService WithLogin();
	IFinedayIvivaMemberService WithMember();
	IFinedayIvivaTenantService WithTenant();
	IFinedayIvivaTransactionService WithTransaction();
}
