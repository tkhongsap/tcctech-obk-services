using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.FinedayResidence.PreRegister.Invite;

public class InviteResidenceVisitorCommand : ICommand<InviteResidenceVisitorResult>
{
    public string guestInviteName { get; set; }
    public int residenceID { get; set; }
    public int locationID { get; set; }
    public Guid personID { get; set; }
    public List<InviteSchedule> inviteSchedule { get; set; }
}

public class InviteSchedule
{
    public string startDate { get; set; }
    public string endDate { get; set; }
}
