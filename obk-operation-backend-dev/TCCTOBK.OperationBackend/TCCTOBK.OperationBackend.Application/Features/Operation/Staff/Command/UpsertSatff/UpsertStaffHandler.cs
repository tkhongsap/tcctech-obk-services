using MediatR;
using Newtonsoft.Json.Serialization;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Contracts.DataModel.StaffRepository;
using TCCTOBK.OperationBackend.Application.Features.Operation.UsageMonitoring.Staff.Command.UpsertStaff;
using TCCTOBK.OperationBackend.Domain;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.Staff.Command.UpsertStaff;

public class UpsertStaffHandler : IRequestHandler<UpsertStaffCommand, UpsertStaffResult>
{
	IUnitOfWork _uow;
	public UpsertStaffHandler(IUnitOfWork uow)
	{
		_uow = uow;
	}
	public async Task<UpsertStaffResult> Handle(UpsertStaffCommand request, CancellationToken cancellationToken)
	{
		var updateData = 0;
		var createData = 0;
		var errors = new List<string>();
		foreach (var item in request.Data)
		{
			var memberFind = await _uow.MemberRepository.GetByEmail(item.Email);
			var socFind = await _uow.MemberRepository.GetByEmail(item.Email);
			string kcByemail = memberFind != null ? memberFind.KeyCloakUserId : socFind.KeyCloakUserId;

			if (kcByemail == null)
			{
				errors.Add("User Has null : " + item.Email);
				continue;
			}

			if (item.Sfid != null && item.Email != null)
			{
				var staff = await _uow.StaffRepository.GetByEmailAndSfid(item.Email, (Guid)item.Sfid);
				if (staff != null)
				{
					var updateStaffData = new UpdateStaffModel()
					{
						Sfid = staff.Sfid,
						StaffName = item.StaffName,
						Email = staff.Email,
						Component = item.Component,
						Position = item.Position,
						Company = item.Company,
						Location = item.Location,
						MustUseOpsApp = item.MustUseOpsApp,
						KeyCloakUserId = kcByemail
					};
					await _uow.StaffRepository.UpdateStaff(updateStaffData);
					updateData++;
				}
				else
				{
					errors.Add("Cannot update staff with sfid: " + item.Sfid + " and email: " + item.Email);
					continue;
				}
			}
			else
			{
				if (item.Email == null)
				{
					errors.Add("Email Has null : " + item.Sfid);
					continue;
				}
				else
				{
					var staff = await _uow.StaffRepository.GetByEmailOrSfid(item.Email, item.Sfid);
					if (staff != null)
					{
						var updateStaffData = new UpdateStaffModel()
						{
							Sfid = staff.Sfid,
							StaffName = item.StaffName,
							Email = staff.Email,
							Component = item.Component,
							Position = item.Position,
							Company = item.Company,
							Location = item.Location,
							MustUseOpsApp = item.MustUseOpsApp,
							KeyCloakUserId = kcByemail
						};
						await _uow.StaffRepository.UpdateStaff(updateStaffData);
						updateData++;
					}
					else
					{
						if (item.Email == null)
						{
							errors.Add("Email Has null ");
							continue;
						}
						else
						{
							var createStaffData = new CreateStaffModel()
							{
								StaffName = item.StaffName,
								Email = item.Email ?? string.Empty,
								Component = item.Component,
								Position = item.Position,
								Company = item.Company,
								Location = item.Location,
								MustUseOpsApp = item.MustUseOpsApp,
								KeyCloakUserId = kcByemail
							};
							await _uow.StaffRepository.CreateStaff(createStaffData);
							createData++;
						}

					}
				}
			}
		}
		await _uow.SaveChangeAsyncWithCommit();
		return new UpsertStaffResult() { UpdateData = updateData, CreateData = createData, Errors = errors };
	}
}
