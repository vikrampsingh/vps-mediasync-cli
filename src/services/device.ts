import { getDevices, checkAdb } from './adb.js';
import { askSelect } from '../utils/prompt.js';
import { logger } from '../core/logger.js';
import { execSync } from 'child_process';

// -----------------------------
// Get human-readable device name
// -----------------------------
const getDeviceName = (deviceId: string): string => {
  try {
    const model = execSync(
      `adb -s ${deviceId} shell getprop ro.product.model`
    ).toString().trim();

    const brand = execSync(
      `adb -s ${deviceId} shell getprop ro.product.manufacturer`
    ).toString().trim();

    const version = execSync(
      `adb -s ${deviceId} shell getprop ro.build.version.release`
    ).toString().trim();

    const cleanedModel = model.replace(/\r/g, '').trim();
    const cleanedBrand = brand.replace(/\r/g, '').trim();
    const cleanedVersion = version.replace(/\r/g, '').trim();

    // ✅ Full info
    if (cleanedBrand && cleanedModel && cleanedVersion) {
      return `${cleanedBrand} ${cleanedModel} • Android ${cleanedVersion}`;
    }

    // ✅ Partial fallback
    if (cleanedBrand && cleanedModel) {
      return `${cleanedBrand} ${cleanedModel}`;
    }

    if (cleanedModel) {
      return cleanedModel;
    }

    // 🔥 fallback → adb devices -l
    const output = execSync('adb devices -l').toString();

    const line = output
      .split('\n')
      .find(l => l.includes(deviceId));

    if (line) {
      const match = line.match(/model:(\S+)/);
      if (match) {
        return match[1];
      }
    }

    return deviceId;

  } catch {
    return deviceId;
  }
};

// -----------------------------
// Select Device
// -----------------------------
export const selectDevice = async (): Promise<string | null> => {

  logger.step('Checking ADB...');

  if (!checkAdb()) {
    logger.error('ADB not found');

    console.log(`
👉 Install ADB using:

   brew install android-platform-tools
    `);

    return null;
  }

  const devices = getDevices();

  if (devices.length === 0) {
    logger.warning('No devices detected');

    console.log(`
📱 To connect your device:

USB:
- Enable Developer Options
- Enable USB Debugging
- Connect via cable

WiFi:
- adb tcpip 5555
- adb connect <device-ip>
    `);

    return null;
  }

  // 🔥 Enrich devices with names
  const enrichedDevices = devices.map((id: string) => ({
    id,
    name: getDeviceName(id),
  }));

  // ✅ Use enrichedDevices in prompt
  const selectedDevice = await askSelect(
    'Select a device:',
    enrichedDevices.map((d) => ({
      name: `${d.name} (${d.id})`,
      value: d.id,
    }))
  );

  if (!selectedDevice) {
    logger.error('No device selected');
    return null;
  }

  logger.success(`Selected device: ${selectedDevice}`);

  return selectedDevice;
};