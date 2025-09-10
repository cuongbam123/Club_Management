const API = process.env.REACT_APP_API_URL || "http://localhost:3001/api";
export const API_HOST = API.replace(/\/api$/, ""); // http://localhost:3001

export function makeFullUrl(pathOrUrl) {
  if (!pathOrUrl) return null;

  // đã là absolute
  if (/^https?:\/\//.test(pathOrUrl)) return pathOrUrl;

  // /api/uploads/xxx.jpg
  if (pathOrUrl.startsWith("/api/")) return `${API_HOST}${pathOrUrl}`;

  // /uploads/xxx.jpg  -> convert sang /api/uploads
  if (pathOrUrl.startsWith("/uploads/")) return `${API_HOST}/api${pathOrUrl}`;

  // /... khác
  if (pathOrUrl.startsWith("/")) return `${API_HOST}${pathOrUrl}`;

  // chỉ có tên file
  return `${API_HOST}/api/uploads/${pathOrUrl}`;
}
