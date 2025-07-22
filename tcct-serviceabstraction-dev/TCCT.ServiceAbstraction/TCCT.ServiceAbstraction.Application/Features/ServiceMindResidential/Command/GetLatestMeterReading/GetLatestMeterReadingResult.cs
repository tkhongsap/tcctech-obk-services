namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Command.GetLatestMeterReading;
public class GetLatestMeterReadingResult
{
	public int? total { get; set; }
	public int? per_page { get; set; }
	public int? offset { get; set; }
	public int? to { get; set; }
	public int? last_page { get; set; }
	public int? current_page { get; set; }
	public int? from { get; set; }
	public int? next_page { get; set; }
	public List<GetLatestMeterReadingData>? data { get; set; }
}

public class GetLatestMeterReadingData
{
	public string? meterTypeId { get; set; }
	public string? meterType { get; set; }
	public string? meterNumber { get; set; }
	public string? billMonth { get; set; }
	public int? billYear { get; set; }
	public string? readingUnit { get; set; }
	public string? fromReading { get; set; }
	public string? fromDate { get; set; }
	public string? toReading { get; set; }
	public string? toDate { get; set; }
	public string? netPaymentAmount { get; set; }
	public string? usage { get; set; }
	public GetLatestMeterReadingPropertyUnit? propertyUnit { get; set; }
	public GetLatestMeterReadingBuildingPhase? buildingPhase { get; set; }
	public GetLatestMeterReadingProject? project { get; set; }
}

public class GetLatestMeterReadingPropertyUnit
{
	public int? id { get; set; }
	public string? unitNumber { get; set; }
	public string? houseNumber { get; set; }
}

public class GetLatestMeterReadingBuildingPhase
{
	public int? id { get; set; }
	public string? buildingPhaseCode { get; set; }
	public string? nameEn { get; set; }
	public string? nameTh { get; set; }
}

public class GetLatestMeterReadingProject
{
	public int? id { get; set; }
	public string? nameEn { get; set; }
	public string? nameTh { get; set; }
}

