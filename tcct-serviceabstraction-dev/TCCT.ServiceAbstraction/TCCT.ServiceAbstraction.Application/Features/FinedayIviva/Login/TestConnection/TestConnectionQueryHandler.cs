//using TCCT.ServiceAbstraction.Application.Configuration.Queries;
//using TCCT.ServiceAbstraction.Application.Contracts.FinedayIviva;

//namespace TCCT.ServiceAbstraction.Application.Features.FinedayIviva.Login.TestConnection;

//public sealed class TestConnectionQueryHandler : IQueryHandler<TestConnectionQuery, TestConnectionResult>
//{
//	private readonly IFinedayIvivaService _service;
//	public TestConnectionQueryHandler(IFinedayIvivaService service)
//	{
//		_service = service;
//	}

//	public async Task<TestConnectionResult> Handle(TestConnectionQuery request, CancellationToken cancellationToken)
//	{
//		var res = await _service.WithLogin().TestConnection();
//		return res;
//	}

//}

