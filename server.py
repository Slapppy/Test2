import socket

sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)  # создаем сокет
sock.bind(('', 55000))  # связываем сокет с портом, где он будет ожидать сообщения
sock.listen(10)  # указываем сколько может сокет принимать соединений
print('Server is running, please, press ctrl+c to stop')

server_data = []


while True:
    conn, addr = sock.accept()
    print('connected:', addr)
    data = conn.recv(2048)
    server_data.append(data)
    print(server_data)
    print(str(data))
    conn.send(data.upper())  # в ответ клиенту отправляем сообщение в верхнем регистре
conn.close()  # закрываем соединение



