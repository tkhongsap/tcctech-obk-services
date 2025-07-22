using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Residence.AddResidenceMember;
public class AddResidenceMemberCommand : ICommand<AddResidenceMemberResult>
{
	public string? Firstname { get; set; } = null!;
	public string? Lastname { get; set; } = null!;
	public string? Gender { get; set; } = null!;
	public string? Idcard { get; set; } = null!;
	public string? Passport { get; set; } = null!;
	public string? Phone { get; set; } = null!;
	public string? Email { get; set; } = null!;
	public string? Note { get; set; } = null!;
	public string? CardNumber { get; set; } = null!;
	public string? StartDate { get; set; } = null!;
	public string? EndDate { get; set; } = null!;
	public List<int> ServiceType { get; set; }
	public List<int>? ResidentIDList { get; set; } = null!;
	public bool? CanPreRegister { get; set; } = true;
	public List<CardResidenceList>? CardResidenceList { get; set; } = new List<CardResidenceList>();
	public List<EmailList>? EmailList { get; set; } = default!;
	public List<PhoneList>? PhoneList { get; set; } = default!;
	public List<ImageList>? ImageList { get; set; } = default!;
	public bool? Active { get; set; } = null!;

	public AddResidenceMemberCommand(string? firstname, string? lastname, string? gender, string? idcard, string? passport, string? phone, string? email, string? note, string? cardNumber, string? startDate, string? endDate, List<int> serviceType, List<int>? residentIDList, List<EmailList>? emailList, List<PhoneList>? phoneList, List<ImageList>? imageList, bool? active, List<CardResidenceList>? cardResidenceList, bool? canPreRegister = true)
	{
		Firstname = firstname;
		Lastname = lastname;
		Gender = gender;
		Idcard = idcard;
		Passport = passport;
		Phone = phone;
		Email = email;
		Note = note;
		CardNumber = cardNumber;
		StartDate = startDate;
		EndDate = endDate;
		ServiceType = serviceType;
		ResidentIDList = residentIDList;
		EmailList = emailList;
		PhoneList = phoneList;
		ImageList = imageList;
		CardResidenceList = cardResidenceList;
		Active = active;
		CanPreRegister = canPreRegister;
	}
}

public class EmailList
{
	public string Email { get; set; }
	public bool IsDefault { get; set; }
	public bool Active { get; set; }
}

public class PhoneList
{
	public bool Active { get; set; }
	public string Code { get; set; }
	public string Country { get; set; }
	public bool IsDefault { get; set; }
	public string PhoneNumber { get; set; }
}

public class ImageList
{
	public string Base64 { get; set; }
	public bool IsDefault { get; set; }
	public string Name { get; set; }
}

public class CardResidenceList
{
	public string CardNumber { get; set; }
	public string? StartDate { get; set; }
	public string? EndDate { get; set; }
	public int ResidenceId { get; set; }
}
