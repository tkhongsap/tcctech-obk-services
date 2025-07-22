using TCCTOBK.OperationBackend.Application.Configuration.Commands;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Exceptions;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.UsageMonitoring.Staff.Command.RemoveStaff;
internal class RemoveStaffHandler : ICommandHandler<RemoveStaffCommand, Guid>
{
	private readonly IUnitOfWork _uow;

	public RemoveStaffHandler(IUnitOfWork uow)
	{
		_uow = uow;
	}

	public async Task<Guid> Handle(RemoveStaffCommand request, CancellationToken cancellationToken)
	{
		var staff = await _uow.StaffRepository.GetById(request.Sfid);
		if (staff == null)
		{
			throw new NotFoundException("ไม่พบ Staff");
		}
		await _uow.StaffRepository.SoftDeleteByIdAsync(request.Sfid);
		await _uow.SaveChangeAsyncWithCommit();
		return request.Sfid;
	}
}
