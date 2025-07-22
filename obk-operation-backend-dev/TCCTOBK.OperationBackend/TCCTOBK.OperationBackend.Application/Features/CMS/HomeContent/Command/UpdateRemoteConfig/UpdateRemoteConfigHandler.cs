using MediatR;
using System.Text.Json.Nodes;
using TCCTOBK.OperationBackend.Application.Contracts.API;
using TCCTOBK.OperationBackend.Domain;

namespace TCCTOBK.OperationBackend.Application;

public class UpdateRemoteConfigHandler : IRequestHandler<UpdateRemoteConfigCommand, UpdateRemoteConfigResult>
{
	IAPIService _apiservice;
	public UpdateRemoteConfigHandler(IAPIService apiservice)
	{
		_apiservice = apiservice;
	}

	public async Task<UpdateRemoteConfigResult> Handle(UpdateRemoteConfigCommand request, CancellationToken cancellationToken)
	{
		try
		{
			var filebaseauth = new FirebaseOAuth(DomainConfig.FirebaseAdmin);
			var token = await filebaseauth.AuthRemoteConfig();
			var bearertoken = $"Bearer {token}";
			var dataobj = JsonObject.Parse(request.Data);

			string jsonValue = "{\"background_image\": \"" + request.ImageURL + "\", \"enable_announcement\": " + request.EnableAnnouncement.ToString().ToLower() + "}";

			dataobj["parameters"]["home_content"]["defaultValue"]["value"] = jsonValue;
			var version = (string)dataobj["version"]["versionNumber"];
			version = version!.Trim('"');
			var etag = "etag-" + DomainConfig.FirebaseAdmin.ProjectCode + "-" + version;
			await _apiservice.FirebaseRemoteConfig.UpdateRemoteConfig(bearertoken, etag, dataobj);
			return new UpdateRemoteConfigResult() { IsSuccess = true, Message = "success", Version = version };
		}
		catch (Exception ee)
		{
			return new UpdateRemoteConfigResult() { IsSuccess = false, Message = "can not access firebase service" };
		}
	}
}
