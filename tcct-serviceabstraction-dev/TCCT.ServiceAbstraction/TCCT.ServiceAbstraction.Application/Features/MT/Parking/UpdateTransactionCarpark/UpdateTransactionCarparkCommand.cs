using System;
using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.MT.Parking.UpdateTransactionCarpark;

public class UpdateTransactionCarparkCommand : ICommand<UpdateTransactionCarparkResult>
{
    public string logId { get; set; }
    public string algType { get; set; }
    public Guid uid { get; set; }
    public Guid accountId { get; set; }
}
