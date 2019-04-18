import http.server
import socketserver

handler = http.server.SimpleHTTPRequestHandler

httpd = socketserver.TCPServer(("", 80), handler)

httpd.serve_forever()