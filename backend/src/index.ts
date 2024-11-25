import express from 'express';
import cors from 'cors';
import { Local } from './environment/env';
import sequelize from './config/db';
import userRouter from './routers/userRouter';
import {createServer} from 'http';
import {Server} from 'socket.io'
// import sequelize from 'seq';

const app = express();

const httpServer = createServer(app);

export const io = new Server(httpServer,{
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT"],
        credentials: true
        }
})

app.use(cors());
app.use(express.json());
app.use("/", userRouter);
sequelize.sync().then(()=>{
    console.log('Database connected');
    
    httpServer.listen(Local.SERVER_PORT,  () => {
        console.log(`Server is running on port ${Local.SERVER_PORT}`);
        });
}).catch((err)=>{
    console.log("Error: ", err);
})