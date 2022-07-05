let params = getParams($argument)

;(async () => {

let traffic = (await httpAPI("/v1/traffic"))
let interface = traffic.interface

/* 获取所有网络界面 */
let allNet = [];
for (var key in interface){
   allNet.push(key)
    }

if(allNet.includes("lo0")==true){
del(allNet,"lo0")
}

let net;
let index;
if( $persistentStore.read("NETWORK")==null||allNet.includes($persistentStore.read("NETWORK"))==false){
	index = 0
	}else{
	net = $persistentStore.read("NETWORK")
	for(let i = 0;i < allNet.length; ++i) {
		if(net==allNet[i]){
		index=i
		}
	}
}

/* 手动执行时切换网络界面 */
if($trigger == "button"){
	if(allNet.length>1) index += 1
	if(index>=allNet.length) index = 0;
	$persistentStore.write(allNet[index],"NETWORK")
};

net = allNet[index]
let network = interface[net]

let outCurrentSpeed = speedTransform(network.outCurrentSpeed) //上传速度
let outMaxSpeed = speedTransform(network.outMaxSpeed) //最大上传速度
let download = bytesToSize(network.in) //下载流量
let upload = bytesToSize(network.out) //上传流量
let inMaxSpeed = speedTransform(network.inMaxSpeed) //最大下载速度
let inCurrentSpeed = speedTransform(network.inCurrentSpeed) //下载速度

/* 判断网络类型 */
let netType;
if(net=="en0") {
	netType = "WiFi"
	}else{
	netType = "Cellular"
	}


  $done({
      title:"流量统计 | "+netType,
      content:`流量 ➟ ${upload} | ${download}\n`+
      `速度 ➟ ${outCurrentSpeed} | ${inCurrentSpeed}\n` +
		`峰值 ➟ ${outMaxSpeed} | ${inMaxSpeed}`,
		icon: params.icon,
		  "icon-color":params.color
    });

})()

function bytesToSize(bytes) {
  if (bytes === 0) return "0B";
  let k = 1024;
  sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  let i = Math.floor(Math.log(bytes) / Math.log(k));
  return (bytes / Math.pow(k, i)).toFixed(2) + " " + sizes[i];
}

function speedTransform(bytes) {
  if (bytes === 0) return "0B/s";
  let k = 1024;
  sizes = ["B/s", "KB/s", "MB/s", "GB/s", "TB/s", "PB/s", "EB/s", "ZB/s", "YB/s"];
  let i = Math.floor(Math.log(bytes) / Math.log(k));
  return (bytes / Math.pow(k, i)).toFixed(2) + " " + sizes[i];
}


function httpAPI(path = "", method = "GET", body = null) {
    return new Promise((resolve) => {
        $httpAPI(method, path, body, (result) => {
			
            resolve(result);
        });
    });
};


function getParams(param) {
  return Object.fromEntries(
    $argument
      .split("&")
      .map((item) => item.split("="))
      .map(([k, v]) => [k, decodeURIComponent(v)])
  );
}

function del(arr,num) {
			var l=arr.length;
		    for (var i = 0; i < l; i++) {
			  	if (arr[0]!==num) { 
			  		arr.push(arr[0]);
			  	}
			  	arr.shift(arr[0]);
		    }
		    return arr;
		}
