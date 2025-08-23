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
};*/
// FE/netlify/functions/api-proxy.js
const EB = "http://wewha.ap-northeast-2.elasticbeanstalk.com"; // 백엔드 Origin

exports.handler = async (event) => {
  try {
    // 1) 프록시 경로 → 실제 백엔드 경로 계산
    const fnPrefix = "/.netlify/functions/api-proxy";
    let splatPath = event.path.startsWith(fnPrefix)
      ? event.path.slice(fnPrefix.length) // "/api/..." 혹은 "/..." 형태
      : event.path;

    // /api/* 로 리다이렉트되고 :splat 만 들어오기 때문에
    // 백엔드가 /api로 시작한다면 아래처럼 접두사 보정
    if (!splatPath.startsWith("/api")) {
      splatPath = "/api" + (splatPath.startsWith("/") ? "" : "/") + splatPath;
    }

    const qs = event.rawQuery ? `?${event.rawQuery}` : "";
    const targetUrl = `${EB}${splatPath}${qs}`;

    // 2) 전달할 요청 헤더 구성(안전 필터)
    const h = event.headers || {};
    const fwdHeaders = {
      // 필요한 것만 선별 전달
      "content-type": h["content-type"] || "application/json",
      "accept": h["accept"] || "application/json",
    };

    // 인증/쿠키 사용 시 유지
    if (h["authorization"]) fwdHeaders["authorization"] = h["authorization"];
    if (h["cookie"])        fwdHeaders["cookie"]        = h["cookie"];

    // ❌ CORS 트리거 되는 헤더는 제거 (중요)
    // origin, referer, host, x-forwarded-* 등은 보내지 않음

    // 3) 바디 전달 (GET/HEAD 제외)
    const hasBody = !["GET","HEAD"].includes(event.httpMethod);
    const init = {
      method: event.httpMethod,
      headers: fwdHeaders,
      body: hasBody ? event.body : undefined,
    };

    const resp = await fetch(targetUrl, init);

    // 4) 응답 헤더 전달
    // 기본 헤더
    const outHeaders = {};
    resp.headers.forEach((v, k) => {
      // 보안상 위험할 수 있는 hop-by-hop 헤더는 제외
      if (!["transfer-encoding", "connection"].includes(k.toLowerCase())) {
        outHeaders[k] = v;
      }
    });
    const text = await resp.text();
    return {
      statusCode: resp.status,
      headers: outHeaders,
      body: text,
    };
  } catch (e) {
    return {
      statusCode: 502,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ message: "proxy_failed", error: String(e) }),
    };
  }
};
