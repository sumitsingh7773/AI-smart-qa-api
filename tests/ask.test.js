import request from "supertest";
import mongoose from "mongoose";
import app from "../src/app.js";

let server;
let token = "";

beforeAll(async () => {
  server = app.listen(0);
  const email = `test${Date.now()}@test.com`;
  await request(server).post("/api/auth/register").send({
    name: "Test",
    email,
    password: "123456",
  });

  const res = await request(server).post("/api/auth/login").send({
    email,
    password: "123456",
  });

  token = res.body.token;
});

afterAll(async () => {
  await mongoose.connection.close(); 
  server.close(); 
});

describe("Ask API", () => {
  it("should return answer for valid question", async () => {
    const res = await request(server)
      .post("/api/ask")
      .set("Authorization", `Bearer ${token}`)
      .send({ question: "What is refund policy?" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("answer");
    expect(res.body).toHaveProperty("sources");
    expect(res.body).toHaveProperty("confidence");
  });
});