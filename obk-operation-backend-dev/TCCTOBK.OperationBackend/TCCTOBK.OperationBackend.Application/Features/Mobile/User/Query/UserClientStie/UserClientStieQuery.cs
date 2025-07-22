using System;
using MediatR;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.User.Query.UserClientStie;

public class UserClientStieQuery : IRequest<UserClientStieResult>
{
  public string KCUsername { get; set; }

  public UserClientStieQuery(string kCUsername)
  {
    KCUsername = kCUsername;
  }

}
