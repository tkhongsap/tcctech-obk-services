using System;
using System.Linq.Dynamic.Core.Tokenizer;

namespace TCCTOBK.OperationBackend.Application.Helper.FCMNotification.Service;

public interface IFCMNotificationService
{
  Task<(string, bool)> SendNotification(string title, string message, string token);
}
