interface Config {
  apiId: number;
  apiHash: string;
  chatId: number;
  botToken: string;
  serverPort: number;
}

function validateConfig(config: Config): void {
  if (typeof config.apiId !== "number" || !config.apiId) {
    throw new Error("apiId must be a non-empty integer");
  }

  if (typeof config.apiHash !== "string" || !config.apiHash.trim()) {
    throw new Error("apiHash must be a non-empty string");
  }

  if (typeof config.chatId !== "number" || isNaN(config.chatId)) {
    throw new Error("chatId must be a number");
  }

  if (typeof config.botToken !== "string" || config.botToken.length < 40) {
    throw new Error(
      "botToken must be a string with a correct length of characters"
    );
  }

  if (typeof config.serverPort !== "number" || isNaN(config.serverPort)) {
    throw new Error("serverPort must be a number");
  }
}

const config: Config = JSON.parse(Deno.readTextFileSync("./config.json"));
validateConfig(config);

export default config;
