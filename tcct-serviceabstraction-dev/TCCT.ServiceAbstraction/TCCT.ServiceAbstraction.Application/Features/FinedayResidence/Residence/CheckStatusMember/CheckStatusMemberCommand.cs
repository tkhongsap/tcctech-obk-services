using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Residence.CheckStatusMember;
public class CheckStatusMemberCommand : ICommand<CheckStatusMemberResult>
{
	public string? Email { get; set; }
	public string? Phonenumber { get; set; }


	public CheckStatusMemberCommand(string? email, string? phonenumber)
	{
		Email = email;
		Phonenumber = phonenumber;
	}
}
