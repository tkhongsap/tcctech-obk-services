using Microsoft.AspNetCore.Http;
using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.Media.Command;

public class CreateMediaCommand : ICommand<CreateMediaResult>
{
    public int CaseId { get; set; }
    public IFormFile Media { get; set; } = null!;
}
