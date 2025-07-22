using System;
using System.Text.Json;
using System.Text.Json.Nodes;
using MediatR;
using Org.BouncyCastle.Math.EC.Rfc7748;
using TCCTOBK.OperationBackend.Application.Contracts.API;
using TCCTOBK.OperationBackend.Application.Exceptions;
using TCCTOBK.OperationBackend.Application.Features.CMS.Office.DirectoryContact.Model;
using TCCTOBK.OperationBackend.Application.Features.CMS.Office.DirectoryContact.Query.GetDirectoryContactCategory;
using TCCTOBK.OperationBackend.Domain;

namespace TCCTOBK.OperationBackend.Application.Features.CMS.Office.DirectoryContact.Command.EditNumber;

public class EditNumberHandler : IRequestHandler<EditNumberCommand, EditNumberResult>
{
  IAPIService _apiservice;
  IMediator _mediator;

  public EditNumberHandler(IAPIService apiservice, IMediator mediator)
  {
    _apiservice = apiservice;
    _mediator = mediator;
  }

  public async Task<EditNumberResult> Handle(EditNumberCommand request, CancellationToken cancellationToken)
  {
    var directoryconatct = await _mediator.Send(new GetDirectoryContactCategoryQuery(null));
    var categorydata = directoryconatct.Data.FirstOrDefault(x => x.categoryId == request.CategoryId);
    if (categorydata == null) throw new NotFoundException("Not found category");
    if (request.MoveCategoryId != null)
    {
      var movecontact = new ContactListModel();
      foreach (var item in categorydata.contactList)
      {
        if (request.Id == item.id)
        {
          movecontact.id = item.id;
          movecontact.phonenumber = request.phonenumber;
          movecontact.nameEn = request.nameEn;
          movecontact.nameTh = request.nameTh;
          movecontact.nameZh = request.nameZh;
          movecontact.updatedAt = request.UpdatedDate.ToString();
          movecontact.updatedBy = request.UpdatedByName;
          movecontact.seq = item.seq;
          categorydata.contactList.Remove(item);
          break;
        }
      }
      var removedata = directoryconatct.Data.FirstOrDefault(x => x.categoryId == request.CategoryId);
      directoryconatct.Data.Remove(removedata);
      directoryconatct.Data.Add(categorydata);
      var movecat = directoryconatct.Data.FirstOrDefault(x => x.categoryId == request.MoveCategoryId);
      directoryconatct.Data.Remove(movecat);
      movecat.contactList.Add(movecontact);
      directoryconatct.Data.Add(movecat);
    }
    else
    {
      foreach (var item in categorydata.contactList)
      {
        if (request.Id == item.id)
        {
          item.phonenumber = request.phonenumber;
          item.nameEn = request.nameEn;
          item.nameTh = request.nameTh;
          item.nameZh = request.nameZh;
          item.updatedAt = request.UpdatedDate.ToString();
          item.updatedBy = request.UpdatedByName;
          item.seq = request.seq;
        }
      }
      var removedata = directoryconatct.Data.FirstOrDefault(x => x.categoryId == request.CategoryId);
      directoryconatct.Data.Remove(removedata);
      directoryconatct.Data.Add(categorydata);
    }
    #region storeData
    var filebaseauth = new FirebaseOAuth(DomainConfig.FirebaseAdmin);
    var token = await filebaseauth.AuthRemoteConfig();
    var bearertoken = $"Bearer {token}";
    var getremoteconfigquery = new GetRemoteConfigDataQuery();
    var getremoteconfigresult = await _mediator.Send(getremoteconfigquery);
    var dataobj = JsonObject.Parse(getremoteconfigresult.data);
    string jsonValue = JsonSerializer.Serialize(directoryconatct.Data);
    dataobj["parameters"]["directory_contact"]["defaultValue"]["value"] = jsonValue;
    var version = (string)dataobj["version"]["versionNumber"];
    version = version!.Trim('"');
    var etag = "etag-" + DomainConfig.FirebaseAdmin.ProjectCode + "-" + version;
    await _apiservice.FirebaseRemoteConfig.UpdateRemoteConfig(bearertoken, etag, dataobj);
    #endregion
    return new EditNumberResult();
  }
}
