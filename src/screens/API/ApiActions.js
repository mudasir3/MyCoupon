
import APIBaseUrl from "./ApiUrl";
import axios from "axios"; 

export const registerUser = params => {
  console.log("registerUser " +JSON.stringify(params) + " url " +APIBaseUrl.HOST + APIBaseUrl.REGISTER )

    return axios.post(APIBaseUrl.HOST + APIBaseUrl.REGISTER , JSON.stringify(params),
    {
       'headers': {
         'Content-Type': 'application/json',
         'Accept':'application/json'
       }
     });
 }

// export const registerUser = params => {
//   console.log("registerUser " +JSON.stringify(params) + " url " +APIBaseUrl.HOST + APIBaseUrl.REGISTER )

//     return axios.get("https://jsonplaceholder.typicode.com/todos/1" ,
//     {
//        'headers': {
//          'Content-Type': 'application/json',
//          'Accept':'application/json'
//        }
//      });
//  }

 export const EnterOTP = params => {
   console.log("params " + JSON.stringify(params))

  return axios.post(APIBaseUrl.HOST + APIBaseUrl.OTP , JSON.stringify(params),
  {
     'headers': {
       'Content-Type': 'application/json',
       'Accept':'application/json'
     }
   });
}

export const SetPin = params => {

  return axios.post(APIBaseUrl.HOST + APIBaseUrl.SETPIN, JSON.stringify(params),
  {
     'headers': {
       'Content-Type': 'application/json',
       'Accept':'application/json'
     }
   });
}

export const Login = params => {

  return axios.post(APIBaseUrl.HOST + APIBaseUrl.LOGIN, JSON.stringify(params),
  {
     'headers': {
       'Content-Type': 'application/json',
       'Accept':'application/json'
     }
   });
}


export const GetTransaction = params => {

  console.log(APIBaseUrl.HOST + APIBaseUrl.AllTransactions)
  
  return axios.post(APIBaseUrl.HOST + APIBaseUrl.AllTransactions, JSON.stringify(params),
  {
     'headers': {
       'Content-Type': 'application/json',
       'Accept':'application/json'
     }
   });
}

export const BiometricLogin = params => {

  console.log("biometric" +  JSON.stringify(params))
  return axios.post(APIBaseUrl.HOST + APIBaseUrl.BiometricLogin, JSON.stringify(params),
  {
     'headers': {
       'Content-Type': 'application/json',
       'Accept':'application/json'
     }
   });
}

export const ResendCode = params => {

  console.log("ResendCode" +  JSON.stringify(params))
  return axios.post(APIBaseUrl.HOST + APIBaseUrl.RESENDCODE, JSON.stringify(params),
  {
     'headers': {
       'Content-Type': 'application/json',
       'Accept':'application/json'
     }
   });
}

export const ForgotPin = params => {

  console.log("ForgotPin" +  JSON.stringify(params))
  return axios.post(APIBaseUrl.HOST + APIBaseUrl.ForgotPassword, JSON.stringify(params),
  {
     'headers': {
       'Content-Type': 'application/json',
       'Accept':'application/json'
     }
   });
}

export const NewEW = params => {


  return axios.post(APIBaseUrl.HOST + APIBaseUrl.NewEW, JSON.stringify(params),
  {
     'headers': {
       'Content-Type': 'application/json',
       'Accept':'application/json'
     }
   });
}

export const LoginMerchant = params => {

  console.log("NEW EW" +  JSON.stringify(params))

  return axios.post(APIBaseUrl.HOST + APIBaseUrl.LoginMerchant, JSON.stringify(params),
  {
     'headers': {
       'Content-Type': 'application/json',
       'Accept':'application/json'
     }
   });
}

export const getAllEW = (params) => {

//  console.log("get all ew " + APIBaseUrl.HOST + APIBaseUrl.GetAllEW+params )
  return axios.get(APIBaseUrl.HOST + APIBaseUrl.GetAllEW+params,
  {
     'headers': {
       'Content-Type': 'application/json',
       'Accept':'application/json'
     }
   });
}

