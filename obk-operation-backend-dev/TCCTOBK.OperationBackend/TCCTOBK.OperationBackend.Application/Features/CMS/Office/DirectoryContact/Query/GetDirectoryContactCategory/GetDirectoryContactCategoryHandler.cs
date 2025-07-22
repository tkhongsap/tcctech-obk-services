using System;
using System.Text.Json;
using MediatR;
using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts.API;
using TCCTOBK.OperationBackend.Application.Features.CMS.Office.DirectoryContact.Model;

namespace TCCTOBK.OperationBackend.Application.Features.CMS.Office.DirectoryContact.Query.GetDirectoryContactCategory;

public class GetDirectoryContactCategoryHandler : IQueryHandler<GetDirectoryContactCategoryQuery, GetDirectoryContactCategoryResult>
{
  IAPIService _apiservice;
  IMediator _mediator;

  public GetDirectoryContactCategoryHandler(IAPIService apiservice, IMediator mediator)
  {
    _apiservice = apiservice;
    _mediator = mediator;
  }

  public async Task<GetDirectoryContactCategoryResult> Handle(GetDirectoryContactCategoryQuery request, CancellationToken cancellationToken)
  {
    var getremoteconfigquery = new GetRemoteConfigDataQuery();
    var getremoteconfigresult = await _mediator.Send(getremoteconfigquery);
    if (!getremoteconfigresult.IsSuccess)
    {
      return new GetDirectoryContactCategoryResult();
    }
    using (JsonDocument doc = JsonDocument.Parse(getremoteconfigresult.data))
    {
      JsonElement valueElement = doc.RootElement
          .GetProperty("parameters")
          .GetProperty("directory_contact")
          .GetProperty("defaultValue")
          .GetProperty("value");
      string unescapedJsonString = valueElement.GetString().Replace("\\\"", "\"").Replace("\\\\", "\\");
      var emergencyContact = JsonSerializer.Deserialize<List<DirectoryContactModel>>(unescapedJsonString, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
      if (request.CategoryId != null)
      {
        emergencyContact = emergencyContact.Where(x => x.categoryId == request.CategoryId).ToList();
      }
      return new GetDirectoryContactCategoryResult() { Data = emergencyContact };
    }
  }
}
