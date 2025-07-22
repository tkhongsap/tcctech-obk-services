using System;
using MediatR;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;

namespace TCCTOBK.OperationBackend.Application.Features.CMS.Office.DirectoryContact.Command.DeleteCategoryDirectoryContact;

public class DeleteCategoryDirectoryContactCommand : AuditableModel, IRequest<DeleteCategoryDirectoryContactResult>
{
  public Guid CategoryId { get; set; }

  public DeleteCategoryDirectoryContactCommand(Guid categoryId)
  {
    CategoryId = categoryId;
  }
}
