import { assertEquals } from "https://deno.land/std@0.218.0/assert/mod.ts";
import axiod from "https://deno.land/x/axiod@0.26.0/mod.ts";
import config from "./utils/config.ts";

const port = config["serverPort"];

Deno.test("Upload Test", async () => {
  const formData = new FormData();
  formData.append("file", new File(["Hello, World!"], "test.txt"));
  const uploadResponse = await axiod.post(
    `http://localhost:${port}/upload`,
    formData
  );

  const result = await uploadResponse.data;

  assertEquals(result["message"], "File uploaded successfully");
  assertEquals(uploadResponse.status, 200);
  console.log("Upload Response: ", result);

  const fetchResponse = await axiod.get(
    `http://localhost:${port}/fetch?fileId=${result["fileId"]}`
  );

  assertEquals(fetchResponse.data, "Hello, World!");
  assertEquals(fetchResponse.status, 200);
  console.log(fetchResponse.data);
});

Deno.test("Fetch Non-Existent File Test", async () => {
  await axiod
    .get(`http://localhost:${port}/fetch?fileId=blablabla&mainFileName=x.txt`)
    .catch((e) => {
      assertEquals(e.response.data["message"], "Failed to download the file");
      assertEquals(e.response.status, 400);
      console.log(e.response.data);
    });
});

Deno.test("Upload Empty File Test", async () => {
  const formData = new FormData();
  formData.append("file", new File([""], "test.txt"));
  await axiod.post(`http://localhost:${port}/upload`, formData).catch((e) => {
    assertEquals(e.response.data["message"], "File size is too large or empty");
    assertEquals(e.response.status, 400);
    console.log(e.response.data);
  });
});
