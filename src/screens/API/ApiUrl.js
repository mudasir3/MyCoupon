class APIBaseUrl{
    static HOST = "https://koopa.sr7.tech/api/";
    static OTP = "user/auth-otp";
    static REGISTER = "user/register"
    static SETPIN = "user/set/pin"
    static LOGIN = "user/login/pin"
    static BiometricLogin = "user/bio/login"
    static RESENDCODE = "user/regenerate/otp"
    static ForgotPassword  = "forgot/password"
    static NewEW = "eventwallet/create"
    //static GetAllEW = "eventwallet/"
    static GetAllEW ="eventwallet/withuser/"
    static GetAllEwMerchant ="eventwallet/withmerchant/"
    static GetAllEwCreator ="eventwallet/get_creator_events/"
    static LoginMerchant = "merchant/register"
    static JoinEW = "eventwalletcustomer/joinEventWallet"
    static UseEWMerchant = "eventwalletmerchant/joinEventWallet"
    static JoinEWMerchant ="eventwallet/request"
    static UserDetails = "eventwalletcustomer/"
    static MerchantDetails = "eventwalletmerchant/"
    static AllTransactions = "transaction/get_transaction"
    static Transactions = "transaction/create"
    static Cashout = "transaction/cashout"

    static EWDetails ="eventwallet/"
    static ExportData ="user/export/data"

    static acceptRequests ="eventwallet/request_accept"
    static requestToJoin ="eventwallet/request"
    static getAllCustomerJoinedEvents ="eventwalletcustomer/get_all_events/"
    static getAllMerchantJoinedEvents ="eventwalletmerchant/get_all_events/"
    static getJoinRequests="eventwallet/get_requests"
    static deleteEvent = "eventwalletcustomer/archive_delete"

    static getArchivedCustomer ="eventwalletcustomer/get_all_archived_events/"
    static signout ="user/signout"
    static checkDevice ="user/deviceid"
    static changeName ="merchant/update/name"
    static changeName ="merchant/update/name"
    static FcmToken ="user/fcm_token"
    static DeleteMerchant ="eventwallet/delete_merchant_event"
  }
  export default APIBaseUrl;