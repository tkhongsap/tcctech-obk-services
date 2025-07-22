using System;
using System.Text.Json;
using System.Text.Json.Nodes;
using MediatR;
using TCCTOBK.OperationBackend.Application.Contracts.API;
using TCCTOBK.OperationBackend.Application.Exceptions;
using TCCTOBK.OperationBackend.Application.Features.CMS.Office.DirectoryContact.Model;
using TCCTOBK.OperationBackend.Application.Features.CMS.Office.DirectoryContact.Query.GetDirectoryContactCategory;
using TCCTOBK.OperationBackend.Domain;

namespace TCCTOBK.OperationBackend.Application.Features.CMS.Office.DirectoryContact.Command.UpdateDirectoryContact;

public class UpdateDirectoryContactHandler : IRequestHandler<UpdateDirectoryContactCommand, UpdateDirectoryContactResult>
{
  IAPIService _apiservice;
  IMediator _mediator;

  public UpdateDirectoryContactHandler(IAPIService apiservice, IMediator mediator)
  {
    _apiservice = apiservice;
    _mediator = mediator;
  }

  public async Task<UpdateDirectoryContactResult> Handle(UpdateDirectoryContactCommand request, CancellationToken cancellationToken)
  {

    var contactlist = await _mediator.Send(new GetDirectoryContactCategoryQuery(null));
    var categorydata = contactlist.Data.FirstOrDefault(x => x.categoryId == request.CategoryId);
    var newdata = new DirectoryContactModel();
    if (request.CategoryMoveto != null)
    {
      var removecontact = request.ContactList.FirstOrDefault();
      if (removecontact == null) throw new NotFoundException("Not found category");
      var contactToRemove = categorydata.contactList
          .First(c => c.id == request.ContactList.First().id);
      categorydata.contactList.Remove(contactToRemove);
      contactlist.Data.Remove(categorydata);
      var dtafter = new DirectoryContactModel()
      {
        category = request.CategoryName,
        categoryId = request.CategoryId,
        contactList = categorydata.contactList,
        updatedAt = request.UpdatedDate,
        updatedBy = request.UpdatedByName,
      };
      contactlist.Data.Add(dtafter);

      var movecat = contactlist.Data.FirstOrDefault(x => x.categoryId == request.CategoryMoveto);
      if (movecat == null) throw new NotFoundException("Not found category");
      contactlist.Data.Remove(movecat);
      var movecontactdata = request.ContactList.First();
      movecontactdata.updatedAt = request.UpdatedDate.ToString();
      movecontactdata.updatedBy = request.UpdatedByName;
      movecat.contactList.Add(request.ContactList.First());
      contactlist.Data.Add(movecat);
    }
    else
    {
      if (categorydata == null) throw new NotFoundException("Not found category");
      contactlist.Data.Remove(categorydata);
      var updatedata = categorydata.contactList.Where(l1 => request.ContactList.Any(l2 => l2.id == l1.id &&
                              (l2.phonenumber != l1.phonenumber ||
                              l2.nameEn != l1.nameEn ||
                              l2.nameTh != l1.nameTh ||
                              l2.nameZh != l1.nameZh)));
      foreach (var item in request.ContactList)
      {
        if (updatedata.Any(x => x.id == item.id))
        {
          item.updatedAt = request.UpdatedDate.ToString();
          item.updatedBy = request.UpdatedByName;
        }
        if (item.updatedAt == "c")
        {
          item.updatedAt = request.UpdatedDate.ToString();
          item.updatedBy = request.UpdatedByName;
        }
      }
      newdata = new DirectoryContactModel()
      {
        category = request.CategoryName,
        categoryId = request.CategoryId,
        contactList = request.ContactList,
        updatedAt = request.UpdatedDate,
        updatedBy = request.UpdatedByName,
      };
      contactlist.Data.Add(newdata);
    }

    //store new data
    #region storeData
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
    #endregion
    return new UpdateDirectoryContactResult() { Data = contactlist.Data };
  }
}
