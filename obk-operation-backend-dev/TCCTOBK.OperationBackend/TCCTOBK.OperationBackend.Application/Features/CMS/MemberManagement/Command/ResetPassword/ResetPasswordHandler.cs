using MediatR;
using TCCTOBK.OperationBackend.Application.Contracts;

namespace TCCTOBK.OperationBackend.Application;

public class ResetPasswordHandler : IRequestHandler<ResetPasswordCommand, ResetPasswordResult>
{
	IUnitOfWork _uow;
	public ResetPasswordHandler(IUnitOfWork uow)
	{
		_uow = uow;
	}
	public async Task<ResetPasswordResult> Handle(ResetPasswordCommand request, CancellationToken cancellationToken)
	{
		var member = await _uow.ResetPasswordRepository.Get(request.ResetPasswordCode);
		_ = await _uow.ResetPasswordRepository.UpdateStatus(member.MID, request.ResetPasswordCode);
		await _uow.SaveChangeAsyncWithCommit();
		return new ResetPasswordResult();
	}
}
