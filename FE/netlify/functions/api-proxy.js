// CommonJS 핸들러(중요) 
/*
const EB = "http://wewha.ap-northeast-2.elasticbeanstalk.com"; // 지금은 http

exports.handler = async (event) => {
  try {
    // "/.netlify/functions/api-proxy/..." 접두어 제거
    const prefix = "/.netlify/functions/api-proxy";
    const splat = event.path.startsWith(prefix)
      ? event.path.slice(prefix.length) // 예: "/auth/login"
      : event.path;

    // EB가 /api 프리픽스 사용 → /api + splat
    const url = `${EB}/api${splat}${event.rawQuery ? `?${event.rawQuery}` : ""}`;

    const init = {
      method: event.httpMethod,
      headers: {
        "Content-Type": event.headers["content-type"] || "application/json",
        "Authorization": event.headers["authorization"] || "",
      },
      body: ["GET","HEAD"].includes(event.httpMethod) ? undefined : event.body,
    };

    const resp = await fetch(url, init);
    const text = await resp.text();

    return {
      statusCode: resp.status,
      headers: { "Content-Type": resp.headers.get("content-type") || "application/json" },
      body: text,
    };
  } catch (e) {
    return { statusCode: 502, body: JSON.stringify({ message: "Proxy error", error: String(e) }) };
  }
};
*/

// FE/netlify/functions/api-proxy.js
const EB = "http://wewha.ap-northeast-2.elasticbeanstalk.com";

exports.handler = async (event) => {
  try {
    const prefix = "/.netlify/functions/api-proxy";
    const splat = event.path.startsWith(prefix) ? event.path.slice(prefix.length) : event.path;
    const url = `${EB}/api${splat}${event.rawQuery ? `?${event.rawQuery}` : ""}`;

    // 브라우저가 보낸 Origin 우선 사용, 없으면 현재 호스트로 구성
    const ORIGIN = event.headers.origin || `https://${event.headers.host}`;

    const resp = await fetch(url, {
      method: event.httpMethod,
      headers: {
        "Content-Type": event.headers["content-type"] || "application/json",
        "Accept": "application/json",
        "Authorization": event.headers["authorization"] || "",
        "Origin": ORIGIN,              // ★ 중요: 접속 도메인 그대로 전달
        "X-Forwarded-Proto": "https",  // 원본은 https임을 알림
        "Cookie": event.headers["cookie"] || "",
      },
      body: ["GET","HEAD"].includes(event.httpMethod) ? undefined : event.body,
    });

    const text = await resp.text();
    return {
      statusCode: resp.status,
      headers: { "Content-Type": resp.headers.get("content-type") || "application/json" },
      body: text,
    };
  } catch (e) {
    return { statusCode: 502, body: JSON.stringify({ message: "Proxy error", error: String(e) }) };
  }
};
