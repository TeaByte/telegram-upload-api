# Telegram Upload API

**Effortlessly upload and fetch files to Telegram 🚀**

## Made using [deno](https://deno.land/), [hono](https://hono.dev/), [mtkruto](https://mtkruto.deno.dev/) and [denokv](https://deno.land/x/denokv).

1. **Clone The Repository**

   ```sh
   git clone https://github.com/TeaByte/telegram-upload-api
   cd telegram-upload-api
   ```

2. **Setup Localhost DenvKV**

   Use the following Docker command to mounts a local folder into the container to store the database, and it hosts a denoKV Connect endpoint at `http://localhost:4512` with an access of `234xs266623t`.

   ```sh
   docker run -it --init -p 4512:4512 -v ./data:/data ghcr.io/denoland/denokv --sqlite-path /data/denokv.sqlite serve --access-token 234xs266623t
   ```

3. **Edit The config.json File**

   In the config.json file, update the following fields with your Telegram credentials and bot information:

   ```json
   {
     "apiId": "your_api_id",
     "apiHash": "your_api_hash",
     "chatId": -1002036530000,
     "botToken": "your_bot_token",
     "serverPort": 8080,
     "denoKV": "http://localhost:4512/",
     "kvToken": "234xs266623t"
   }
   ```

   - Replace `your_api_id` and `your_api_hash` with your Telegram credentials from https://my.telegram.org/auth.
   - Obtain a bot token from [@BotFather](https://t.me/BotFather) and replace `your_bot_token`.
   - `chatId` is the ID of a Telegram group where files will be saved.

4. **Start The Server**

   ```sh
   deno task start
   ```

5. **Test The Server Endpoints**

   ```sh
   deno task test
   ```

---

Feel free to contribute by opening issues or submitting pull requests.
