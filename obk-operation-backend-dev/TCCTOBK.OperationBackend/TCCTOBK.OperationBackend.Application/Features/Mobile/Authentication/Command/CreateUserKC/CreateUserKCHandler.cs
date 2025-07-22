using System.Text.Json;
using MediatR;
using Org.BouncyCastle.Asn1.Ocsp;
using Org.BouncyCastle.Ocsp;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Contracts.API;
using TCCTOBK.OperationBackend.Application.Contracts.DataModel.AuthRepository;
using TCCTOBK.OperationBackend.Application.Exceptions;
using TCCTOBK.OperationBackend.Application.Features.CMS.MemberManagement.Model;
using TCCTOBK.OperationBackend.Application.Features.Mobile.Core;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;
using TCCTOBK.OperationBackend.Application.Helper.Service;
using TCCTOBK.OperationBackend.Domain;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.Authentication.Command.CreateUserKC;

internal class CreateUserKCHandler : IRequestHandler<CreateUserKCCommand, CreateUserKCResult>
{
	private readonly IAbstractionService _abstractionService;
	private readonly IUnitOfWork _uow;
	private readonly IClientSiteService _clientSiteService;
	public CreateUserKCHandler(IAbstractionService abstractionService, IUnitOfWork uow, IClientSiteService clientSiteService)
	{
		_abstractionService = abstractionService;
		_uow = uow;
		_clientSiteService = clientSiteService;
	}


