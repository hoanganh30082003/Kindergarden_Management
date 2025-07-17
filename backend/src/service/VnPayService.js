const moment = require('moment');
const crypto = require('crypto');
const qs = require('qs');
const paymentService = require('../service/PaymentService');
require('dotenv').config();

const createPaymentUrl = async (req) => {
    process.env.TZ = 'Asia/Ho_Chi_Minh';
    const date = new Date();
    const createDate = moment(date).format('YYYYMMDDHHmmss');
    const paymentId = req.body._id;
    const amount = req.body.amount;
    const bankCode = req.body.bankCode;
    const locale = req.body.language || 'vn';
    const tmnCode = process.env.VNP_TMNCODE;
    const secretKey = process.env.VNP_HASHSECRET;
    const vnpUrlBase = process.env.VNP_URL;
    const returnUrl = process.env.VNP_RETURNURL;
    const ipAddr = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress;

    let vnp_Params = {
        vnp_Version: '2.1.0',
        vnp_Command: 'pay',
        vnp_TmnCode: tmnCode,
        vnp_Locale: locale,
        vnp_CurrCode: 'VND',
        vnp_TxnRef: paymentId,
        vnp_OrderInfo: 'Thanh toan cho ma GD:' + paymentId,
        vnp_OrderType: 'other',
        vnp_Amount: amount * 100,
        vnp_ReturnUrl: returnUrl,
        vnp_IpAddr: ipAddr,
        vnp_CreateDate: createDate,
    };

    if (bankCode) {
        vnp_Params['vnp_BankCode'] = bankCode;
    }

    vnp_Params = sortObject(vnp_Params);
    const signData = qs.stringify(vnp_Params, { encode: false });
    const signed = crypto.createHmac('sha512', secretKey)
        .update(Buffer.from(signData, 'utf-8'))
        .digest('hex');

    vnp_Params['vnp_SecureHash'] = signed;

    return `${vnpUrlBase}?${qs.stringify(vnp_Params, { encode: false })}`;
};

const verifyReturnUrl = async (req) => {
    let vnp_Params = req.query;
    const secureHash = vnp_Params['vnp_SecureHash'];
    const paymentId = vnp_Params['vnp_TxnRef'];
    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);
    const responseCode = vnp_Params['vnp_ResponseCode'];
    const transactionStatus = vnp_Params['vnp_TransactionStatus'];
    const secretKey = process.env.VNP_HASHSECRET;
    const signData = qs.stringify(vnp_Params, { encode: false });

    const signed = crypto.createHmac('sha512', secretKey)
        .update(Buffer.from(signData, 'utf-8'))
        .digest('hex');

    console.log('VNPAY Transaction Info:', vnp_Params);    

    if (secureHash === signed && responseCode === '00' && transactionStatus === '00') {
        await paymentService.UpdatePaymentByVnPay(paymentId);
        return { success: true, message: 'Thanh toán thành công', vnp_Params };
    } else {
        return { success: false, message: 'Thanh toán thất bại', vnp_Params };
    }
};

const sortObject = (obj) => {
    let sorted = {};
    let keys = Object.keys(obj).sort();
    for (let key of keys) {
        sorted[key] = encodeURIComponent(obj[key]).replace(/%20/g, '+');
    }
    return sorted;
};

module.exports = {
    createPaymentUrl,
    verifyReturnUrl
}