using System;
using MediatR;
using TCCTOBK.OperationBackend.Application.Features.CMS.Office.DirectoryContact.Model;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;

namespace TCCTOBK.OperationBackend.Application.Features.CMS.Office.DirectoryContact.Command.UpdateDirectoryContact;

public class UpdateDirectoryContactCommand : AuditableModel, IRequest<UpdateDirectoryContactResult>
{
  public Guid CategoryId { get; set; }
  public string CategoryName { get; set; } = default!;
  public Guid? CategoryMoveto { get; set; }
  public List<ContactListModel> ContactList { get; set; } = new();
}
