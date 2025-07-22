using System.Text.RegularExpressions;
using MediatR;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Contracts.DataModel.StaffRepository;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.UsageMonitoring.Staff.Command.UpsertStaff;

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
        for (int i = 0; i < request.Data.Count(); i++)
        {
            var item = request.Data[i];
            var row = i + 2;
            if (string.IsNullOrEmpty(item.Email)) { errors.Add($"Email is required rows {row}"); continue; }
            if (!Regex.IsMatch(item.Email, @"^[^@\s]+@[^@\s]+\.[^@\s]+$")) { errors.Add($"Invalid email format: {item.Email}"); continue; }
            if (string.IsNullOrEmpty(item.StaffName)) { errors.Add($"StaffName is required {item.Email}"); continue; }
            if (string.IsNullOrEmpty(item.Component)) { errors.Add($"Component is required {item.Email}"); continue; }
            if (!item.MustUseOpsApp.HasValue) { errors.Add($"MustUseOpsApp is required {item.Email}"); continue; }

            var memberFind = await _uow.MemberRepository.GetByEmailLower(item.Email);
            var socFind = await _uow.SOCUserRepository.GetByEmailLowerWithOutError(item.Email);
            string kcByemail = memberFind != null ? memberFind.KeyCloakUserId : socFind.KeyCloakUserId;

            if (kcByemail == null)
            {
                var staff = await _uow.StaffRepository.GetByEmail(item.Email);
                var mustUseOpsAppKc = (bool)item.MustUseOpsApp == false ? Guid.Empty.ToString() : (staff != null && staff.KeyCloakUserId != null) ? staff.KeyCloakUserId.ToString() : Guid.Empty.ToString();
                if (staff != null)
                {
                    var updateStaffData = new UpdateStaffModel()
                    {
                        Sfid = staff.Sfid,
                        StaffName = item.StaffName,
                        Email = staff.Email.ToLower(),
                        Component = item.Component,
                        Position = item.Position,
                        Company = item.Company,
                        Location = item.Location,
                        MustUseOpsApp = item.MustUseOpsApp,
                        KeyCloakUserId = mustUseOpsAppKc,
                        IsActive = (bool)item.IsActive,
                        CreatedBy = request.CreatedBy,
                        CreatedDate = request.CreatedDate,
                        CreatedByName = request.CreatedByName,
                        UpdatedBy = request.UpdatedBy,
                        UpdatedDate = request.UpdatedDate,
                        UpdatedByName = request.UpdatedByName,
                        Seq = i
                    };
                    await _uow.StaffRepository.UpdateStaff(updateStaffData);
                    updateData++;
                }
                else
                {
                    var createStaffData = new CreateStaffModel()
                    {
                        StaffName = item.StaffName,
                        Email = staff.Email.ToLower() ?? string.Empty,
                        Component = item.Component,
                        Position = item.Position,
                        Company = item.Company,
                        Location = item.Location,
                        MustUseOpsApp = item.MustUseOpsApp,
                        KeyCloakUserId = mustUseOpsAppKc,
                        IsActive = (bool)item.IsActive,
                        CreatedBy = request.CreatedBy,
                        CreatedDate = request.CreatedDate,
                        CreatedByName = request.CreatedByName,
                        UpdatedBy = request.UpdatedBy,
                        UpdatedDate = request.UpdatedDate,
                        UpdatedByName = request.UpdatedByName,
                        Seq = i

                    };
                    await _uow.StaffRepository.CreateStaff(createStaffData);
                    createData++;
                }

            }
            else
            {
                if (item.Email != null)
                {
                    var staff = await _uow.StaffRepository.GetByEmail(item.Email);
                    var mustUseOpsAppKc = (bool)item.MustUseOpsApp == false ? Guid.Empty.ToString() : (kcByemail != null) ? kcByemail : Guid.Empty.ToString();
                    if (staff != null)
                    {
                        var updateStaffData = new UpdateStaffModel()
                        {
                            Sfid = staff.Sfid,
                            StaffName = item.StaffName,
                            Email = staff.Email.ToLower(),
                            Component = item.Component,
                            Position = item.Position,
                            Company = item.Company,
                            Location = item.Location,
                            MustUseOpsApp = item.MustUseOpsApp,
                            KeyCloakUserId = mustUseOpsAppKc,
                            IsActive = (bool)item.IsActive,
                            CreatedBy = request.CreatedBy,
                            CreatedDate = request.CreatedDate,
                            CreatedByName = request.CreatedByName,
                            UpdatedBy = request.UpdatedBy,
                            UpdatedDate = request.UpdatedDate,
                            UpdatedByName = request.UpdatedByName,
                            Seq = i

                        };
                        await _uow.StaffRepository.UpdateStaff(updateStaffData);
                        updateData++;
                    }
                    else
                    {
                        var createStaffData = new CreateStaffModel()
                        {
                            StaffName = item.StaffName,
                            Email = staff.Email.ToLower() ?? string.Empty,
                            Component = item.Component,
                            Position = item.Position,
                            Company = item.Company,
                            Location = item.Location,
                            MustUseOpsApp = item.MustUseOpsApp,
                            KeyCloakUserId = mustUseOpsAppKc,
                            IsActive = (bool)item.IsActive,
                            CreatedBy = request.CreatedBy,
                            CreatedDate = request.CreatedDate,
                            CreatedByName = request.CreatedByName,
                            UpdatedBy = request.UpdatedBy,
                            UpdatedDate = request.UpdatedDate,
                            UpdatedByName = request.UpdatedByName,
                            Seq = i

                        };
                        await _uow.StaffRepository.CreateStaff(createStaffData);
                        createData++;
                    }
                }
            }

        }
        
		await _uow.SaveChangeAsyncWithCommit();
		return new UpsertStaffResult() { UpdateData = updateData, CreateData = createData, Errors = errors };
	}
}
