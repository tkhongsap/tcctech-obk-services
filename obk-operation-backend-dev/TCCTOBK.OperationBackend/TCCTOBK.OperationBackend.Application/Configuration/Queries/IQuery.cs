using MediatR;

namespace TCCTOBK.OperationBackend.Application.Configuration.Queries;
public interface IQuery<out TResult> : IRequest<TResult>
{

}
