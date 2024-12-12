"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setSocket = exports.io = void 0;
const socket_io_1 = require("socket.io");
const event_1 = require("./event");
const setSocket = (httpServer) => {
    exports.io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST", "PUT"],
            credentials: true
        }
    });
    exports.io.on('connection', (socket) => {
        console.log('Client connected');
        socket.on('joinchat', (data) => __awaiter(void 0, void 0, void 0, function* () {
            (0, event_1.joinRoom)(socket, data);
        }));
        socket.on('send_message', (message) => __awaiter(void 0, void 0, void 0, function* () {
            (0, event_1.sendMessage)(socket, message);
        }));
        socket.on('joinNotifRoom', (user) => __awaiter(void 0, void 0, void 0, function* () {
            (0, event_1.joinNotificationRoom)(socket, user);
        }));
        socket.on('sendNotification', (patient) => __awaiter(void 0, void 0, void 0, function* () {
            (0, event_1.Notificationsocket)(socket, patient);
        }));
        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });
};
exports.setSocket = setSocket;
