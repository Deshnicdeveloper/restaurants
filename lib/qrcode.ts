import QRCode from "qrcode";

export async function qrToDataUrl(value: string) {
  return QRCode.toDataURL(value, {
    width: 1024,
    margin: 2,
    color: {
      dark: "#0E0C0A",
      light: "#F5F0E8"
    }
  });
}
