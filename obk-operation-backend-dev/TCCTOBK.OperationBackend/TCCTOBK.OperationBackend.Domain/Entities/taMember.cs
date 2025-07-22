using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using TCCTOBK.OperationBackend.Domain.Common;

namespace TCCTOBK.OperationBackend.Domain.Entities;

[Table("taMember")]
public class taMember : Auditable
{
	[Key]
	[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
	public Guid MID { get; set; }

	[Required]
	[MaxLength(500)]
	[Column(TypeName = "character varying")]
	public string Email { get; set; } = default!;

	[MaxLength(500)]
	[Column(TypeName = "character varying")]
	public string? Name { get; set; }

	[Required]
	public int Status { get; set; }

	[Column(TypeName = "character varying")]
	public string? KeyCloakUserId { get; set; }

	[Column(TypeName = "character varying")]
	public string? DataJson { get; set; }

	[DefaultValue(true)]
	public bool IsActive { get; set; } = true;

	[DefaultValue(true)]
	public bool IsLocked { get; set; } = false;

	public int FailAttempt { get; set; }

	public DateTime? LastLoginDateTime { get; set; }
	public DateTime? LastLogoutDateTime { get; set; }

	[DefaultValue(false)]
	public bool IsAvailable { get; set; }

	public int? StaffId { get; set; }
	public List<trRoleMember> trRoleMembers { get; set; } = new();
	public List<TenantMember> tenantMembers { get; set; } = new();
	public List<trFunctionRoleLocationMember> FunctionRoleLocation { get; set; } = new();

	[DefaultValue(false)]
	public bool IsDelete { get; set; } = false;

	[DefaultValue(null)]
	public string? FirstName { get; set; } = null;
	[DefaultValue(null)]
	public string? LastName { get; set; } = null;

	public List<ClientMember> ClientMember { get; set; } = new();
}
