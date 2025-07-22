using System;

namespace TCCT.ServiceAbstraction.Application.Features.MT.Parking.UpdateTransactionCarpark;

public class UpdateTransactionCarparkResult
{
    public int status { get; set; }
    public string message { get; set; }
    public UpdateTransactionCarparkData data { get; set; }

    public class UpdateTransactionCarparkData
    {
        public string? logId { get; set; }
        public string? uid { get; set; }
        public string? algType { get; set; }
        public string? accountId { get; set; }
    }
}


