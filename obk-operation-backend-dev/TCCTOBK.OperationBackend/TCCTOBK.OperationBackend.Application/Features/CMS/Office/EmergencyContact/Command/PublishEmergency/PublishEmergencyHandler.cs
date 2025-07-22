using System;
using System.Text.Json;
using System.Text.Json.Nodes;
using MediatR;
using TCCTOBK.OperationBackend.Application.Contracts.API;
using TCCTOBK.OperationBackend.Domain;

namespace TCCTOBK.OperationBackend.Application.Features.CMS.Office.EmergencyContact.Command.PublishEmergency;

public class PublishEmergencyHandler : IRequestHandler<PublishEmergencyCommand, PublishEmergencyResult>
{
  IAPIService _apiservice;
  IMediator _mediator;

  public PublishEmergencyHandler(IAPIService apiservice, IMediator mediator)
  {
    _apiservice = apiservice;
    _mediator = mediator;
  }

  public async Task<PublishEmergencyResult> Handle(PublishEmergencyCommand request, CancellationToken cancellationToken)
  {
    var filebaseauth = new FirebaseOAuth(DomainConfig.FirebaseAdmin);
    var token = await filebaseauth.AuthRemoteConfig();
    var bearertoken = $"Bearer {token}";
    var getremoteconfigquery = new GetRemoteConfigDataQuery();
    var getremoteconfigresult = await _mediator.Send(getremoteconfigquery);
    var dataobj = JsonObject.Parse(getremoteconfigresult.data);
    var jsonObject = new
    {
      title = request.Title,
      titleTh = request.TitleTh,
      titleZh = request.TitleZh,
      descriptionTh = request.DescriptionTh,
      descriptionEn = request.DescriptionEn,
      descriptionZh = request.DescriptionZh,
      phoneNumber = request.PhoneNumber,
      updatedDate = request.UpdatedDate,
      updatedBy = request.UpdatedByName
    };
    string jsonValue = JsonSerializer.Serialize(jsonObject);
    dataobj["parameters"]["emergency_contact"]["defaultValue"]["value"] = jsonValue;
    var version = (string)dataobj["version"]["versionNumber"];
    version = version!.Trim('"');
    var etag = "etag-" + DomainConfig.FirebaseAdmin.ProjectCode + "-" + version;
    await _apiservice.FirebaseRemoteConfig.UpdateRemoteConfig(bearertoken, etag, dataobj);
    return new PublishEmergencyResult() { IsSuccess = true, Message = "Publish New Emergency contact", Version = version };
  }
}
