using MediatR;
using System.IdentityModel.Tokens.Jwt;
using System.Reflection.Metadata;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Contracts.API;
using TCCTOBK.OperationBackend.Application.Contracts.DataModel.AuthRepository;
using TCCTOBK.OperationBackend.Application.Exceptions;

namespace TCCTOBK.OperationBackend.Application;

public class ResetPasswordCMSHandler : IRequestHandler<ResetPasswordCMSCommand, ResetPasswordCMSResult>
{
    private readonly IUnitOfWork _uow;
    private readonly IAbstractionService _abstractionService;

    public ResetPasswordCMSHandler(IAbstractionService abstractionService, IUnitOfWork uow)
    {
        _abstractionService = abstractionService;
        _uow = uow;
    }

    public async Task<ResetPasswordCMSResult> Handle(ResetPasswordCMSCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var reset = new ResetPasswordModel
            {
                Username = request.Username,
                NewPassword = request.Password ?? Domain.Constant.NEW_RESET_PASSWORD
            };

            await _abstractionService.UserService.ResetPasswordCMS(reset);

            await _uow.MemberRepository.updateByKeycloak(request.Username, request);
            await _uow.SaveChangeAsyncWithCommit();
            var result = new ResetPasswordCMSResult
            {
                IsSuccess = true
            };

            return result;
        }
        catch (Exception)
        {
            var result = new ResetPasswordCMSResult
            {
                IsSuccess = false
            };

            return result;
        }
    }
}





