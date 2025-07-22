using MediatR;
using Newtonsoft.Json;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Exceptions;

namespace TCCTOBK.OperationBackend.Application;

public class UATLoginHandler : IRequestHandler<UATLoginCommand, UATLoginResult>
{
  private readonly IUnitOfWork _uow;
  public UATLoginHandler(IUnitOfWork uow)
  {
    _uow = uow;
  }
  public async Task<UATLoginResult> Handle(UATLoginCommand request, CancellationToken cancellationToken)
  {
    var memberUat = await _uow.MemberUatRepository.GetAll();
    var userList = JsonConvert.DeserializeObject<List<UserData>>(memberUat.MetaData!);
    //[{"Username":"Sudjai.Sangpara@jll.com","Role":1,"Id":"bfa4f851-118f-4fd3-93ca-c1132accfdca","Fullname":"Thanapon Lainumcharone"},{"Username":"Apichart.Sanohsot@jll.com","Role":1,"Id":"3dc817bc-53eb-4751-9c6e-2ad3006b44b5","Fullname":"Apichart Sanohsot (STech PM, CUP)"},{"Username":"Nontanat.Sukgasem@jll.com","Role":1,"Id":"6663e160-4265-46fc-a08a-e077deb4c05c","Fullname":"Nontanat Sukgasem (STech PM, CUP)"},{"Username":"Rewat.Liamdee@jll.com","Role":1,"Id":"cd23fd83-6301-4f0e-a75b-8adcb235defe","Fullname":"Rewat Liamdee"},{"Username":"Yutthana.Oonsri@jll.com","Role":1,"Id":"2b7f6f7d-612a-4844-b322-3a1b7fa8583f","Fullname":"Yutthana Oonsri (ST, CUP-FMC)"},{"Username":"Piyanat.Kamtai@jll.com","Role":3,"Id":"e38ef3a5-e565-4dd6-a235-bb2ef25e66a5","Fullname":"Chakkapad Intra (Tech, CUP-FMC)"},{"Username":"Wittaya.Rattanawan@jll.com","Role":3,"Id":"48dec556-1627-4972-90f3-951987478158","Fullname":"Wittaya Rattanawan (ST, CUP-FMC)"},{"Username":"Tanapat.Naokaengmai@jll.com","Role":3,"Id":"9fd6cea8-3f9c-467e-a198-9193f82545fe","Fullname":"Tanapat naokaengmai"},{"Username":"Klao.Wattanawikkan@jll.com","Role":3,"Id":"f93054d4-5c2b-48b0-b742-eca5bb2c2dd5","Fullname":"Parinya Lilanoi"},{"Username":"Karanyu.Maihom@jll.com","Role":3,"Id":"fc906d62-91cf-4e74-8e2a-f29147e1c7e2","Fullname":"Chinnaphat Sangchote"},{"Username":"kasira.yomthaisong@jll.com","Role":3,"Id":"91a938a0-b03c-4559-b44b-81f74ff5479e","Fullname":"Kasira Yomthaisong (FMC - CUP/CI)"},{"Username":"doungkamol.pooleaum@jll.com","Role":3,"Id":"807629c5-f45a-430e-9b0e-8a69201d9c2f","Fullname":"Doungkamol Pooleaum"},{"Username":"phumwadon.bucha@jll.com","Role":3,"Id":"ab423508-ad3d-4c72-af99-fd4d37214c77","Fullname":"Clean CI.05"},{"Username":"nuttawoot.muangklun@jll.com","Role":3,"Id":"8aa9e9ca-3ab2-411d-8894-38d40b18c33b","Fullname":"Clean CI.04"},{"Username":"taveesak.wutilakkaj@jll.com","Role":3,"Id":"6488caed-f968-4011-9e27-299b04972a40","Fullname":"Taveesak Wutilakkaj (Garden, Event - CUP/CI)"},{"Username":"tawat.chananchana@jll.com","Role":3,"Id":"4f4654fd-a885-4265-8245-8190b4cbf7b9","Fullname":"Clean CI.02"},{"Username":"waewta.nanok@jll.com","Role":3,"Id":"1e6f2fc6-7c45-4f89-9a5c-d3a119b063f9","Fullname":"Clean CI.08"},{"Username":"clean.ci07.test@gmail.com","Role":3,"Id":"2143f295-8407-4ea3-87fc-1b7de9a69f82","Fullname":"Clean CI.07"},{"Username":"clean.ci06.test@gmail.com","Role":3,"Id":"4cf81f08-8d4e-4198-949a-ff1fa6210e92","Fullname":"Clean CI.06"},{"Username":"clean.ci.03.test@gmail.com","Role":3,"Id":"7a5e2b47-48f4-4005-8823-a7cf6cae2b99","Fullname":"Clean CI.03"}]
    var user = userList!.FirstOrDefault(x => x.Username.ToLower() == request.Username.ToLower());
    if (user == null || request.Password != "1234")
    {
      throw new NotFoundException("Invalid Username Or Password");
    }
    var res = new UATLoginResult()
    {
      Id = user.Id,
      FullName = user.Fullname,
      Role = user.Role,
      IsTech = user.IsTech
    };
    return res;
  }

  public class UserData
  {
    public string Username { get; set; }
    public int Role { get; set; }
    public string Id { get; set; }
    public string Fullname { get; set; }
    public bool IsTech { get; set; }
  }
}
