bff : 用户APP服务层
us: 用户系统
acct: 账户系统
pay: 收银台

bff -> us : 验证用户登陆
bff <-- us : 返回用户基本信息
if  xxx>0
bff --> acct : 查询账户余额
bff -> pay :  充值
bff <-- pay : 充值成功
end