	public async Task<CreateUserKCResult> Handle(CreateUserKCCommand request, CancellationToken cancellationToken)
	{
		// initail data
		request.EmailOrPhone = request.EmailOrPhone.ToLower();
		var data = new CreateUserKCRequestModel
		{
			EmailOrPhone = request.EmailOrPhone,
			Password = request.Password,
			Company = request.Company,
			FunctionRoleLocation = request.FunctionRoleLocation,
			Firstname = request.FirstName,
			Lastname = request.LastName,
		};

		var dataService = new MemberDataJsonModel
		{
			Email = request.EmailOrPhone,
			Name = "",
			EmailActivities = new(),
		};
		string dataJson = "{}";
		// create user in KC
		var checkmember = await _uow.MemberRepository.GetByEmailLowerWithOutActive(request.EmailOrPhone);
		if (checkmember != null && checkmember.tenantMembers.Any(x => x.TID == Constant.TENANT_OPERATION_APP_ID && x.CSID == _clientSiteService.ClientSiteId)) throw new BadRequestException("Email นี้มีอยู่ในระบบแล้ว");

		// all role
		var roles = await _uow.RoleRepository.GetRoleByRefId(request.UserType);
		var roleId = roles.Select(role => role.RID).ToList();
		var refIds = roles.Select(role => role.RefId).ToList();

		var godViewRoles = new List<int>() { Constant.CERTIS_DCC_ROLE_ID, Constant.CERTIS_FMC_MANAGER_ROLE_ID, Constant.CERTIS_SOC_MANAGER_ROLE_ID };
		if (refIds.Intersect(godViewRoles).Any())
		{
			if (string.IsNullOrEmpty(request.FirstName) || string.IsNullOrEmpty(request.LastName)) throw new BadRequestException("First name and last name is required");
			dataService.Name = data.Firstname + " " + data.Lastname;
			dataJson = JsonSerializer.Serialize(dataService);
		}

		// find data in mozart
		var techniciansMaster = await _abstractionService.MasterData.GetAllFMTechnician();
		var technicianServiceMaster = await _abstractionService.MasterData.FMTechnicianServices();
		var supervisorMaster = await _abstractionService.MasterData.FMsupervisors();
		var supervisorServiceMaster = await _abstractionService.MasterData.FMSupervisorsServices();

		var user = new List<UserProfileModel>();
		foreach (var item in techniciansMaster)
		{
			var u = new UserProfileModel()
			{
				Id = item.Id,
				Email = item.Email,
				FullName = item.FullName,
				FirstName = item.FirstName,
				LastName = item.LastName,
				Disabled = item.Disabled,
				UserType = "technician"
			};
			user.Add(u);
			var socfindInMozart = user.FirstOrDefault(x => x.Email != null && x.Email.Equals(request.EmailOrPhone, StringComparison.OrdinalIgnoreCase));
		}
		foreach (var item in supervisorMaster)
		{
			var u = new UserProfileModel()
			{
				Id = item.id,
				Email = item.email,
				FullName = item.fullName,
				FirstName = item.firstName,
				LastName = item.lastName,
				Disabled = item.disabled,
				UserType = "supervisor"
			};
			user.Add(u);
		}

		var onboardRole = new List<int>() { Constant.CERTIS_SUPERVISOR_ROLE_ID, Constant.CERTIS_OSTECH_ROLE_ID, Constant.CERTIS_SOC_ROLE_ID };

		if (refIds.Intersect(onboardRole).Any())
		{
			// TODO Check by phone number
			if (refIds.Contains(Constant.CERTIS_SOC_ROLE_ID))
			{
				var findInMozart = user.FirstOrDefault(x => x.Email != null && x.Email.Equals(request.EmailOrPhone, StringComparison.OrdinalIgnoreCase));
				dataService.Email = request.EmailOrPhone ?? "";
				dataService.Name = $"{data.Firstname} {data.Lastname}" ?? "";
				dataService.EmailActivities = new();
				dataService.TechnicianService = new();
				dataJson = JsonSerializer.Serialize(dataService);

				if (findInMozart != null)
				{
					var technicianService = technicianServiceMaster.Where(x => x.TechnicianId == findInMozart.Id).ToList();
					if (technicianService != null)
					{

						dataService.Email = findInMozart.Email ?? request.EmailOrPhone;
						dataService.Name = findInMozart.FullName ?? request.FirstName + " " + request.LastName;
						dataService.EmailActivities = new();
						dataService.TechnicianService = technicianService;
						dataJson = JsonSerializer.Serialize(dataService);
						data.Firstname = findInMozart.FirstName;
						data.Lastname = findInMozart.LastName;
					}
					else
					{
						data.Firstname = request.FirstName;
						data.Lastname = request.LastName;
					}
				}

			}
			if (refIds.Contains(Constant.CERTIS_OSTECH_ROLE_ID))
			{
				var findInMozart = user.FirstOrDefault(x => x.Email != null && x.Email.Equals(request.EmailOrPhone, StringComparison.OrdinalIgnoreCase));
				if (findInMozart == null) throw new NotFoundException("user not found in mozart TECHNICIAN_ROLE");
				var technicianService = technicianServiceMaster.Where(x => x.TechnicianId == findInMozart.Id).ToList();
				if (technicianService != null)
				{
					dataService.Email = findInMozart.Email ?? request.EmailOrPhone;
					dataService.Name = findInMozart.FullName ?? request.FirstName + " " + request.LastName;
					dataService.EmailActivities = new();

					dataService.TechnicianService = technicianService;
					dataJson = JsonSerializer.Serialize(dataService);
					data.Firstname = findInMozart.FirstName;
					data.Lastname = findInMozart.LastName;
				}
			}
			if (refIds.Contains(Constant.CERTIS_SUPERVISOR_ROLE_ID))
			{
				var findInMozart = user.FirstOrDefault(x => x.Email != null && x.Email.Equals(request.EmailOrPhone, StringComparison.OrdinalIgnoreCase));
				if (findInMozart == null) throw new NotFoundException("user not found in mozart SUPERVISOR_ROLE");
				var supervisorService = supervisorServiceMaster.Where(x => x.SupervisorId == findInMozart.Id).ToList();
				if (supervisorService != null)
				{

					dataService.Email = findInMozart.Email ?? request.EmailOrPhone;
					dataService.Name = findInMozart.FullName ?? request.FirstName + " " + request.LastName;
					dataService.EmailActivities = new();
					if (findInMozart == null) throw new NotFoundException("user not found in mozart");
					dataService.SupervisorService = supervisorService;
					dataJson = JsonSerializer.Serialize(dataService);
					data.Firstname = findInMozart.FirstName;
					data.Lastname = findInMozart.LastName;
				}

			}
		}

		var clientSiteId = _clientSiteService.ClientSiteId;

		if (checkmember != null)
		{
			var mid = await UpdateMember(checkmember, roleId, refIds, request, clientSiteId, null, data, request.UpdatedBy, request.UpdatedByName);
			await CertisCreateStaffMember(data, mid, roleId, refIds);
			return new CreateUserKCResult { MID = mid };
		}
		else
		{
			var mid = await InsertMember(data, roleId, dataJson, refIds, request);
			return new CreateUserKCResult { MID = mid };
		}
	}
	public async Task<Guid> UpdateMember(taMember data, List<Guid> rolesId, List<int> refId, AuditableModel audiable, Guid csid, string? datajson, CreateUserKCRequestModel createkcdata, Guid? createdBy, string createdByname)
	{
		_ = await _uow.MemberRepository.UpdateMember(data.MID, data.Name, data.Status, data.IsActive, audiable);
		await _uow.RoleRepository.UpdateRoleMember(data.MID, rolesId, Constant.TENANT_OPERATION_APP_ID);
		await _uow.MemberRepository.InsertTenantMember(data.MID, Constant.TENANT_OPERATION_APP_ID, csid);
		var hasClientMember = await _uow.MemberRepository.CheckClientMember(data.MID, _clientSiteService.ClientSiteId);
		if (!hasClientMember)
		{
			var staffid = await CertisCreateStaffMember(createkcdata, data.MID, rolesId, refId);
			await _uow.MemberRepository.AddClientMember(data.MID, staffid ?? 0, datajson ?? "");
		}

		if (createdBy != null)
		{
			await _uow.MemberRepository.StampUpdatedBy(data.MID, createdBy.Value, createdByname);
		}

		await _uow.SaveChangeAsyncWithCommit();
		return data.MID;
	}

