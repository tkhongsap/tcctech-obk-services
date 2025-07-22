
using TCCTOBK.OperationBackend.Application.Contracts.DataModel.StaffRepository;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;
using TCCTOBK.OperationBackend.Application.Helper.Table;
using TCCTOBK.OperationBackend.Domain.Entities;
namespace TCCTOBK.OperationBackend.Application;
public interface IStaffRepository
{
	Task<mtStaff> GetByName(string name);
	Task<mtStaff> GetByEmail(string email);
	Task<mtStaff> GetByEmailAndSfid(string email, Guid sfid);
	Task<mtStaff> GetByEmailOrSfid(string? email, Guid? sfid);

	Task<List<mtStaff>> GetAll(string? staffName, string? component, bool? mustUseOpsApp);
	Task<List<mtStaff>> GetAllLog();
	Task<int> GetAllCount(string? staffName, string? component, bool? mustUseOpsApp, DateTime? dateCheck, Guid? id);
	Task<mtStaff> GetById(Guid id);
	Task<List<mtStaff>> Paginate(string? staffName, string? component, bool? mustUseOpsApp, TableState state);
	Task<Guid> SoftDeleteByIdAsync(Guid id);
	Task<int> DeleteStaff(Guid id);
	Task<Guid> CreateStaff(CreateStaffModel data);
	Task UpdateStaff(UpdateStaffModel data);
	Task<List<mtStaff>> GetAllByComponent(string? component);
	Task<int> GetAllCountByComponent(string? component);
}
