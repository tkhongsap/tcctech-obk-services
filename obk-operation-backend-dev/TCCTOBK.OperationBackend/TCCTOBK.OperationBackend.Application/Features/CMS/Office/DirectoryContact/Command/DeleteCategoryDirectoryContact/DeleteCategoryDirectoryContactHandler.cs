using System;
using System.Text.Json;
using System.Text.Json.Nodes;
using MediatR;
using TCCTOBK.OperationBackend.Application.Contracts.API;
using TCCTOBK.OperationBackend.Application.Exceptions;
using TCCTOBK.OperationBackend.Application.Features.CMS.Office.DirectoryContact.Model;
using TCCTOBK.OperationBackend.Application.Features.CMS.Office.DirectoryContact.Query.GetDirectoryContactCategory;
using TCCTOBK.OperationBackend.Domain;

namespace TCCTOBK.OperationBackend.Application.Features.CMS.Office.DirectoryContact.Command.DeleteCategoryDirectoryContact;

public class DeleteCategoryDirectoryContactHandler : IRequestHandler<DeleteCategoryDirectoryContactCommand, DeleteCategoryDirectoryContactResult>
{
  IAPIService _apiservice;
  IMediator _mediator;

  public DeleteCategoryDirectoryContactHandler(IAPIService apiservice, IMediator mediator)
  {
    _apiservice = apiservice;
    _mediator = mediator;
  }

  public async Task<DeleteCategoryDirectoryContactResult> Handle(DeleteCategoryDirectoryContactCommand request, CancellationToken cancellationToken)
  {
    var contactlist = await _mediator.Send(new GetDirectoryContactCategoryQuery(null));
    var data = contactlist.Data.FirstOrDefault(x => x.categoryId == request.CategoryId);
    if (data == null) throw new NotFoundException("Not found category");
    //check uncategory 
    var uncategory = new DirectoryContactModel();
    var uc = contactlist.Data.FirstOrDefault(x => x.categoryId == Guid.Empty);
    if (uc == null)
    {
      uncategory.categoryId = Guid.Empty;
      uncategory.category = "Ungroup Category";
      uncategory.contactList = data.contactList;
      uncategory.createdBy = request.CreatedByName;
      uncategory.createdAt = request.CreatedDate;
    }
    else
    {
      uncategory = uc;
      uncategory.contactList.AddRange(data.contactList);
    }
    uncategory.updatedBy = request.UpdatedByName;
    uncategory.updatedAt = request.UpdatedDate;

    contactlist.Data.Remove(data);

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
    return new DeleteCategoryDirectoryContactResult() { Data = contactlist.Data };
  }
}
