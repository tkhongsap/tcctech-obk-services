//using MediatR;
//using Microsoft.Extensions.Logging;
//using TCCTOBK.OperationBackend.Application.Contracts;
//using TCCTOBK.OperationBackend.Domain.Entities;

//namespace TCCTOBK.OperationBackend.Application.Features.CMS.Privilege.Command.CreatePrivilege;
//public class CreatePrivilegesHandler : IRequestHandler<CreatePrivilegeCommand, CreatePrivilegesResult>
//{
//	private readonly ILogger<CreatePrivilegesHandler> _logger;
//	IUnitOfWork _uow;
//	public CreatePrivilegesHandler(IUnitOfWork uow, ILogger<CreatePrivilegesHandler> logger)
//	{
//		_uow = uow;
//		_logger = logger;
//	}
//	public async Task<CreatePrivilegesResult> Handle(CreatePrivilegeCommand request, CancellationToken cancellationToken)
//	{
//		var privilege = new mtPrivilege()
//		{
//			Name = request.Name,
//			Description = request.Description,
//			IsActive = request.IsActive,
//		};
//		await _uow.SaveChangeAsyncWithCommit();
//		var privilegeitem = request.PrivilegeItem.Select(x => new mtPrivilegeItem()
//		{
//			PTID = Guid.NewGuid(),
//			PID = Guid.NewGuid(),
//			mtPrivilege = privilege,
//			Name = x.Name,
//			Description = x.Description,
//			IsActive = x.IsActive,
//			Code = x.Code
//		}).ToList();
//		var createprivilege = await _uow.PrivilegeRepository.CreatePrivilege(privilege, privilegeitem);
//		await _uow.SaveChangeAsyncWithCommit();
//		return new CreatePrivilegesResult() { Message = "success" };
//	}
//}
