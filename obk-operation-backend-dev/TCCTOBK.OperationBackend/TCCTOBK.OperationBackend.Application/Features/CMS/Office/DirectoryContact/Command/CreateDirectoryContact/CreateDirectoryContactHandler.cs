using System;
using System.Text.Json;
using System.Text.Json.Nodes;
using MediatR;
using TCCTOBK.OperationBackend.Application.Contracts.API;
using TCCTOBK.OperationBackend.Application.Exceptions;
using TCCTOBK.OperationBackend.Application.Features.CMS.Office.DirectoryContact.Model;
using TCCTOBK.OperationBackend.Application.Features.CMS.Office.DirectoryContact.Query.GetDirectoryContactCategory;
using TCCTOBK.OperationBackend.Domain;

namespace TCCTOBK.OperationBackend.Application.Features.CMS.Office.DirectoryContact.Command.CreateDirectoryContact;

public class CreateDirectoryContactHandler : IRequestHandler<CreateDirectoryContactCommand, CreateDirectoryContactResult>
{
  IAPIService _apiservice;
  IMediator _mediator;

  public CreateDirectoryContactHandler(IAPIService apiservice, IMediator mediator)
  {
    _apiservice = apiservice;
    _mediator = mediator;
  }

  public async Task<CreateDirectoryContactResult> Handle(CreateDirectoryContactCommand request, CancellationToken cancellationToken)
  {
    var contactlist = await _mediator.Send(new GetDirectoryContactCategoryQuery(null));
    if (contactlist.Data.Any(x => x.category == request.CategoryName)) throw new BadRequestException("The category name already exists.");
    var newdata = new DirectoryContactModel()
    {
      categoryId = Guid.NewGuid(),
      category = request.CategoryName,
      createdBy = request.CreatedByName,
      createdAt = request.CreatedDate,
      updatedBy = request.UpdatedByName,
      updatedAt = request.UpdatedDate,
    };
    contactlist.Data.Add(newdata);
    //store new data
    var filebaseauth = new FirebaseOAuth(DomainConfig.FirebaseAdmin);
    var token = await filebaseauth.AuthRemoteConfig();
    var bearertoken = $"Bearer {token}";
    var getremoteconfigquery = new GetRemoteConfigDataQuery();
    var getremoteconfigresult = await _mediator.Send(getremoteconfigquery);
    var dataobj = JsonObject.Parse(getremoteconfigresult.data);
    string jsonValue = JsonSerializer.Serialize(contactlist.Data);
    dataobj["parameters"]["directory_contact"]["defaultValue"]["value"] = jsonValue;
    var version = (string)dataobj["version"]["versionNumber"];
    version = version!.Trim('"');
    var etag = "etag-" + DomainConfig.FirebaseAdmin.ProjectCode + "-" + version;
    await _apiservice.FirebaseRemoteConfig.UpdateRemoteConfig(bearertoken, etag, dataobj);
    return new CreateDirectoryContactResult() { Data = contactlist.Data };
  }
}
