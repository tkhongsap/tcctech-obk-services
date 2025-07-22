using System;
using TCCTOBK.OperationBackend.Application.Features.CMS.Office.DirectoryContact.Model;

namespace TCCTOBK.OperationBackend.Application.Features.CMS.Office.DirectoryContact.Query.GetDirectoryContactById;

public class GetDirectoryContactByIdResult
{
  public Guid id { get; set; }
  public string phonenumber { get; set; } = default!;
  public string nameEn { get; set; } = default!;
  public string nameTh { get; set; } = default!;
  public string nameZh { get; set; } = default!;
  public string updatedAt { get; set; } = default!;
  public string updatedBy { get; set; } = default!;
  public Guid categoryId { get; set; }
  public string category { get; set; } = default!;
  public int seq { get; set; }
}
