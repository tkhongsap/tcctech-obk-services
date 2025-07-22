using System;
using System.Text.Json.Nodes;
using MediatR;
using TCCTOBK.OperationBackend.Application.Contracts.API;
using System.Text.Json.Serialization;
using System.Text.Json;
using TCCTOBK.OperationBackend.Application.Features.CMS.Office.EmergencyContact.Model;

namespace TCCTOBK.OperationBackend.Application.Features.CMS.Office.EmergencyContact.Query.GetEmergency;

public class GetEmergencyHandler : IRequestHandler<GetEmergencyQuery, GetEmergencyResult>
{
  IAPIService _apiservice;
  IMediator _mediator;

  public GetEmergencyHandler(IAPIService apiservice, IMediator mediator)
  {
    _apiservice = apiservice;
    _mediator = mediator;
  }

  public async Task<GetEmergencyResult> Handle(GetEmergencyQuery request, CancellationToken cancellationToken)
  {
    var getremoteconfigquery = new GetRemoteConfigDataQuery();
    var getremoteconfigresult = await _mediator.Send(getremoteconfigquery);
    if (!getremoteconfigresult.IsSuccess)
    {
      return new GetEmergencyResult();
    }
    using (JsonDocument doc = JsonDocument.Parse(getremoteconfigresult.data))
    {
      JsonElement valueElement = doc.RootElement
          .GetProperty("parameters")
          .GetProperty("emergency_contact")
          .GetProperty("defaultValue")
          .GetProperty("value");
      string unescapedJsonString = valueElement.GetString().Replace("\\\"", "\"").Replace("\\\\", "\\");
      var emergencyContact = JsonSerializer.Deserialize<EmergencyContactModel>(unescapedJsonString);
      return new GetEmergencyResult() { Data = emergencyContact };
    }
  }
}
