using System;
using System.Net.WebSockets;
using System.Text.Json;
using MediatR;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Contracts.API;
using TCCTOBK.OperationBackend.Application.Contracts.DataModel.AuthRepository;
using TCCTOBK.OperationBackend.Application.Exceptions;
using TCCTOBK.OperationBackend.Application.Features.CMS.MemberManagement.Model;
using TCCTOBK.OperationBackend.Application.Features.Mobile.Core;
using TCCTOBK.OperationBackend.Application.Helper.Table;
using TCCTOBK.OperationBackend.Domain;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.User.Command;

public class UpdateRoleOpsAppHandler : IRequestHandler<UpdateRoleOpsAppCommand, UpdateRoleOpsAppResult>
{
	private readonly IUnitOfWork _uow;
	private readonly IAbstractionService _abstractionService;
	public UpdateRoleOpsAppHandler(IAbstractionService abstractionService, IUnitOfWork uow)
	{
		_abstractionService = abstractionService;
		_uow = uow;
	}


	public async Task<UpdateRoleOpsAppResult> Handle(UpdateRoleOpsAppCommand request, CancellationToken cancellationToken)
	{
		// check if role is fmc
		// get role and check list refid
		var roleList = await _uow.RoleRepository.GetAll(null, null, Constant.TENANT_OPERATION_APP_ID, new TableState());
		var relevantRoleIds = new List<int> { Constant.CERTIS_SUPERVISOR_ROLE_ID, Constant.CERTIS_OSTECH_ROLE_ID };

		// คัดกรองเฉพาะ Role ที่ต้องการ และมีอยู่ใน request
		var matchedRoles = roleList
				.Where(role => request.Role.Contains(role.RID) && relevantRoleIds.Contains(role.RefId))
				.ToList();

		var updateUser = await _uow.MemberRepository.GetByIdWithOutActive(request.UserId);

		if (matchedRoles.Any(role => role.RefId == Constant.CERTIS_OSTECH_ROLE_ID))
		{
			var technicians = await _abstractionService.MasterData.GetAllFMTechnician();
			var technicianExists = technicians.Any(t =>
					!string.IsNullOrEmpty(t.Email) &&
					t.Email.Equals(updateUser.Email, StringComparison.OrdinalIgnoreCase));

			if (!technicianExists)
				throw new BadRequestException("user not found in Mozart");
		}

		if (matchedRoles.Any(role => role.RefId == Constant.CERTIS_SUPERVISOR_ROLE_ID))
		{
			var supervisors = await _abstractionService.MasterData.FMsupervisors();
			var supervisorExists = supervisors.Any(s =>
					!string.IsNullOrEmpty(s.email) &&
					s.email.Equals(updateUser.Email, StringComparison.OrdinalIgnoreCase));

			if (!supervisorExists)
				throw new BadRequestException("user not found in Mozart");
		}


		await _uow.RoleRepository.UpdateRoleMember(request.UserId, request.Role, Constant.TENANT_OPERATION_APP_ID);
		if (request.StaffId == null || request.StaffId == 0)
		{
			var user = await UpsertStaffIdMemberCertis(request.UserId);
			await _uow.MemberRepository.UpdateMemberStaffId(request.UserId, (int)user.Id);
			await _uow.SaveChangeAsyncWithCommit();
			request.StaffId = user.Id;
		}
		await MergeRoleCertis(request.StaffId, request.FunctionRoleLocations);
		var funcRoleLocation = new List<CreateFunctionRolesLocationMember>();
		foreach (var item in request.FunctionRoleLocations)
		{
			funcRoleLocation.Add(new CreateFunctionRolesLocationMember
			{
				MID = request.UserId,
				LocationId = item.LocationId ?? throw new BadRequestException("LocationId is null"),
				FunctionRoleId = item.FunctionRoleId ?? throw new BadRequestException("FunctionRoleId is null"),
			});
		}
		await _uow.MemberRepository.UpsertFunctionRoleLocation(request.UserId, funcRoleLocation);
		await _uow.SaveChangeAsyncWithCommit();

		return new UpdateRoleOpsAppResult();
	}

	public async Task MergeRoleCertis(int? staffId, List<CreateFunctionRolesLocation> functionRoleLocations)
	{
		var certisRole = await _abstractionService.CertisTransaction.GetFunctionRolesByStaffId(staffId);
		var existingRoles = certisRole.Select(cr => new { cr.LocationId, cr.FunctionRoleId }).ToList();
		var newRoles = functionRoleLocations.Select(fr => new { fr.LocationId, fr.FunctionRoleId }).ToList();
		var rolesToDelete = existingRoles.Except(newRoles).ToList();
		var rolesToAdd = newRoles.Except(existingRoles).ToList();

		if (rolesToAdd != null && rolesToAdd.Count() > 0)
		{
			foreach (var item in rolesToAdd)
			{
				await _abstractionService.CertisTransaction.AddStaffRoleMapping(new AddStaffRoleMappingCommand()
				{
					StaffId = (int)staffId,
					LocationId = item.LocationId ?? throw new BadRequestException("LocationId is null"),
					FunctionRoleId = item.FunctionRoleId ?? throw new BadRequestException("FunctionRoleId is null"),
				});
			}
		}

		if (rolesToDelete != null && rolesToDelete.Count() > 0)
		{
			foreach (var item in rolesToDelete)
			{
				await _abstractionService.CertisTransaction.DeleteStaffRoleMapping(new DeleteStaffRoleMappingCommand()
				{
					StaffId = (int)staffId,
					LocationId = item.LocationId ?? throw new BadRequestException("LocationId is null"),
					FunctionRoleId = item.FunctionRoleId ?? throw new BadRequestException("FunctionRoleId is null"),
				});
			}
		}
	}

	public async Task<StaffResult> UpsertStaffIdMemberCertis(Guid id)
	{
		var data = await _uow.MemberRepository.GetByIdWithOutActive(id);
		var checkStaffIdCertis = await CheckStaffByEmail(data.Email);
		var upsertStaffToCertis = await UpsertStaffToMemberCertis(checkStaffIdCertis, data, id);
		return upsertStaffToCertis;

	}


	private async Task<StaffResult> UpsertStaffToMemberCertis(int? checkStaffIdCertis, taMember data, Guid id)
	{
		if (checkStaffIdCertis != null && checkStaffIdCertis != 0)
		{
			var sendStaff = new UpdateStaffCommand()
			{
				Id = (int)checkStaffIdCertis,
				FirstName = data.FirstName,
				LastName = data.LastName,
				StaffId = data.MID.ToString(),
				Username = data.Email,
				Email = data.Email,
				Status = 1,
			};
			var memberStaff = await _abstractionService.CertisTransaction.UpdateStaff(sendStaff);
			return new StaffResult
			{
				Id = memberStaff.Id,
				FirstName = data.FirstName,
				LastName = data.LastName,
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
				FullName = data.Name,
				FirstName = data.FirstName,
				LastName = data.LastName,
				StaffId = data.MID.ToString(),
				Username = data.Email,
				Email = data.Email,
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

	private async Task<int?> CheckStaffByEmail(string search)
	{
		var getStaffByEmail = await _abstractionService.CertisTransaction.GetStaffByEmail(search);
		var staff = getStaffByEmail.FirstOrDefault(x => x.Email == search);
		return staff?.Id;
	}
}
