import { assertEquals } from "https://deno.land/std@0.218.0/assert/mod.ts";
import axiod from "https://deno.land/x/axiod@0.26.0/mod.ts";
import config from "./config.ts";

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

  const getResponse = await axiod.post(`http://localhost:${port}/get`, {
    recordId: result["recordId"],
  });

  assertEquals(getResponse.data, "Hello, World!");
  assertEquals(getResponse.status, 200);
  console.log(getResponse.data);
});

Deno.test("Get Non-Existent File Test", async () => {
  await axiod
    .post(`http://localhost:${port}/get`, {
      recordId: "i-don't-exist",
    })
    .catch((e) => {
      assertEquals(e.response.data["message"], "File not found");
      assertEquals(e.response.status, 404);
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