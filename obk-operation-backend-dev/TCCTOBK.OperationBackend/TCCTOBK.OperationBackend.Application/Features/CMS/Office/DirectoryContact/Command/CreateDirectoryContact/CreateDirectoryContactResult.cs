using System;
using TCCTOBK.OperationBackend.Application.Features.CMS.Office.DirectoryContact.Model;

namespace TCCTOBK.OperationBackend.Application.Features.CMS.Office.DirectoryContact.Command.CreateDirectoryContact;

public class CreateDirectoryContactResult
{
  public List<DirectoryContactModel> Data { get; set; } = new();
}
