
using TCCTOBK.OperationBackend.Domain.Common;

namespace TCCTOBK.OperationBackend.Application.Contracts.DataModel.StaffRepository;
public class UpdateStaffModel : Auditable
{
    public Guid Sfid { get; set; }
    public string? StaffName { get; set; }
    public string? Email { get; set; }
    public string? Component { get; set; }
    public string? Position { get; set; }
    public string? Company { get; set; }
    public string? Location { get; set; }
    public bool? MustUseOpsApp { get; set; }
    public bool isDelete { get; set; } = false;
    public string? KeyCloakUserId { get; set; }
    public bool IsActive { get; set; } = true;

    public DateTime UpdatedDate { get; set; } = DateTime.UtcNow;
    public int? Seq { get; set; }



}

