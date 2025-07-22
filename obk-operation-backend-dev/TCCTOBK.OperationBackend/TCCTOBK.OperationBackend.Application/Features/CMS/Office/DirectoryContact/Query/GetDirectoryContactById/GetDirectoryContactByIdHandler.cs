using System;
using MediatR;
using TCCTOBK.OperationBackend.Application.Contracts.API;
using TCCTOBK.OperationBackend.Application.Features.CMS.Office.DirectoryContact.Model;
using TCCTOBK.OperationBackend.Application.Features.CMS.Office.DirectoryContact.Query.GetDirectoryContactCategory;

namespace TCCTOBK.OperationBackend.Application.Features.CMS.Office.DirectoryContact.Query.GetDirectoryContactById;

public class GetDirectoryContactByIdHandler : IRequestHandler<GetDirectoryContactByIdQuery, GetDirectoryContactByIdResult>
{
  IAPIService _apiservice;
  IMediator _mediator;

  public GetDirectoryContactByIdHandler(IAPIService apiservice, IMediator mediator)
  {
    _apiservice = apiservice;
    _mediator = mediator;
  }

  public async Task<GetDirectoryContactByIdResult> Handle(GetDirectoryContactByIdQuery request, CancellationToken cancellationToken)
  {
    var contactlist = await _mediator.Send(new GetDirectoryContactCategoryQuery(null));
    var res = new GetDirectoryContactByIdResult();
    foreach (var item in contactlist.Data)
    {
      if (item.contactList.Any(x => x.id == request.Id))
      {
        var dt = item.contactList.First(x => x.id == request.Id);
        res.id = dt.id;
        res.phonenumber = dt.phonenumber;
        res.nameEn = dt.nameEn;
        res.nameTh = dt.nameTh;
        res.nameZh = dt.nameZh;
        res.updatedAt = dt.updatedAt;
        res.updatedBy = dt.updatedBy;
        res.categoryId = item.categoryId;
        res.category = item.category;
        res.seq = dt.seq;
        break;
      }
    }
    return res;
  }
}
