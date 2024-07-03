
const exec = require('child_process').execSync
const fs = require('fs')
const rp = require('request-promise')
const download = require('download')

// 京东cookie
const cookie = 'shshshfpa=f8f68320-dd9d-9048-9557-99f1e9a0d060-1691722900; shshshfpx=f8f68320-dd9d-9048-9557-99f1e9a0d060-1691722900; __jdu=1691722900651830460441; pinId=Z8TGPldCQPiRA3Ujm7iq4w; pin=Asurelike; unick=7hk27nk82ep9cc; _tp=jvkhggP1uAphxhaOlv%2BiTQ%3D%3D; _pst=Asurelike; o2State={%22webp%22:true%2C%22avif%22:false%2C%22lastvisit%22:1718160334620}; unpl=JF8EAKFnNSttChsEAB1XGhEYGAlXWwhaTh4CPWUGUV9bSABXEwpOE0N7XlVdWBRKEB9sYhRUXFNKUQ4eAysSEXtdU11UC3sUC2ZlAVVeW05kBRwBEhEgSF1kX20ITB8DaWQGXFxZTFAFEgAaFxdKWFFebQl7FwtoVzVkWl1MUgwSBx8iEXtcZBUzCQYXBGdnA1deUEpVAh8CEhARTlpVW1gIexYzbA; __jdv=76161171|c.duomai.com|t_16282_298350224|jingfen|caa47d029be24dc480c324322ec99d0b|1719194679517; areaId=14; ipLoc-djd=14-1116-0-0; 3AB9D23F7A4B3C9B=TORMRCFYDMOW2227EP2MGRX4WFVPYPHNALEKID5ER6MJNG74WDLNWFYVSCXEFNDD4DP2XCPPMSR6COWVCVWNX3TBOE; TrackID=1GHoMEUqXfjwWf_7FSQt1oFWdo_-QAxWb5Ad5CDkQWWknWeyPis1eTstaUNPG6Hz4c1UHfJkP9v7_0Jix0WnPFcglmzKgBB4AzprgNIuHH5Xu482rf26KYENflKCp1-2T; thor=CF5DE37FCB0B951B448EB8F9756E9A0D9C066B381842FF751A5A18939B18ADB3CB4B71BDFBD0EF7853B2C3192988AB7B8412CD21A3EFCC9F4FA78383DBB5E4C1F361B9F7274AD8B722DA03970725E9A5EB7FB3B89793CF6886903E7D572963A3CB0CFD665631DBA949BAC24EEC441D70723B16D39D97B4A65405DB818E46BD17589A0D2B2A926DCE7FA1BA3C03C47E08; ceshi3.com=201; __jdc=76161171; PCSYCityID=CN_340000_340100_0; flash=2_qg3zaiavzo-aHYA46hoc8IiAYwshwepp3CpRN3htpbkICHKbxOOhgC7-215WqNud4Tgr9qW0xKfk-2CUPL_GyXSeAgQaArvXRdMOqnY3AKn3Btv7Fw9cs9z20nsHOKB6H-ifDe_GtY7ro9w8icG-KeAo2w_OuTBZHrtdZdqpgYN*; __jda=76161171.1691722900651830460441.1691722901.1719974989.1719992066.43; __jdb=76161171.1.1691722900651830460441|43.1719992066; 3AB9D23F7A4B3CSS=jdd03TORMRCFYDMOW2227EP2MGRX4WFVPYPHNALEKID5ER6MJNG74WDLNWFYVSCXEFNDD4DP2XCPPMSR6COWVCVWNX3TBOEAAAAMQO6CCRAIAAAAACAJVVBJBH4KUMYX; _gia_d=1; UseCorpPin=Asurelike; mt_xid=V2_52007VwMVWl1eUVkXSBhbAWcKEFNYX1NfGkkpW1AyUBNRD1tOWUhKSkAAZVYWTg4PW18DT0lcAGBRRlYKD1pdL0oYXwB7AhROXFpDWhtCG1kOZQEiUm1YYlkYSxpVDGALFlpcaFZeHEs%3D; shshshfpb=BApXcS9SMdPVAAC0wL9p-_Cee8IZSZmG6B9MzLi9D9xJ1MnrwuIO2; '
// Server酱SCKEY
const push_key = 'SCT84742TxzCIMl6QAMEJMBHKPUPFl1s3'

// 京东脚本文件
const js_url = 'https://raw.githubusercontent.com/NobyDa/Script/master/JD-DailyBonus/JD_DailyBonus.js'
// 下载脚本路劲
const js_path = './JD_DailyBonus.js'
// 脚本执行输出路劲
const result_path = './result.txt'
// 错误信息输出路劲
const error_path = './error.txt'

Date.prototype.Format = function (fmt) {
  var o = {
    'M+': this.getMonth() + 1,
    'd+': this.getDate(),
    'H+': this.getHours(),
    'm+': this.getMinutes(),
    's+': this.getSeconds(),
    'S+': this.getMilliseconds()
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(String(o[k]).length)));
    }
  }
  return fmt;
};

function setupCookie() {
  var js_content = fs.readFileSync(js_path, 'utf8')
  js_content = js_content.replace(/var Key = ''/, `var Key = '${cookie}'`)
  fs.writeFileSync(js_path, js_content, 'utf8')
}

function sendNotificationIfNeed() {

  if (!push_key) {
    console.log('执行任务结束!'); return;
  }

  if (!fs.existsSync(result_path)) {
    console.log('没有执行结果，任务中断!'); return;
  }

  let text = "京东签到_" + new Date().Format('yyyy.MM.dd');
  let desp = fs.readFileSync(result_path, "utf8")

  // 去除末尾的换行
  let SCKEY = push_key.replace(/[\r\n]/g,"")

  const options ={
    uri:  `https://sc.ftqq.com/${SCKEY}.send`,
    form: { text, desp },
    json: true,
    method: 'POST'
  }

  rp.post(options).then(res=>{
    const code = res['errno'];
    if (code == 0) {
      console.log("通知发送成功，任务结束！")
    }
    else {
      console.log(res);
      console.log("通知发送失败，任务中断！")
      fs.writeFileSync(error_path, JSON.stringify(res), 'utf8')
    }
  }).catch((err)=>{
    console.log("通知发送失败，任务中断！")
    fs.writeFileSync(error_path, err, 'utf8')
  })
}

function main() {

  if (!cookie) {
    console.log('请配置京东cookie!'); return;
  }

  // 1、下载脚本
  download(js_url, './').then(res=>{
    // 2、替换cookie
    setupCookie()
    // 3、执行脚本
    exec(`node '${js_path}' >> '${result_path}'`);
    // 4、发送推送
    sendNotificationIfNeed() 
  }).catch((err)=>{
    console.log('脚本文件下载失败，任务中断！');
    fs.writeFileSync(error_path, err, 'utf8')
  })

}

main()