	public async Task<Guid> InsertMember(CreateUserKCRequestModel data, List<Guid> rolesId, string dataJson, List<int> refId, AuditableModel audiable)
	{
		var result = await _abstractionService.UserService.CreateUser(data);
		var mid = await _uow.MemberRepository.CreateMember(data.EmailOrPhone, data.Firstname, data.Lastname, Constant.MEMBERSTATUS_GRANTED, rolesId, result.Username, dataJson, audiable);
		await _uow.MemberRepository.InsertTenantMember(mid, Constant.TENANT_OPERATION_APP_ID, _clientSiteService.ClientSiteId);
		await _uow.SaveChangeAsyncWithCommit();
		await CertisCreateStaffMember(data, mid, rolesId, refId);
		return mid;
	}

	private async Task<int?> CertisCreateStaffMember(CreateUserKCRequestModel data, Guid mid, List<Guid> rolesId, List<int> refId)
	{
		if (data.StaffId == null)
		{
			var checkStaffIdCertis = await CheckStaffByEmail(data.EmailOrPhone);

			var upsertStaffToCertis = await UpsertStaffToCertis(checkStaffIdCertis, data, mid);
			await _uow.MemberRepository.UpdateMemberStaffId(mid, (int)upsertStaffToCertis.Id);
			await _uow.SaveChangeAsyncWithCommit();
			data.StaffId = upsertStaffToCertis.Id;
		}

		if (data.FunctionRoleLocation != null && data.FunctionRoleLocation.Count() >= 1)
		{
			var funcRoleLocation = new List<CreateFunctionRolesLocationMember>();
			//TODO : หาวิธีจัดการ error กรณี สร้าง staff id ไม่ผ่าน ต้องไม่ throw error | สร้างคนก่อน ค่อย ลองยิง mozart
			foreach (var item in data.FunctionRoleLocation)
			{
				await _abstractionService.CertisTransaction.AddStaffRoleMapping(new AddStaffRoleMappingCommand()
				{
					StaffId = (int)data.StaffId,
					LocationId = item.LocationId ?? throw new BadRequestException("LocationId is null"),
					FunctionRoleId = item.FunctionRoleId ?? throw new BadRequestException("FunctionRoleId is null"),
				});
				funcRoleLocation.Add(new CreateFunctionRolesLocationMember
				{
					MID = mid,
					LocationId = item.LocationId ?? throw new BadRequestException("LocationId is null"),
					FunctionRoleId = item.FunctionRoleId ?? throw new BadRequestException("FunctionRoleId is null"),
				});

			}
			await _uow.MemberRepository.UpsertFunctionRoleLocation(mid, funcRoleLocation);

		}
		await _uow.SaveChangeAsyncWithCommit();
		return data.StaffId;
	}
	private async Task<int?> CheckStaffByEmail(string search)
	{
		var getStaffByEmail = await _abstractionService.CertisTransaction.GetStaffByEmail(search);
		var staff = getStaffByEmail.FirstOrDefault(x => x.Email == search);
		return staff?.Id;
	}

	private async Task<StaffResult> UpsertStaffToCertis(int? checkStaffIdCertis, CreateUserKCRequestModel data, Guid id)
	{
		if (checkStaffIdCertis != null && checkStaffIdCertis != 0)
		{
			var sendStaff = new UpdateStaffCommand()
			{
				Id = (int)checkStaffIdCertis,
				FullName = data.Firstname + " " + data.Lastname,
				FirstName = data.Firstname,
				LastName = data.Lastname,
				Company = data.Company,
				StaffId = id.ToString(),
				Username = data.EmailOrPhone,
				Email = data.EmailOrPhone,
				Status = 1,
			};
			var memberStaff = await _abstractionService.CertisTransaction.UpdateStaff(sendStaff);
			return new StaffResult
			{
				Id = memberStaff.Id,
				FullName = memberStaff.FullName,
				FirstName = memberStaff.FirstName,
				LastName = memberStaff.LastName,
				Company = memberStaff.Company,
				StaffId = memberStaff.StaffId,
				Username = memberStaff.Username,
				Email = memberStaff.Email,
				Status = memberStaff.Status
			};
		}
		else
		{
			var sendStaff = new CreateStaffCommand()
			{
				FullName = data.Firstname + " " + data.Lastname,
				FirstName = data.Firstname,
				LastName = data.Lastname,
				Company = data.Company,
				StaffId = id.ToString(),
				Username = data.EmailOrPhone,
				Email = data.EmailOrPhone,
				Status = 1,
			};
			var memberStaff = await _abstractionService.CertisTransaction.CreateStaff(sendStaff);
			return new StaffResult
			{
				Id = memberStaff.Id,
				FullName = memberStaff.FullName,
				FirstName = memberStaff.FirstName,
				LastName = memberStaff.LastName,
				Company = memberStaff.Company,
				StaffId = memberStaff.StaffId,
				Username = memberStaff.Username,
				Email = memberStaff.Email,
				Status = memberStaff.Status
			};
		}
	}
}
