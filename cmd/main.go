package main

import (
    "fmt"
    "net/http"
    "html/template"
)

type content struct  {
    content string
} 

func connection(w http.ResponseWriter,  r *http.Request) {
    if r.Method == http.MethodGet {
		// Hardcoded HTML content
		html := `
		<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>Simple HTML</title>
		</head>
		<body>
			<h1>Welcome to My Simple Go Server</h1>
			<p>This is a hardcoded HTML response!</p>
		</body>
		</html>
		`

		// Write the HTML to the response
		w.Header().Set("Content-Type", "text/html")
		fmt.Fprint(w, html)
	} else {
		// Handle other methods
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
} 

func main() {
    http.HandleFunc("/", connection)

    if err := http.ListenAndServe("localhost:6565", nil); err != nil {
        fmt.Println("[ERROR] Server can't be started")
    }
}
