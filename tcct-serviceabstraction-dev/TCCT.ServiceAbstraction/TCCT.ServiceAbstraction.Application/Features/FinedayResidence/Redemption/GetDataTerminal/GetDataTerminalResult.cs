using System;

namespace TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Redemption.GetDataTerminal;

public class GetDataTerminalResult
{
    public int terminalID { get; set; }
    public string terminalName { get; set; }
    public string rateCode { get; set; }
    public string rateDetail { get; set; }
}

