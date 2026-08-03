import http.server
import socketserver
import urllib.request
import urllib.error
import urllib.parse
import json
import ssl
import socket
import datetime
import traceback
import sys
import os

PORT = 8000

class AutomatedTestingHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Allow CORS for easy testing
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200, "OK")
        self.end_headers()

    def do_GET(self):
        parsed_url = urllib.parse.urlparse(self.path)
        if parsed_url.path == '/api/dast':
            self.handle_dast(parsed_url)
        else:
            # Serve static files normally
            super().do_GET()

    def do_POST(self):
        parsed_url = urllib.parse.urlparse(self.path)
        if parsed_url.path == '/api/proxy':
            self.handle_proxy()
        else:
            self.send_error(404, "Not Found")

    def handle_dast(self, parsed_path):
        query_params = urllib.parse.parse_qs(parsed_path.query)
        target_url = query_params.get('url', [None])[0]

        if not target_url:
            self.send_json_response(400, {"error": "Missing 'url' parameter"})
            return

        print(f"[DAST] Auditing website security for: {target_url}")
        
        try:
            # Parse URL
            parsed_target = urllib.parse.urlparse(target_url)
            if not parsed_target.scheme or parsed_target.scheme not in ['http', 'https']:
                self.send_json_response(400, {"error": "Invalid URL scheme. Must be http or https"})
                return

            domain = parsed_target.hostname
            
            # Setup analysis dictionary
            report = {
                "url": target_url,
                "domain": domain,
                "scheme": parsed_target.scheme,
                "timestamp": datetime.datetime.utcnow().isoformat() + "Z",
                "headers_audit": {},
                "ssl_audit": {"supported": False, "details": None},
                "sensitive_paths": [],
                "summary": {"score": 100, "vulnerabilities": 0, "grade": "A"}
            }

            # 1. Fetch Headers
            req = urllib.request.Request(
                target_url, 
                headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AntigravityDAST/1.0'}
            )
            
            response_headers = {}
            status_code = 200
            try:
                with urllib.request.urlopen(req, timeout=5) as conn:
                    status_code = conn.getcode()
                    # Convert headers to a case-insensitive-like dictionary
                    for key, val in conn.getheaders():
                        response_headers[key.lower()] = val
            except urllib.error.HTTPError as e:
                status_code = e.code
                for key, val in e.headers.items():
                    response_headers[key.lower()] = val
            except Exception as e:
                # Target is offline or unreachable
                self.send_json_response(200, {
                    "offline": True,
                    "error": f"Failed to connect to target: {str(e)}"
                })
                return

            # Audit Security Headers
            security_headers = {
                "content-security-policy": {
                    "name": "Content Security Policy (CSP)",
                    "expected": "present",
                    "description": "Prevents Cross-Site Scripting (XSS) and code injection attacks.",
                    "impact": "High"
                },
                "strict-transport-security": {
                    "name": "Strict Transport Security (HSTS)",
                    "expected": "present",
                    "description": "Forces browsers to use secure HTTPS connections only.",
                    "impact": "High"
                },
                "x-frame-options": {
                    "name": "X-Frame-Options",
                    "expected": "present",
                    "description": "Prevents Clickjacking attacks by controlling iframe embeds.",
                    "impact": "Medium"
                },
                "x-content-type-options": {
                    "name": "X-Content-Type-Options",
                    "expected": "nosniff",
                    "description": "Prevents MIME-type sniffing vulnerabilities.",
                    "impact": "Medium"
                },
                "referrer-policy": {
                    "name": "Referrer Policy",
                    "expected": "present",
                    "description": "Controls how much referrer information is shared in links.",
                    "impact": "Low"
                },
                "permissions-policy": {
                    "name": "Permissions Policy",
                    "expected": "present",
                    "description": "Restricts browser feature usage (camera, location) in frame.",
                    "impact": "Low"
                }
            }

            vulnerabilities_count = 0
            score_deduction = 0

            for h_key, h_meta in security_headers.items():
                val = response_headers.get(h_key)
                passed = False
                status_text = "Missing"
                severity = "medium"

                if val:
                    passed = True
                    status_text = val
                    if h_key == "strict-transport-security" and parsed_target.scheme != 'https':
                        passed = False
                        status_text = "HSTS defined on HTTP connection (ineffective)"
                        severity = "medium"
                else:
                    severity = "high" if h_meta["impact"] == "High" else ("medium" if h_meta["impact"] == "Medium" else "low")
                    vulnerabilities_count += 1
                    if severity == "high":
                        score_deduction += 20
                    elif severity == "medium":
                        score_deduction += 10
                    else:
                        score_deduction += 5

                report["headers_audit"][h_meta["name"]] = {
                    "header": h_key,
                    "status": "PASS" if passed else "FAIL",
                    "value": status_text,
                    "severity": severity if not passed else "info",
                    "description": h_meta["description"]
                }

            # 2. SSL/TLS Audit
            if parsed_target.scheme == 'https':
                try:
                    ssl_context = ssl.create_default_context()
                    # Force host name verification
                    ssl_context.check_hostname = True
                    
                    with socket.create_connection((domain, 443), timeout=4) as sock:
                        with ssl_context.wrap_socket(sock, server_hostname=domain) as ssock:
                            cert = ssock.getpeercert()
                            
                            issuer = {}
                            for item in cert.get('issuer', []):
                                for sub_item in item:
                                    issuer[sub_item[0]] = sub_item[1]
                                    
                            subject = {}
                            for item in cert.get('subject', []):
                                for sub_item in item:
                                    subject[sub_item[0]] = sub_item[1]

                            not_after_str = cert.get('notAfter')
                            not_after_date = None
                            days_remaining = 0
                            is_expired = True

                            if not_after_str:
                                # format: 'May 10 23:59:59 2026 GMT'
                                try:
                                    # Try parsing timezone GMT
                                    not_after_date = datetime.datetime.strptime(not_after_str, '%b %d %H:%M:%S %Y %Z')
                                except:
                                    # Fallback
                                    not_after_date = datetime.datetime.strptime(not_after_str.split(' GMT')[0], '%b %d %H:%M:%S %Y')
                                
                                days_remaining = (not_after_date - datetime.datetime.utcnow()).days
                                is_expired = days_remaining <= 0

                            report["ssl_audit"] = {
                                "supported": True,
                                "status": "PASS" if not is_expired else "FAIL",
                                "details": {
                                    "issuer": issuer.get('commonName', 'Unknown'),
                                    "organization": issuer.get('organizationName', 'Unknown'),
                                    "subject": subject.get('commonName', domain),
                                    "expiration": not_after_str,
                                    "days_left": days_remaining,
                                    "expired": is_expired,
                                    "cipher": ssock.cipher()
                                }
                            }
                            
                            if is_expired:
                                vulnerabilities_count += 1
                                score_deduction += 30
                except Exception as ssl_err:
                    report["ssl_audit"] = {
                        "supported": False,
                        "status": "FAIL",
                        "error": str(ssl_err),
                        "details": "Could not verify SSL certificate details or establish secure TLS handshake."
                    }
                    vulnerabilities_count += 1
                    score_deduction += 25
            else:
                report["ssl_audit"] = {
                    "supported": False,
                    "status": "FAIL",
                    "details": "Website is running on HTTP. SSL is not enabled."
                }
                vulnerabilities_count += 1
                score_deduction += 30

            # 3. Sensitive Paths Audit
            paths_to_test = [
                ("/.git/config", "Git repository config leakage file", "High"),
                ("/.env", "Environment configuration file", "Critical"),
                ("/package.json", "Node.js configuration metadata file", "Medium"),
                ("/robots.txt", "Search engine indexing controls file", "Info")
            ]

            for path, desc, severity in paths_to_test:
                test_url = f"{parsed_target.scheme}://{domain}{path}"
                try:
                    p_req = urllib.request.Request(
                        test_url, 
                        headers={'User-Agent': 'Mozilla/5.0 AntigravityDAST/1.0'},
                        method='HEAD'
                    )
                    with urllib.request.urlopen(p_req, timeout=3) as p_conn:
                        p_status = p_conn.getcode()
                        if p_status == 200:
                            exposed = True
                            # Verify it's not a catch-all redirect to index
                            # (some servers redirect everything to home with 200 status)
                            content_len = p_conn.getheader('Content-Length')
                            if content_len and int(content_len) == 0:
                                exposed = False
                        else:
                            exposed = False
                except urllib.error.HTTPError as e:
                    # If 401 or 403, it's blocked, which is good. If 404, it doesn't exist.
                    exposed = False
                except Exception:
                    exposed = False

                if exposed:
                    report["sensitive_paths"].append({
                        "path": path,
                        "description": desc,
                        "severity": severity,
                        "status": "EXPOSED"
                    })
                    if severity == "Critical":
                        score_deduction += 25
                        vulnerabilities_count += 1
                    elif severity == "High":
                        score_deduction += 15
                        vulnerabilities_count += 1
                    elif severity == "Medium":
                        score_deduction += 10
                        vulnerabilities_count += 1
                else:
                    report["sensitive_paths"].append({
                        "path": path,
                        "description": desc,
                        "severity": "info",
                        "status": "SECURE"
                    })

            # Calculate Final Score and Grade
            final_score = max(0, 100 - score_deduction)
            report["summary"]["score"] = final_score
            report["summary"]["vulnerabilities"] = vulnerabilities_count
            
            if final_score >= 90:
                report["summary"]["grade"] = "A"
            elif final_score >= 80:
                report["summary"]["grade"] = "B"
            elif final_score >= 70:
                report["summary"]["grade"] = "C"
            elif final_score >= 50:
                report["summary"]["grade"] = "D"
            else:
                report["summary"]["grade"] = "F"

            self.send_json_response(200, report)

        except Exception as e:
            traceback.print_exc()
            self.send_json_response(500, {"error": "Internal DAST scanner error", "details": str(e)})

    def handle_proxy(self):
        try:
            # Read JSON request body
            content_length = int(self.headers.get('Content-Length', 0))
            if content_length == 0:
                self.send_json_response(400, {"error": "Missing POST body"})
                return

            body_data = self.rfile.read(content_length).decode('utf-8')
            params = json.loads(body_data)

            target_url = params.get('url')
            method = params.get('method', 'GET').upper()
            req_headers = params.get('headers', {})
            req_body = params.get('body', '')

            if not target_url:
                self.send_json_response(400, {"error": "Missing 'url' in proxy payload"})
                return

            print(f"[Proxy] Relaying {method} request to: {target_url}")

            # Prepare Request
            data_bytes = None
            if req_body and method in ['POST', 'PUT', 'PATCH', 'DELETE']:
                if isinstance(req_body, dict) or isinstance(req_body, list):
                    data_bytes = json.dumps(req_body).encode('utf-8')
                    if 'Content-Type' not in req_headers:
                        req_headers['Content-Type'] = 'application/json'
                else:
                    data_bytes = str(req_body).encode('utf-8')

            # Ensure we have User-Agent
            if 'User-Agent' not in req_headers:
                req_headers['User-Agent'] = 'Mozilla/5.0 AntigravityAPIClient/1.0'

            req = urllib.request.Request(
                target_url,
                data=data_bytes,
                headers=req_headers,
                method=method
            )

            response_payload = {
                "status": 0,
                "statusText": "",
                "headers": {},
                "body": "",
                "timeMs": 0
            }

            start_time = datetime.datetime.now()
            
            try:
                # Bypass SSL validation if testing internal services
                ctx = ssl.create_default_context()
                ctx.check_hostname = False
                ctx.verify_mode = ssl.CERT_NONE
                
                with urllib.request.urlopen(req, context=ctx, timeout=8) as conn:
                    end_time = datetime.datetime.now()
                    latency = int((end_time - start_time).total_seconds() * 1000)
                    
                    response_payload["status"] = conn.getcode()
                    response_payload["statusText"] = "OK"
                    response_payload["timeMs"] = latency
                    
                    # Convert headers
                    for key, val in conn.getheaders():
                        response_payload["headers"][key] = val
                    
                    # Read body
                    resp_bytes = conn.read()
                    try:
                        response_payload["body"] = resp_bytes.decode('utf-8')
                    except UnicodeDecodeError:
                        response_payload["body"] = "[Binary Content or Unparseable Encoding]"
                        
            except urllib.error.HTTPError as he:
                end_time = datetime.datetime.now()
                latency = int((end_time - start_time).total_seconds() * 1000)
                
                response_payload["status"] = he.code
                response_payload["statusText"] = he.reason
                response_payload["timeMs"] = latency
                for key, val in he.headers.items():
                    response_payload["headers"][key] = val
                
                try:
                    response_payload["body"] = he.read().decode('utf-8')
                except Exception:
                    response_payload["body"] = "Failed to decode response body"
            except Exception as conn_err:
                end_time = datetime.datetime.now()
                latency = int((end_time - start_time).total_seconds() * 1000)
                
                response_payload["status"] = 500
                response_payload["statusText"] = "Connection Failed"
                response_payload["timeMs"] = latency
                response_payload["body"] = f"Proxy error establishing connection: {str(conn_err)}"

            self.send_json_response(200, response_payload)

        except Exception as e:
            traceback.print_exc()
            self.send_json_response(500, {"error": "Proxy service exception", "details": str(e)})

    def send_json_response(self, status, payload):
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(payload).encode('utf-8'))


if __name__ == '__main__':
    # Ensure current working dir matches script location
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    # Check port availability, iterate if in use
    port = PORT
    server_started = False
    while not server_started and port < PORT + 10:
        try:
            with socketserver.TCPServer(("", port), AutomatedTestingHandler) as httpd:
                print(f"============================================================")
                print(f"   ANTIGRAVITY AUTOMATED TESTING PLATFORM RUNNING           ")
                print(f"   Local Server: http://localhost:{port}                    ")
                print(f"============================================================")
                server_started = True
                httpd.serve_forever()
        except OSError as e:
            if e.errno == 98 or e.errno == 10048: # Address already in use
                print(f"Port {port} in use, trying {port+1}...")
                port += 1
            else:
                raise e
