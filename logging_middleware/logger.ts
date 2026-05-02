const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJwZzU3ODlAc3JtaXN0LmVkdS5pbiIsImV4cCI6MTc3NzcwMTQzNSwiaWF0IjoxNzc3NzAwNTM1LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiYzBjMTgwZjctM2JjOC00YjMyLTkwNmUtNzdjZTFhMTZhODFmIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoicHJpeWFuc2h1IGd1cHRhIiwic3ViIjoiMzZlOWFlN2EtZWIyYy00Y2U0LWJkMDUtODllN2RjYjE1MjQ5In0sImVtYWlsIjoicGc1Nzg5QHNybWlzdC5lZHUuaW4iLCJuYW1lIjoicHJpeWFuc2h1IGd1cHRhIiwicm9sbE5vIjoicmEyMzExMDAzMDMwMjk0IiwiYWNjZXNzQ29kZSI6IlFrYnB4SCIsImNsaWVudElEIjoiMzZlOWFlN2EtZWIyYy00Y2U0LWJkMDUtODllN2RjYjE1MjQ5IiwiY2xpZW50U2VjcmV0IjoiWURZU25VSGJnYllGSlJBViJ9.hmBMPajs5bXcdBUlWupCZyyx2FprojgDPT_WIvDODgQ";

type Stack = "backend" | "frontend";
type Level = "debug" | "info" | "warn" | "error" | "fatal";
type Package =
    | "cache" | "controller" | "cron_job" | "db" | "domain"
    | "handler" | "repository" | "route" | "service"
    | "api" | "component" | "hook" | "page" | "state" | "style"
    | "auth" | "config" | "middleware" | "utils";

async function Log(stack: Stack, level: Level, pkg: Package, message: string) {
    try {
        const response = await fetch("http://20.207.122.201/evaluation-service/logs", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${AUTH_TOKEN}`
            },
            body: JSON.stringify({
                stack: stack,
                level: level,
                package: pkg,
                message: message
            })
        });
        const data = await response.json();
        console.log("Log sent:", data);
        return data;
    } catch (error) {
        console.error("Failed to send log:", error);
    }
}

export { Log };

