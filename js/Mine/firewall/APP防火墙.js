const data = $intent.parameter;
const write = $persistentStore.write(data, "APP_BJ");
$done();