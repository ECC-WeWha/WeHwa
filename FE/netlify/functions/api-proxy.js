// netlify/functions/api-proxy.js
export default async (event, context) => {
    const EB = "http://wewha.ap-northeast-2.elasticbeanstalk.com"; // EB는 http
    // /api/auth/login -> /auth/login 형태면 필요에 따라 가공
    const downstream = `${EB}${event.path}`; // 지금은 EB도 /api/... 쓰므로 그대로 전달
  
    const init = {
      method: event.httpMethod,
      headers: {
        // 원본 Origin/Host 제거 효과: CORS 영향 최소화
        "Content-Type": event.headers["content-type"] || "application/json",
        "Authorization": event.headers["authorization"] || "",
      },
      body: ["GET", "HEAD"].includes(event.httpMethod) ? undefined : event.body,
    };
  
    const resp = await fetch(downstream, init);
    const text = await resp.text();
  
    return {
      statusCode: resp.status,
      headers: { "Content-Type": resp.headers.get("content-type") || "application/json" },
      body: text,
    };
  };
  