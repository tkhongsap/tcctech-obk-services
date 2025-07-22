namespace TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Residence.GetDetailResidenceMemberByPersonID;
public class GetDetailResidenceMemberByPersonIDResult {
    public string? personID { get; set; }
    public string? firstname { get; set; }
    public string? lastname { get; set; }
    public string? gender { get; set; }
    public string? idcard { get; set; }
    public string? passport { get; set; }
    public string? note { get; set; }
    public bool? active { get; set; }
    public List<ServiceTypeList>? serviceType { get; set; }
    public List<ResidentIDList>? residentIDList { get; set; }
    public List<CardResidenceList>? cardResidenceList { get; set; }
    public List<EmailList>? emailList { get; set; }
    public List<PhoneList>? phoneList { get; set; }
    public List<ImageList>? imageList { get; set; }
    public List<AuthorizeFloorList>? authorizeFloorList { get; set; } = new List<AuthorizeFloorList>();
    public List<CardCarParkList>? cardCarParkList { get; set; } = new List<CardCarParkList>();
    public bool? canPreRegister { get; set; }
    public bool? canRedemption { get; set; }
    public RedemptionData? redemptionData { get; set; }
}

public class RedemptionData
{
    public int? userId { get; set; }
    public bool? active { get; set; }
    public string? firstname { get; set; }
    public string? lastname { get; set; }
    public string? departmentId { get; set; }
    public string? userlevel { get; set; }
}

public class CardCarParkList
{
    public string? licencePlate { get; set; }
    public int? vehicleType { get; set; }
    public string? cardNumber { get; set; }
}

public class AuthorizeFloorList
{
    public int? locationID { get; set; }
    public bool? isDefaultFloor { get; set; }
}

public class ServiceTypeList
{
    public int? serviceTypeID { get; set; }
    public string? serviceTypeName { get; set; }
    public bool? active { get; set; }
}

public class ResidentIDList
{
    public int? residenceID { get; set; }
    public bool? active { get; set; }
}

public class CardResidenceList
{
    public string? cardNumber { get; set; }
	public string? startDate { get; set; }
	public string? endDate { get; set; }
	public int? residenceId { get; set; }
}

public class EmailList
{
    public int? id { get; set; }
    public string? email { get; set; }
    public bool? isDefault { get; set; }
    public bool? active { get; set; }
}

public class PhoneList
{
    public int? id { get; set; }
    public string? country { get; set; }
    public string? code { get; set; }
    public string? phoneNumber { get; set; }
    public bool? isDefault { get; set; }
    public bool? active { get; set; }
}

public class ImageList
{
    public string? base64 { get; set; }
	public bool? isDefault { get; set; }
	public string? name { get; set; }
}
