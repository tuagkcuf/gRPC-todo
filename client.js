import grpc from "grpc";
import protoLoader from "@grpc/proto-loader";

const packageDef = protoLoader.loadSync("todo.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const todoPackage = grpcObject.todoPackage;

const text = process.argv[2];

const client = new todoPackage.Todo(
    "localhost:40000",
    grpc.credentials.createInsecure()
);

client.createTodo({
    "id": -1,
    "text": text
}, (error, response) => {
    console.log("Received form server " + JSON.stringify(response))
})

// client.readTodos(null, (error, response) => {
//     console.log("read todos from the server " + JSON.stringify(response))
//     if (!response.items)
//         response.items.forEach(a => console.log(a.text))
// })

const call = client.readTodosStream()
call.on("data", item => {
    console.log("received item from server: " + JSON.stringify(item))
})

call.on("end", e => console.log("seerver done"))