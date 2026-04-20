import { createServer } from "node:http";
import "dotenv"


const startServer = () => {
    const server = createServer()
    const PORT = process.env.PORT

    server.listen(PORT, () => {
        console.log("server running......")
    })
}

startServer()