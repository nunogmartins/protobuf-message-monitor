# Protobuf Message Monitor

This project displays Protocol Buffer messages on an Internet Browser received from a TCP socket.
By default, the nodejs receives the messages at port 4000 using TCP sockets. Then they are displayed, in the browser, at port 3700.
At the browser all messages arrive closed, but a simple mouse click will opens them for a better visualization experience.


## Project dependencies

This project depends on [socket.io](https://npmjs.org/package/socket.io), [Protobufjs](https://npmjs.org/package/protobufjs), [express](https://npmjs.org/package/express), [jade](https://npmjs.org/package/jade).
Moreover, the CSS to display message comes from [Bootstrap framework](http://getbootstrap.com/).

All dependencies are met using the npm tool.

## NPM Repository

Protobuf Message Monitor nodejs module and all its dependecies can be installed using npm tool.
Use:
`$ npm install protobuf-message-monitor `


## Copyright (C) 2013 Caixa Mágica Software

Author:
	Nuno Martins <nuno.martins@caixamagica.pt>

## License
GNU LESSER GENERAL PUBLIC LICENSE
                       Version 3, 29 June 2007

 Copyright (C) 2007 Free Software Foundation, Inc. <http://fsf.org/>
 Everyone is permitted to copy and distribute verbatim copies
 of this license document, but changing it is not allowed.

 Full text can be view at:
 http://opensource.org/licenses/lgpl-3.0.html