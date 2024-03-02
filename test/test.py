import requests


def upload():
    r = requests.post("http://localhost:8000/upload",
                      files={"file": open("deno.json", "rb")})

    print(r.text)


def get():
    r = requests.post("http://localhost:8000/get", json={
        "recordId": "clta660bb0000s0ug07zqm5nq"})

    print(r.text)
    print(r.status_code)
    print(r.headers)


if __name__ == "__main__":
    get()
