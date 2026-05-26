// Minimal ZIP builder — stored mode (no compression)
// Returns a Uint8Array containing a valid ZIP file
function buildZip(files) {
  // files: Array of { name: string, data: Uint8Array }
  // Returns: Uint8Array

  const enc = new TextEncoder();
  const localHeaders = [];
  const centralHeaders = [];
  let offset = 0;

  for (const file of files) {
    const nameBytes = enc.encode(file.name);
    const crc = crc32(file.data);
    const size = file.data.length;

    // Local file header
    const local = new Uint8Array(30 + nameBytes.length);
    const lv = new DataView(local.buffer);
    lv.setUint32(0, 0x04034b50, true); // signature
    lv.setUint16(4, 20, true);         // version needed
    lv.setUint16(6, 0, true);          // flags
    lv.setUint16(8, 0, true);          // compression: stored
    lv.setUint16(10, 0, true);         // mod time
    lv.setUint16(12, 0, true);         // mod date
    lv.setUint32(14, crc, true);       // crc32
    lv.setUint32(18, size, true);      // compressed size
    lv.setUint32(22, size, true);      // uncompressed size
    lv.setUint16(26, nameBytes.length, true); // name length
    lv.setUint16(28, 0, true);         // extra length
    local.set(nameBytes, 30);

    localHeaders.push({ local, data: file.data, nameBytes, crc, size, offset });
    offset += local.length + size;

    // Central directory header
    const central = new Uint8Array(46 + nameBytes.length);
    const cv = new DataView(central.buffer);
    cv.setUint32(0, 0x02014b50, true); // signature
    cv.setUint16(4, 20, true);         // version made by
    cv.setUint16(6, 20, true);         // version needed
    cv.setUint16(8, 0, true);          // flags
    cv.setUint16(10, 0, true);         // compression
    cv.setUint16(12, 0, true);         // mod time
    cv.setUint16(14, 0, true);         // mod date
    cv.setUint32(16, crc, true);       // crc32
    cv.setUint32(20, size, true);      // compressed size
    cv.setUint32(24, size, true);      // uncompressed size
    cv.setUint16(28, nameBytes.length, true); // name length
    cv.setUint16(30, 0, true);         // extra length
    cv.setUint16(32, 0, true);         // comment length
    cv.setUint16(34, 0, true);         // disk start
    cv.setUint16(36, 0, true);         // int attrs
    cv.setUint32(38, 0, true);         // ext attrs
    cv.setUint32(42, localHeaders[localHeaders.length-1].offset, true); // local header offset
    central.set(nameBytes, 46);
    centralHeaders.push(central);
  }

  const centralSize = centralHeaders.reduce((s, c) => s + c.length, 0);
  const eocd = new Uint8Array(22);
  const ev = new DataView(eocd.buffer);
  ev.setUint32(0, 0x06054b50, true);  // signature
  ev.setUint16(4, 0, true);           // disk number
  ev.setUint16(6, 0, true);           // start disk
  ev.setUint16(8, files.length, true); // entries on disk
  ev.setUint16(10, files.length, true); // total entries
  ev.setUint32(12, centralSize, true);  // central dir size
  ev.setUint32(16, offset, true);       // central dir offset
  ev.setUint16(20, 0, true);            // comment length

  const totalSize = offset + centralSize + 22;
  const result = new Uint8Array(totalSize);
  let pos = 0;
  for (const lh of localHeaders) {
    result.set(lh.local, pos); pos += lh.local.length;
    result.set(lh.data, pos);  pos += lh.data.length;
  }
  for (const ch of centralHeaders) {
    result.set(ch, pos); pos += ch.length;
  }
  result.set(eocd, pos);
  return result;
}

function crc32(data) {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < data.length; i++) {
    crc ^= data[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xEDB88320 : 0);
    }
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

window.buildZip = buildZip;
