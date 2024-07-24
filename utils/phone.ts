import coolsms from 'coolsms-node-sdk';

export async function sendTokenToSMS(phoneNumber, verifyCode) {
    const SMS_KEY = process.env.SMS_KEY;
    const SMS_SECRET = process.env.SMS_SECRET;
    const SMS_SENDER = process.env.SMS_SENDER;

    const messageService = new coolsms(SMS_KEY, SMS_SECRET);

    await messageService.sendOne({
        to: phoneNumber,
        from: SMS_SENDER,
        text: `[고구마켓] 인증번호 요청하신 [${verifyCode}] *타인에게 절대 알리지 마세요. (계정 도용 위험)`,
        autoTypeDetect: true,
    });
}
