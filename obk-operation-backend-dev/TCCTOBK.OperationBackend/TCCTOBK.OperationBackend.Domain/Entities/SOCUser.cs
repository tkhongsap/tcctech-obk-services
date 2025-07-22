using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using TCCTOBK.OperationBackend.Domain.Common;

namespace TCCTOBK.OperationBackend.Domain.Entities;

[Table("SOCUser")]
public class SOCUser : Auditable
{
	[Key]
	[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
	public Guid SID { get; set; }
	[Required]
	[MaxLength(500)]
	[Column(TypeName = "character varying")]
	public required string IdentifyNumber { get; set; }
	[Required]
	public required int IdentifyType { get; set; }
	[Required]
	[Column(TypeName = "character varying")]
	public required string FirstName { get; set; }
	[Required]
	[Column(TypeName = "character varying")]
	public required string LastName { get; set; }
	[Required]
	[Column(TypeName = "character varying")]
	public required string FirstNameEn { get; set; }
	[Required]
	[Column(TypeName = "character varying")]
	public required string LastNameEn { get; set; }
	[Required]
	public int Status { get; set; }
	public string? PhoneNumber { get; set; }
	[Required]
	public int Gender { get; set; }
	[DefaultValue(true)]
	public bool IsActive { get; set; } = true;

	public string? KeyCloakUserId { get; set; }
	[Column(TypeName = "character varying")]
	public string? DataJson { get; set; }

	public int? StaffId { get; set; }
	public List<trRoleSOCUser> trRoleSOCUser { get; set; } = new();
	public List<SOCUserTanent> SOCUserTanent { get; set; } = new();
	public List<trFunctionRoleLocationSOC> FunctionRoleLocation { get; set; } = new();
}

