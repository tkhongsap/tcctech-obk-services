using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TCCTOBK.OperationBackend.Application.Contracts.DataModel.AuthRepository;
public class LoginRequestModel
{
	public string Username { get; set; } = default!;
	public string Password { get; set; } = default!;

	public LoginRequestModel(string username, string password)
	{
		Username = username;
		Password = password;
	}
}