export const getAllEWMerchant = (params) => {

  console.log("get all ew " + APIBaseUrl.HOST + APIBaseUrl.GetAllEwMerchant+params )
  return axios.get(APIBaseUrl.HOST + APIBaseUrl.GetAllEwMerchant+params,
  {
     'headers': {
       'Content-Type': 'application/json',
       'Accept':'application/json'
     }
   });
}

export const getAllEWCreator = (params) => {

  console.log("get all ew " + APIBaseUrl.HOST + APIBaseUrl.GetAllEwCreator+params )
  return axios.get(APIBaseUrl.HOST + APIBaseUrl.GetAllEwCreator+params,
  {
     'headers': {
       'Content-Type': 'application/json',
       'Accept':'application/json'
     }
   });
}

export const DeleteMerchant = params => {

  return axios.post(APIBaseUrl.HOST + APIBaseUrl.DeleteMerchant, JSON.stringify(params),
  {
     'headers': {
       'Content-Type': 'application/json',
       'Accept':'application/json'
     }
   });
}

export const JoinEW = params => {

  return axios.post(APIBaseUrl.HOST + APIBaseUrl.JoinEW, JSON.stringify(params),
  {
     'headers': {
       'Content-Type': 'application/json',
       'Accept':'application/json'
     }
   });
}

export const JoinEWMerchant = params => {

  console.log("join  ew  url" + APIBaseUrl.HOST + APIBaseUrl.JoinEWMerchant)
  console.log("join  ew  params" +JSON.stringify( params))

  return axios.post(APIBaseUrl.HOST + APIBaseUrl.JoinEWMerchant, JSON.stringify(params),
  {
     'headers': {
       'Content-Type': 'application/json',
       'Accept':'application/json'
     }
   });
}

export const UseEWMerchant = params => {

  console.log("join  ew  url" + APIBaseUrl.HOST + APIBaseUrl.UseEWMerchant)
  console.log("join  ew  params" +JSON.stringify( params))

  return axios.post(APIBaseUrl.HOST + APIBaseUrl.UseEWMerchant, JSON.stringify(params),
  {
     'headers': {
       'Content-Type': 'application/json',
       'Accept':'application/json'
     }
   });
}

export const UserDetail = params => {

 // console.log("url " +  APIBaseUrl.HOST + APIBaseUrl.UserDetails+params)
  
  return axios.get(APIBaseUrl.HOST + APIBaseUrl.UserDetails+params,
  {
     'headers': {
       'Content-Type': 'application/json',
       'Accept':'application/json'
     }
   });
}

export const MerchantDetails = params => {

 // console.log("url " +  APIBaseUrl.HOST + APIBaseUrl.MerchantDetails+params)
  
  return axios.get(APIBaseUrl.HOST + APIBaseUrl.MerchantDetails+params,
  {
     'headers': {
       'Content-Type': 'application/json',
       'Accept':'application/json'
     }
   });
}

export const exportdata = params => {

  console.log("url " +  APIBaseUrl.HOST + APIBaseUrl.ExportData + "  params " + JSON.stringify(params))
  
  return axios.post(APIBaseUrl.HOST + APIBaseUrl.ExportData,JSON.stringify(params),
  {
     'headers': {
       'Content-Type': 'application/json',
       'Accept':'application/json'
     }
   });
}

export const transaction = params => {

 // console.log("params " + JSON.stringify(params) )
  console.log("url "  +APIBaseUrl.HOST + APIBaseUrl.Transactions)
  
  return axios.post(APIBaseUrl.HOST + APIBaseUrl.Transactions, JSON.stringify(params),
  {
     'headers': {
       'Content-Type': 'application/json',
       'Accept':'application/json'
     }
   });
}

