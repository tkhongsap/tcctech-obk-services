using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TCCTOBK.OperationBackend.Domain.Entities;

[Table("EventsLog")]
public class EventsLog
{
	[Key]
	[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
	public int Id { get; set; }

	[Required]
	[MaxLength(255)]
	[Column(TypeName = "character varying")]
	public required string Type { get; set; }

	[Required]
	public required DateTime Time { get; set; }

	[Required]
	public required string IpAddress { get; set; }

	[Required]
	public required string AuthMethod { get; set; }

	[Required]
	public required Guid TokenId { get; set; }

	[Required]
	public required string GrantType { get; set; }

	[Required]
	public required string RefreshTokenType { get; set; }

	[Required]
	public required string Scope { get; set; }

	[Required]
	public required Guid RefreshTokenId { get; set; }

	[Required]
	public required string ClientAuthMethod { get; set; }

	[Required]
	public required Guid Username { get; set; }


	public Guid? CSID { get; set; } = Constant.OBK_CLIENT_SITE;
}

