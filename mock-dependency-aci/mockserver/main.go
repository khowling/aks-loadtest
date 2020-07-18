package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"strconv"
	"time"

	"github.com/buaazp/fasthttprouter"
	"github.com/valyala/fasthttp"
)

var searchMock []byte
var mock_delay int

func MockDelay(ctx *fasthttp.RequestCtx) {
	//fmt.Println("mocked!")
	ctx.Response.Header.Set("Content-Type", "application/json")
	time.Sleep(time.Duration(mock_delay) * time.Millisecond)
	ctx.Write(searchMock)
}

func Mock(ctx *fasthttp.RequestCtx) {
	//fmt.Println("mocked!")
	ctx.Response.Header.Set("Content-Type", "application/json")
	ctx.Write(searchMock)
}

func main() {

	m, e := ioutil.ReadFile("./response.json")
	if e != nil {
		fmt.Printf("Error reading mock file: %v\n", e)
		os.Exit(1)
	}
	searchMock = m

	i, err := strconv.Atoi(os.Getenv("MOCK_DELAY"))
	if err != nil {
		fmt.Println("error converting ", os.Getenv("MOCK_DELAY"), err)
		mock_delay = 0
	} else {
		mock_delay = i
	}

	fmt.Println("starting on port 8080 with ", mock_delay, " delay")

	router := fasthttprouter.New()
	router.POST("/", MockDelay)
	router.GET("/", Mock)
	router.GET("/customagent", MockDelay)

	log.Fatal(fasthttp.ListenAndServe(":8080", router.Handler))

}
