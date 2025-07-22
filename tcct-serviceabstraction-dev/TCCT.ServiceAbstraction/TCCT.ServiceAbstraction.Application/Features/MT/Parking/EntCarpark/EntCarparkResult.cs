using System;

namespace TCCT.ServiceAbstraction.Application.Features.MT.Parking.EntCarpark;

public class EntCarparkResult
{
    public int status { get; set; }
    public string message { get; set; }
    public EntCarparkData data { get; set; }
    public int count { get; set; }


    public class EntCarparkData
    {
        public string? logId { get; set; }
        public string? thirdPartyId { get; set; }
    }
    
}


