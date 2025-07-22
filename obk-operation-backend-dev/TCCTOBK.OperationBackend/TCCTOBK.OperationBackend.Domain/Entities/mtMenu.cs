using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TCCTOBK.OperationBackend.Domain.Entities;
[Table("mtMenu")]
public class mtMenu
{
	[Key]
	[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
	public Guid Id { get; set; }

	[ForeignKey(nameof(Parent))]
	public Guid? ParentId { get; set; }
	public mtMenu? Parent { get; set; }

	[MaxLength(200)]
	[Column(TypeName = "character varying")]
	public string? Label { get; set; }

	[MaxLength(200)]
	[Column(TypeName = "character varying")]
	public string? Header { get; set; }

	[MaxLength(2000)]
	[Column(TypeName = "character varying")]
	public string? Class { get; set; }

	[MaxLength(2000)]
	[Column(TypeName = "character varying")]
	public string? IconName { get; set; }

	[MaxLength(2000)]
	[Column(TypeName = "character varying")]
	public string? IconClass { get; set; }

	[MaxLength(2000)]
	[Column(TypeName = "character varying")]
	public string? To { get; set; }

	[MaxLength(2000)]
	[Column(TypeName = "character varying")]
	public string? Url { get; set; }

	[DefaultValue(false)]
	public bool Separator { get; set; } = false;

	[MaxLength(100)]
	[Column(TypeName = "character varying")]
	public string? Type { get; set; }

	public List<mtMenu> Items = new();

	[DefaultValue(true)]
	public bool Visible { get; set; } = true;

	[DefaultValue(false)]
	public bool Disabled { get; set; } = false;

	[DefaultValue(true)]
	public bool IsActive { get; set; } = true;

	[MaxLength(5000)]
	[Column(TypeName = "character varying")]
	public string? Breadcrumb { get; set; }

	[ForeignKey(nameof(mtPrivilegeItem))]
	public Guid? PTID { get; set; }

	mtPrivilegeItem? mtPrivilegeItem { get; set; }

	public required int DisplayOrder { get; set; }


	public Guid? CSID { get; set; } = Constant.OBK_CLIENT_SITE;
}