export const cashout = params => {

   console.log("params " + JSON.stringify(params) )
   console.log("url "  +APIBaseUrl.HOST + APIBaseUrl.Cashout)
   
   return axios.post(APIBaseUrl.HOST + APIBaseUrl.Cashout, JSON.stringify(params),
   {
      'headers': {
        'Content-Type': 'application/json',
        'Accept':'application/json'
      }
    });
 }

export const getEWDetails = (params) => {

  console.log("ew details " + APIBaseUrl.HOST + APIBaseUrl.EWDetails+params)

  return axios.get(APIBaseUrl.HOST + APIBaseUrl.EWDetails+params,
  {
     'headers': {
       'Content-Type': 'application/json',
       'Accept':'application/json'
     }
   });
}

export const AcceptRequest = params => {

  return axios.post(APIBaseUrl.HOST + APIBaseUrl.acceptRequests, JSON.stringify(params),
  {
     'headers': {
       'Content-Type': 'application/json',
       'Accept':'application/json'
     }
   });
}



export const DeleteEvent = params => {

  return axios.post(APIBaseUrl.HOST + APIBaseUrl.deleteEvent, JSON.stringify(params),
  {
     'headers': {
       'Content-Type': 'application/json',
       'Accept':'application/json'
     }
   });
}

export const RequestToJoin = params => {

  return axios.post(APIBaseUrl.HOST + APIBaseUrl.requestToJoin, JSON.stringify(params),
  {
     'headers': {
       'Content-Type': 'application/json',
       'Accept':'application/json'
     }
   });
}

export const CustomerAllJoinedEW = (params) => {

  return axios.get(APIBaseUrl.HOST + APIBaseUrl.getAllCustomerJoinedEvents+params,
  {
     'headers': {
       'Content-Type': 'application/json',
       'Accept':'application/json'
     }
   });
}

export const getArchivedCustomers = (params) => {

  return axios.get(APIBaseUrl.HOST + APIBaseUrl.getArchivedCustomer+params,
  {
     'headers': {
       'Content-Type': 'application/json',
       'Accept':'application/json'
     }
   });
}

export const MerchantAllJoinedEW = (params) => {

  return axios.get(APIBaseUrl.HOST + APIBaseUrl.getAllMerchantJoinedEvents+params,
  {
     'headers': {
       'Content-Type': 'application/json',
       'Accept':'application/json'
     }
   });
}

export const MerchantJoinRequests = (params) => {

  return axios.post(APIBaseUrl.HOST + APIBaseUrl.getJoinRequests, JSON.stringify(params),
  {
     'headers': {
       'Content-Type': 'application/json',
       'Accept':'application/json'
     }
   });
}

export const signOut = params => {

  console.log("SignOut" +  JSON.stringify(params))
  
  return axios.post(APIBaseUrl.HOST + APIBaseUrl.signout, JSON.stringify(params),
  {
     'headers': {
       'Content-Type': 'application/json',
       'Accept':'application/json'
     }
   });
}
 
export const checkDevice = params => {

  console.log("checkDevice" +  JSON.stringify(params))
  
  return axios.post(APIBaseUrl.HOST + APIBaseUrl.checkDevice, JSON.stringify(params),
  {
     'headers': {
       'Content-Type': 'application/json',
       'Accept':'application/json'
     }
   });
}

export const Changename = params => {

  return axios.post(APIBaseUrl.HOST + APIBaseUrl.changeName, JSON.stringify(params),
  {
     'headers': {
       'Content-Type': 'application/json',
       'Accept':'application/json'
     }
   });
}

export const sendFcmToken = params => {
  
  console.log("fcmm paramsss "+JSON.stringify(params) )
  return axios.post(APIBaseUrl.HOST + APIBaseUrl.FcmToken, params,
  {
     'headers': {
       'Content-Type': 'application/json',
       'Accept':'application/json'
     }
   });
}