// CommonJS 핸들러(중요) 
/*
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
    const text = await resp.text();

    const outHeaders = {};
    resp.headers.forEach((v, k) => {
      if (!["transfer-encoding", "connection"].includes(k.toLowerCase())) {
        outHeaders[k] = v;
      }
    });
    outHeaders["x-proxy-target"] = targetUrl;                 // ← 프록시 목적지 표시
    outHeaders["access-control-expose-headers"] =             // ← JS에서 읽고 싶으면 노출
      (outHeaders["access-control-expose-headers"]
        ? outHeaders["access-control-expose-headers"] + ", x-proxy-target"
        : "x-proxy-target");

    return { statusCode: resp.status, headers: outHeaders, body: text };

    // 4) 응답 헤더 전달
    // 기본 헤더
    /*
    const outHeaders = {};
    resp.headers.forEach((v, k) => {
      // 보안상 위험할 수 있는 hop-by-hop 헤더는 제외
      if (!["transfer-encoding", "connection"].includes(k.toLowerCase())) {
        outHeaders[k] = v;
      }
    });
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
};*/
// netlify/functions/api-proxy.js
// ✅ 1) EB URL: 환경변수 우선, 없으면 하드코드 백업
const EB = "http://wewha.ap-northeast-2.elasticbeanstalk.com";

exports.handler = async (event) => {
  let targetUrl = "";
  try {
    // ✅ 2) 프록시 경로 계산
    const fnPrefix = "/.netlify/functions/api-proxy";
    let splatPath = event.path.startsWith(fnPrefix)
      ? event.path.slice(fnPrefix.length) // "/api/..." 또는 "/..."
      : event.path;

    if (!splatPath.startsWith("/api")) {
      splatPath = "/api" + (splatPath.startsWith("/") ? "" : "/") + splatPath;
    }

    const qs = event.rawQuery ? `?${event.rawQuery}` : "";
    targetUrl = `${EB}${splatPath}${qs}`;

    // ✅ 3) 헤더 최소 전달(불필요 CORS 헤더 제거)
    const h = event.headers || {};
    const fwdHeaders = {
      "content-type": h["content-type"] || "application/json",
      "accept": h["accept"] || "application/json",
    };
    if (h["authorization"]) fwdHeaders["authorization"] = h["authorization"];
    if (h["cookie"])        fwdHeaders["cookie"]        = h["cookie"];

    // ✅ 4) 바디 처리 (base64 대응)
    const method = event.httpMethod || "GET";
    const hasBody = !["GET", "HEAD"].includes(method);
    let body = undefined;
    if (hasBody) {
      body = event.isBase64Encoded
        ? Buffer.from(event.body || "", "base64").toString()
        : event.body;
    }

    // 디버그 로그 (Netlify Functions Logs에서 확인)
    console.log("[proxy→]", method, targetUrl);

    // ✅ 5) 백엔드로 전달
    const resp = await fetch(targetUrl, { method, headers: fwdHeaders, body });
    const text = await resp.text();

    // ✅ 6) 응답 헤더 구성 + 디버그 헤더 노출
    const outHeaders = {};
    resp.headers.forEach((v, k) => {
      const key = k.toLowerCase();
      if (!["transfer-encoding", "connection"].includes(key)) outHeaders[k] = v;
    });
    outHeaders["x-proxy-target"] = targetUrl;
    outHeaders["access-control-expose-headers"] =
      (outHeaders["access-control-expose-headers"]
        ? outHeaders["access-control-expose-headers"] + ", x-proxy-target"
        : "x-proxy-target");

    // content-type 기본값 보정
    if (!outHeaders["content-type"]) outHeaders["content-type"] = "application/json";

    return { statusCode: resp.status, headers: outHeaders, body: text };
  } catch (e) {
    console.error("[proxy error]", { targetUrl, error: String(e) });
    return {
      statusCode: 502,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ message: "proxy_failed", targetUrl, error: String(e) }),
    };
  }
};
