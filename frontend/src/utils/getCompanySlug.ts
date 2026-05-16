export function getCompanyName() {
  const host = window.location.hostname;

  if (host === "localhost" || host === "127.0.0.1") {
    return "ImobiDigital";
  }

  return host.split(".")[0];
}