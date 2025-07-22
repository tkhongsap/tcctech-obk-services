using MediatR;

namespace TCCTOBK.OperationBackend.Application;

public class UpdateRemoteConfigCommand : IRequest<UpdateRemoteConfigResult>
{
	public string Data { get; set; } = default!;
	public string ImageURL { get; set; } = default!;
	public bool EnableAnnouncement { get; set; }

	public UpdateRemoteConfigCommand(string data, string imageurl, bool enableannouncement)
	{
		Data = data;
		ImageURL = imageurl;
		EnableAnnouncement = enableannouncement;
	}
}
