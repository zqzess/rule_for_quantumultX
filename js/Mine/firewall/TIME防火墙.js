let block = { matched: false };
const readTimer = $persistentStore.read("WiFi_Timer");
if (readTimer) {
  const currentTime = Date.now();
  const markTime = parseInt(readTimer);
  if (currentTime - markTime <= 15000) {
    block.matched = true;
  } else {
    const delTime = $persistentStore.write("", "WiFi_Timer");
  }
}
$done(block);