package main

import (
    "fmt"
    "net/http"
    "time"
)

func loggingMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        fmt.Printf("[%s] %s %s from %s\n", time.Now().Format(time.RFC3339), r.Method, r.URL.Path, r.RemoteAddr)
        next.ServeHTTP(w, r)
    })
}

func main() {
    fs := http.FileServer(http.Dir("./web"))
    http.Handle("/", loggingMiddleware(fs))

    fmt.Println("Server started at: http://127.0.0.1:6565")
    if err := http.ListenAndServe("0.0.0.0:6565", nil); err != nil {
        fmt.Println("[ERROR] Server can't be started:", err)
    }
}
