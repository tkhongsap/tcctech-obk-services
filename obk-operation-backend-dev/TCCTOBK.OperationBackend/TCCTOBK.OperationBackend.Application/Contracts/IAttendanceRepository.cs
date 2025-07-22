using TCCTOBK.OperationBackend.Application.Contracts.DataModel.AttendanceRepository;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;
using TCCTOBK.OperationBackend.Application.Helper.Table;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Application.Contracts;
public interface IAttendanceRepository
{
	Task<Guid> Create(CreateAttendanceModel attendance, AuditableModel auditable);
	Task<List<Guid>> BulkCreate(List<CreateAttendanceModel> attendance, AuditableModel auditable);
	Task<List<Guid>> BulkUpdate(List<UpdateAttendanceModel> attendance, AuditableModel auditable);
    Task<List<string>> GetConfigEmail();
	Task<List<string>> GetConfigCCEmail();
	Task<List<trAttendance>> GetAll(string? shiftName, string? day, string? company, string? location, string? role);
	Task<int> GetAllCount(string? shiftName, string? day, string? company, string? location, string? role);
}
