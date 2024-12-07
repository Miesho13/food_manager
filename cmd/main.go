package main

import (
    "fmt"
    "net/http"
)

func main() {

	http.Handle("/", http.FileServer(http.Dir("./web")))

    println("Server stat: 127.0.0.1:6565")
    if err := http.ListenAndServe("localhost:6565", nil); err != nil {
        fmt.Println("[ERROR] Server can't be started")
    }
}
