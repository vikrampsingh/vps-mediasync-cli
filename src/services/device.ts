import { getDevices, checkAdb } from './adb.js';
import { askSelect } from '../utils/prompt.js';
import { logger } from '../core/logger.js';

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

  // ✅ ALWAYS prompt (even if one device)
  const selectedDevice = await askSelect(
    'Select a device:',
    devices.map((d: string) => ({
      name: d,
      value: d,
    }))
  );

  if (!selectedDevice) {
    logger.error('No device selected');
    return null;
  }

  logger.success(`Selected device: ${selectedDevice}`);

  return selectedDevice;
};