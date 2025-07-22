namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidentialResponse
{
	public class ServiceMindResidentialResponse<T> where T : class
	{
		public ServiceMindResidentialPaginateResponse paginate { get; set; }
		public T? data { get; set; }
	}

	public class ServiceMindResidentialPaginateResponse
	{
		public int total { get; set; }
		public int limit { get; set; }
		public int count { get; set; }
		public int page { get; set; }
	}
}
