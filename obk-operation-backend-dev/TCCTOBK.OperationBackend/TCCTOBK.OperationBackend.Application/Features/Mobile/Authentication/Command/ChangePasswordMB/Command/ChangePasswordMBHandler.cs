using MediatR;
using Refit;
using System.IdentityModel.Tokens.Jwt;
using System.Reflection.Metadata;
using System.Text.Json;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Contracts.API;
using TCCTOBK.OperationBackend.Application.Contracts.DataModel.AuthRepository;
using TCCTOBK.OperationBackend.Application.Exceptions;
using TCCTOBK.OperationBackend.Domain;

namespace TCCTOBK.OperationBackend.Application;

public class ChangePasswordMBHandler : IRequestHandler<ChangePasswordMBCommand, ChangePasswordMBResult>
{
    private readonly IUnitOfWork _uow;
    private readonly IAbstractionService _abstractionService;

    public ChangePasswordMBHandler(IAbstractionService abstractionService, IUnitOfWork uow)
    {
        _abstractionService = abstractionService;
        _uow = uow;
    }

    public async Task<ChangePasswordMBResult> Handle(ChangePasswordMBCommand request, CancellationToken cancellationToken)
    {
        try
        {

            var change = new ChangePasswordModel
            {
                Username = request.Username,
                OldPassword = request.OldPassword,
                NewPassword = request.NewPassword
            };


            await _abstractionService.UserService.ChangePassword(change);

            await _uow.MemberRepository.updateByKeycloak(request.Username, request);
            await _uow.SaveChangeAsyncWithCommit();
            var result = new ChangePasswordMBResult
            {
                Issuccess = true
            };

            return result;
        }
        catch (Exception)
        {
            var result = new ChangePasswordMBResult
            {
                Issuccess = false
            };

            return result;
        }
    }

}



