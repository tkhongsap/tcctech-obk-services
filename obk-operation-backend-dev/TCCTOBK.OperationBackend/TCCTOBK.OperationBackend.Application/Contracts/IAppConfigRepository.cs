namespace TCCTOBK.OperationBackend.Application.Contracts;
public interface IAppConfigRepository
{
	Task<string> GetValueByName(string name);
}
