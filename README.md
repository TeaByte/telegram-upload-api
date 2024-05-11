# Telegram Upload API

**Effortlessly upload and fetch files to Telegram 🚀**

- Made using [deno](https://deno.land/), [hono](https://hono.dev/) and [mtkruto](https://mtkruto.deno.dev/).

---

1. **Clone The Repository**

   ```sh
   git clone https://github.com/TeaByte/telegram-upload-api
   cd telegram-upload-api
   ```

2. **Edit The config.json File**

   In the `config.json` file, update the following fields with your Telegram credentials and bot information:

   ```json
   {
     "apiId": "your_api_id",
     "apiHash": "your_api_hash",
     "chatId": -1002036530000,
     "botToken": "your_bot_token",
     "serverPort": 8080
   }
   ```

   - Replace `your_api_id` and `your_api_hash` with your Telegram credentials from https://my.telegram.org/auth.
   - Obtain a bot token from [@BotFather](https://t.me/BotFather) and replace `your_bot_token`.
   - `chatId` is the ID of a Telegram group where files will be saved ( You can get it from [@WhatChatIDBot](https://t.me/WhatChatIDBot) ).

3. **Start The Server**

   ```sh
   deno task start
   ```

4. **Test The Server Endpoints**

   ```sh
   deno task test
   ```

---

## APIs and Usage

The Telegram Upload API provides the following endpoints:

### 1. Upload Endpoint

- **Endpoint**: `/upload`
- **Method**: `POST`
- **Parameters**:
  - `file`: The file to be uploaded (multipart form data)

#### Example

```sh
curl -X POST -F "file=@/path/to/file.txt" http://localhost:8080/upload
```

#### Response

```json
{
  "message": "File uploaded successfully",
  "fileId": "the_file_id",
  "file": {
    "size": 12345,
    "name": "file.txt"
  }
}
```

### 2. Fetch Endpoint

- **Endpoint**: `/fetch`
- **Method**: `GET`
- **Parameters**:
  - `fileId`: The unique identifier for the file record
  - `mainFileName` (Optional): The name to use when downloading the file

#### Example

```sh
curl http://localhost:8080/fetch?fileId=your_file_id
```

#### Response

```
The file content is streamed back as a download.
```
