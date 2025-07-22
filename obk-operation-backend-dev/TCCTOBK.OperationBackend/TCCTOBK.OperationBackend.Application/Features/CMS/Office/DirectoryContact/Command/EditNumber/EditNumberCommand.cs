using System;
using MediatR;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;

namespace TCCTOBK.OperationBackend.Application.Features.CMS.Office.DirectoryContact.Command.EditNumber;

public class EditNumberCommand : AuditableModel, IRequest<EditNumberResult>
{
  public Guid CategoryId { get; set; }
  public Guid? MoveCategoryId { get; set; }
  public Guid Id { get; set; }
  public string phonenumber { get; set; } = default!;
  public string nameEn { get; set; } = default!;
  public string nameTh { get; set; } = default!;
  public string nameZh { get; set; } = default!;
  public int seq { get; set; }
}
