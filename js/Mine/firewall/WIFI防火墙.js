const network = $network.wifi.ssid;
const currentTime = Date.now();

$httpAPI("GET", "v1/traffic", null, (body) => {
  if (network && (currentTime / 1000) - body.startTime >= 3) {
    const time = JSON.stringify(currentTime);
    const addTime = $persistentStore.write(time, "WiFi_Timer");
    $notification.post('防火墙开始拦截', '', `已从蜂窝网络切换至 ${network}`);
  }
  $done();
})