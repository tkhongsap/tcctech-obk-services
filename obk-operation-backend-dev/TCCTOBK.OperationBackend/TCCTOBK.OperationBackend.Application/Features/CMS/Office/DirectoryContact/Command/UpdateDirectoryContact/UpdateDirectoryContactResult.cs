using System;
using TCCTOBK.OperationBackend.Application.Features.CMS.Office.DirectoryContact.Model;

namespace TCCTOBK.OperationBackend.Application.Features.CMS.Office.DirectoryContact.Command.UpdateDirectoryContact;

public class UpdateDirectoryContactResult
{
  public List<DirectoryContactModel> Data { get; set; } = new();
}
