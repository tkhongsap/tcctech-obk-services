using MediatR;
using Microsoft.Extensions.Logging;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Application.Features.CMS.Privilege.Command.CreatePrivileges;
public class CreatePrivilegesHandler : IRequestHandler<CreatePrivilegesCommand, int>
{
	private readonly ILogger<CreatePrivilegesHandler> _logger;
	IUnitOfWork _uow;
	public CreatePrivilegesHandler(IUnitOfWork uow, ILogger<CreatePrivilegesHandler> logger)
	{
		_uow = uow;
		_logger = logger;
	}
	public async Task<int> Handle(CreatePrivilegesCommand request, CancellationToken cancellationToken)
	{
		var privileges = new List<mtPrivilege>();
		foreach (var privilege in request.Privileges)
		{
			var newPrivilege = new mtPrivilege
			{
				PID = Guid.NewGuid(),
				Name = privilege.Name,
				Description = privilege.Description,
				IsActive = true,
			};
			newPrivilege.mtPrivilegeItems = privilege.PrivilegeItem.Select(x => new mtPrivilegeItem { PID = newPrivilege.PID, PTID = Guid.NewGuid(), Code = x.Code, IsActive = true, Name = x.Name, Description = x.Description, mtPrivilege = newPrivilege }).ToList();
			privileges.Add(newPrivilege);
		}
		await _uow.PrivilegeRepository.CreatePrivileges(privileges);
		await _uow.SaveChangeAsyncWithCommit();
		return 1;
	}
}
