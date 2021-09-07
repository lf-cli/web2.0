### 基于axios的通信库二次封装
##### 意义
> 当我们项目足够庞大的时候，需要对我们的请求进行管理，可以通过封装，将许多公共的方法或者操作抽离出来，减少代码量，并且方便统一管理。当我们需要对某个操作进行更改时，只需要修改我们的公共库即可，而不需要在每个vue文件中修改
> 请求的相关代码全部在request.js文件中，具体的请求接口全放在api.js，结构清晰，方便项目成员公共开发，以及后续的维护工作
##### 该库实现的功能
1、post请求 `可以根据需求使用不同的content-type请求头` `done`
2、get请求 `done`
3、对返回错误状态的处理，需要前后端定义失败状态码，以及错误信息提示信息 `done`
4、实现公共方法，对返回数据中某些字段统一处理，比如统一将时间戳转化为字符串，功能可以根据需求继续新增 `doing`
5、请求鉴权 `done`
6、设置公共请求参数 `done`
7、取消重复的请求 `done`
8、取消正在进行的请求 `done`
9、网络请求并发控制 `TODO`
10、根据传入参数动态显示请求loading `done`
11、根据需求显示post请求上传进度 `doing`
12、异步并发，控制同时上传的请求数量

##### 功能的使用通过传入options参数来实现，以下是options具体参数
```
1、loading 请求前是否显示loading遮罩层
options:{
  loading:false (default)
}

2、showError 错误提示是否通过message播报
options:{
  showError:true (default)
}

3、ContentType 默认是 'application/json' 传入form字段时为 'application/x-www-form-urlencoded;charset=UTF-8'
options:{
  ContentType:'json' (default)
}

4、baseUrl 项目中如果想使用mock数据，直接将baseUrl改为mock，单独配置mock的proxy即可 
options:{
  baseUrl:'/api' (default)
}
5、setCommonData  可以根据此字段来设置统一的请求参数,比如统一配置appId，那就在options中传入
options:{
  setCommonData:true,
  commonParams:{
    appId:'1223'
  }
}

6、cancelExitRequest  是否要取消正在进行的请求,例如从当前页面进入下一个页面，取消当前页面还没有请求完的请求
options:{
  cancelExitRequest:false (default)
}
7、allowRepeatRequest  是否允许重复请求（默认是不允许一个请求在300ms以内连续请求的，如果有连续请求的需求，给当前请求加上allowRepeatRequest参数）
options:{
  allowRepeatRequest:false (default)
}
```



##### 使用
`对于普通的get、post请求我们使用是跟原来完全一样的，只不过加了很多options可选参数，以供我们需要时去使用，如果不需要使用，不传options即可`
> post请求
```
  post({
    url: '/auth/login/noValidation', //请求地址，必填
    data,  //请求数据，必填
    options: { //请求配置项，选填
       ContentType: 'form'
    }
  })
```
> get使用
```
  get({
    url: '/api/air/airCaseTwoHighArea',//参数，必填
    params: query, //参数，必填
    options:{ //配置项，选填
      loading:true  
    }
  })
```
> 同时上传多个文件，为了防止网络崩溃，采用异步并发的方法 我们在做大文件上传的时候可以使用
```
import {sendRequest} from '@/utils/req.js'
let reqList:[ //请求列表，必填项
  {
    url:'',
    data:''
  },
  {
    url:'',
    data:''
  },
  ...
]
let max=4,  //最大同时请求数，选填，默认是4
sendRequest(reqList,max).then(res=>{

}).catch(err=>{

})
```
> 获取上传进度 （正在实现 pending）