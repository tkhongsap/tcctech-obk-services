namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetRegisteredVehicles;

public class GetRegisteredVehiclesResult
{
    public List<GetRegisteredVehiclesResultData> registeredVehicles { get; set; }
}

public class GetRegisteredVehiclesResultData
{
    public string licensePlateNumber { get; set; }
    public string vehicleType { get; set; }
}
