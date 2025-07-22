using System;
using MediatR;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;

namespace TCCTOBK.OperationBackend.Application.Features.CMS.Office.DirectoryContact.Command.CreateDirectoryContact;

public class CreateDirectoryContactCommand : AuditableModel, IRequest<CreateDirectoryContactResult>
{
  public string CategoryName { get; set; } = default!;
}
