using System;
using MediatR;

namespace TCCTOBK.OperationBackend.Application.Features.CMS.Office.DirectoryContact.Query.GetDirectoryContactById;

public class GetDirectoryContactByIdQuery : IRequest<GetDirectoryContactByIdResult>
{
  public Guid Id { get; set; }

  public GetDirectoryContactByIdQuery(Guid id)
  {
    Id = id;
  }
}
