using System;
using MediatR;

namespace TCCTOBK.OperationBackend.Application.Features.CMS.Office.DirectoryContact.Command.DeleteDirectoryContact;

public class DeleteDirectoryContactCommand : IRequest<DeleteDirectoryContactResult>
{
  public Guid CategoryId { get; set; }
  public Guid DirectoryId { get; set; }
}
