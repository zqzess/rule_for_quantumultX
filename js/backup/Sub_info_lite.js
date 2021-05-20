/*
By：mieqq（https://github.com/mieqq/mieqq）
Surge配置参考注释，感谢@asukanana,感谢@congcong.

示例↓↓↓ 
----------------------------------------

[Proxy Group]
DlerCloud = select, policy-path=http://sub.info?url=你encode后的订阅链接&due_day=1&alert=1&title=DlerCloud, update-interval=3600

[Script]
机场信息 = type=http-request,pattern=http://sub\.info,script-path=https://raw.githubusercontent.com/TributePaulWalker/Profiles/main/JavaScript/Sub_info_lite.js

----------------------------------------

脚本不用修改，直接配置就好。

先将带有流量信息的节点订阅链接encode，用encode后的链接替换"url="后面的[机场节点链接]

可选参数 &reset_day，后面的数字替换成流量每月重置的日期，如1号就写1，8号就写8。如"&reset_day=8",不加该参数不显示流量重置信息。

可选参数 &expire，机场链接不带expire信息的，可以手动传入expire参数，如"&expire=2022-02-01",注意一定要按照yyyy-MM-dd的格式。

可选参数 &alert，流量用量超过80%、流量重置2天前、流量重置、套餐快到期，这四种情况会发送通知，参数"title=xxx" 可以自定义通知的标题。如"&alert=1&title=AmyInfo",多个机场信息，且需要通知的情况，一定要加 title 参数，不然通知判断会出现问题
----------------------------------------
*/

let now = new Date();
let today = now.getDate();
let month = now.getMonth();
let year = now.getFullYear();
let params = getUrlParams($request.url);
let resetDay = parseInt(params["due_day"] || params["reset_day"]);
let resetLeft = getRmainingDays(resetDay);

(async () => {
  let usage = await getDataUsage(params.url);
  let used = usage.download + usage.upload;
  let total = usage.total;
  let expire = usage.expire || params.expire;
  let localProxy = "=http, localhost, 6152";
  let infoList = [`使用：${bytesToSize(used)} | ${bytesToSize(total)}`];

  if (resetLeft) {
    infoList.push(`重置：剩余${resetLeft}天`);
  }
  if (expire) {
    if (/^[\d]+$/.test(expire)) expire *= 1000;
    infoList.push(`到期：${formatTime(expire)}`);
  }
  sendNotification(used / total, expire, infoList);
  let body = infoList.map((item) => item + localProxy).join("\n");
  $done({ response: { body } });
})();

function getUrlParams(url) {
  return Object.fromEntries(
    url
      .slice(url.indexOf("?") + 1)
      .split("&")
      .map((item) => item.split("="))
      .map(([k, v]) => [k, decodeURIComponent(v)])
  );
}

function getUserInfo(url) {
  let request = { headers: { "User-Agent": "Quantumult X" }, url };
  return new Promise((resolve) =>
    $httpClient.head(request, (err, resp) => {
      if (err) $done();
      resolve(
        resp.headers[
          Object.keys(resp.headers).find(
            (key) => key.toLowerCase() === "subscription-userinfo"
          )
        ]
      );
    })
  );
}

async function getDataUsage(url) {
  let info = await getUserInfo(url);
  if (!info) {
    $notification.post("SubInfo", "", "链接响应头不带有流量信息");
    $done();
  }
  return Object.fromEntries(
    info
      .match(/\w+=\d+/g)
      .map((item) => item.split("="))
      .map(([k, v]) => [k, parseInt(v)])
  );
}

function getRmainingDays(resetDay) {
  if (!resetDay) return 0;
  let daysInMonth = new Date(year, month + 1, 0).getDate();
  if (resetDay > today) daysInMonth = 0;

  return daysInMonth - today + resetDay;
}

function bytesToSize(bytes) {
  if (bytes === 0) return "0B";
  let k = 1024;
  sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  let i = Math.floor(Math.log(bytes) / Math.log(k));
  return (bytes / Math.pow(k, i)).toFixed(2) + " " + sizes[i];
}

function formatTime(time) {
  let dateObj = new Date(time);
  let year = dateObj.getFullYear();
  let month = dateObj.getMonth() + 1;
  let day = dateObj.getDate();
  return year + "年" + month + "月" + day + "日";
}

function sendNotification(usageRate, expire, infoList) {
  if (!params.alert) return;
  let title = params.title || "Sub Info";
  let subtitle = infoList[0];
  let body = infoList.slice(1).join("\n");
  usageRate = usageRate * 100;

  if (resetDay <= today) month += 1;
  let resetTime = new Date(year, month, resetDay);
  //通知计数器，每月重置日重置
  let notifyCounter = JSON.parse($persistentStore.read(title) || "{}");
  if (!notifyCounter[resetTime]) {
    notifyCounter = {
      [resetTime]: { usageRate: 80, resetLeft: 3, expire: 31, resetDay: 1 },
    };
  }

  let count = notifyCounter[resetTime];

  if (usageRate > count.usageRate && resetDay != today) {
    $notification.post(
      `${title} | 剩余流量不足${Math.ceil(100 - usageRate)}%`,
      subtitle,
      body
    );
    while (usageRate > count.usageRate) {
      if (count.usageRate < 95) {
        count.usageRate += 5;
      } else {
        count.usageRate += 4;
      }
    }
  }
  if (resetLeft && resetLeft < count.resetLeft && resetDay != today) {
    $notification.post(
      `${title} | 流量将在${resetLeft}天后重置`,
      subtitle,
      body
    );
    count.resetLeft = resetLeft;
  }
  if (resetDay == today && count.resetDay && usageRate < 5) {
     $notification.post(`${title} | 流量已重置`, subtitle, body);
    count.resetDay = 0;
  }
  if (expire) {
    let diff = (new Date(expire) - now) / (1000 * 3600 * 24);
    if (diff < count.expire) {
      $notification.post(
        `${title} | 套餐剩余时间不足${Math.ceil(diff)}天`,
        subtitle,
        body
      );
      count.expire -= 5;
    }
  }
  $persistentStore.write(JSON.stringify(notifyCounter), title);
}

