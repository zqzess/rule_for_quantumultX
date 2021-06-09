const read = $persistentStore.read("APP_BJ");
$done({ matched: Boolean(read) });