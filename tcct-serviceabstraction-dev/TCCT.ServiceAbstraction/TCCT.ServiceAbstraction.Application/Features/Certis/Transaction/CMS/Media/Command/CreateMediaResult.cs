using System;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.Media.Command;

public class CreateMediaResult
{
    public int CaseId { get; set; }
    public string MediaName { get; set; } = null!;
    public bool IsSuccess { get; set; }
}
