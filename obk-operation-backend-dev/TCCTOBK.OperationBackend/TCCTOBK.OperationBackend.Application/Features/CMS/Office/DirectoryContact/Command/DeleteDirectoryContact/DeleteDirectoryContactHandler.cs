using System;
using System.Text.Json;
using System.Text.Json.Nodes;
using MediatR;
using TCCTOBK.OperationBackend.Application.Contracts.API;
using TCCTOBK.OperationBackend.Application.Exceptions;
using TCCTOBK.OperationBackend.Application.Features.CMS.Office.DirectoryContact.Query.GetDirectoryContactCategory;
using TCCTOBK.OperationBackend.Domain;

namespace TCCTOBK.OperationBackend.Application.Features.CMS.Office.DirectoryContact.Command.DeleteDirectoryContact;

public class DeleteDirectoryContactHandler : IRequestHandler<DeleteDirectoryContactCommand, DeleteDirectoryContactResult>
{
  IAPIService _apiservice;
  IMediator _mediator;

  public DeleteDirectoryContactHandler(IAPIService apiservice, IMediator mediator)
  {
    _apiservice = apiservice;
    _mediator = mediator;
  }

  public async Task<DeleteDirectoryContactResult> Handle(DeleteDirectoryContactCommand request, CancellationToken cancellationToken)
  {
    var contactlist = await _mediator.Send(new GetDirectoryContactCategoryQuery(null));
    var data = contactlist.Data.FirstOrDefault(x => x.categoryId == request.CategoryId);
    if (data == null) throw new NotFoundException("Not found category");
    var contactremove = data.contactList.FirstOrDefault(x => x.id == request.DirectoryId);
    if (contactremove == null) throw new NotFoundException("Not found Directory Contact");
    data.contactList.Remove(contactremove);

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
    return new DeleteDirectoryContactResult() { Data = contactlist.Data };

  }
}
