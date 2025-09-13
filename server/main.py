from fastapi import FastAPI

app = FastAPI()


@app.get("/")
def test_get():
    return {"msg" : "hello world"}