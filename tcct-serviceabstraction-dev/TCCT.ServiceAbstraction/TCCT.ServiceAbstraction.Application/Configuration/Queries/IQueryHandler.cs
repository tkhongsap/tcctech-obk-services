using MediatR;

namespace TCCT.ServiceAbstraction.Application.Configuration.Queries;
public interface IQueryHandler<in TQuery, TResult> :
	IRequestHandler<TQuery, TResult> where TQuery : IQuery<TResult>
{

}
