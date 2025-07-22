using MediatR;

namespace TCCT.ServiceAbstraction.Application.Configuration.Queries;
public interface IQuery<out TResult> : IRequest<TResult>
{

}
