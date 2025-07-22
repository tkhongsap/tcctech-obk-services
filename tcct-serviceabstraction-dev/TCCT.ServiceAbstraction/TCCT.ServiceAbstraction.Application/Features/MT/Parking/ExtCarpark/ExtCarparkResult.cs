using System;

namespace TCCT.ServiceAbstraction.Application.Features.MT.Parking.ExtCarpark;

public class ExtCarparkResult
{
    public int status { get; set; }
    public string message { get; set; }
    public ExtCarparkData data { get; set; }
    public int count { get; set; }


    public class ExtCarparkData
    {
        public string? logId { get; set; }
    }
    
}


