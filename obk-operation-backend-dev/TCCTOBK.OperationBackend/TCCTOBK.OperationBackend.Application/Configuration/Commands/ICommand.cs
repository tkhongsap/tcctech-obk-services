using MediatR;

namespace TCCTOBK.OperationBackend.Application.Configuration.Commands;
public interface ICommand : IRequest
{
}

public interface ICommand<out TResult> : IRequest<TResult>
{
}
