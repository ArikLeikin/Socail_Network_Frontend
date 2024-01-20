import request from "supertest";
import initApp from "../app";
import mongoose from "mongoose";
import { Express } from "express";
import User from "../models/user_model";
 let app: Express;
authUser();

beforeAll(async () => {
  app = await initApp();
  console.log("beforeAll");
  await User.deleteMany();
});

afterAll(async () => {
  await mongoose.connection.close();
});
export async function authUser(){
 
    let accessToken: string;
   
    const user = {
      email: "testUser@test.com",
      password: "1234567890",
    };
    const user2 = {
      email: "testUser@test.com"
    }
    const user3 = {
      email: "test@test.com",
      password: "1234567890"
    }

    
    
     let refreshToken: string;
     let newRefreshToken: string;
    
        describe("Auth tests", () => {
          test("test register", async () => {
            await request(app).post("/auth/register").send(user);  //register user
            const response = await request(app).post("/auth/login").send(user); //user logged in
            expect(response.statusCode).toEqual(200);
            accessToken = response.body.accessToken;
          });
          test("test register for missing email / password", async () => { 
            const response = await request(app).post("/auth/register").send(user2);
            expect(response.statusCode).toEqual(400);
            expect(response.text).toEqual("Missing email or password");
            
          });
          test("test register for existing email", async () => {
            const response = await request(app).post("/auth/register").send(user);
            expect(response.statusCode).toEqual(409);
            expect(response.text).toEqual("Email Already Used");
          });
          test("test register user", async () => {
            await User.deleteMany({ 'email': user3.email });
            const response = await request(app).post("/auth/register").send(user3);  //user 3 register
            expect(response.statusCode).toEqual(201);
          });
          test("test login for missing email / password", async () => {
        
            user3.email = undefined;
            const response2 = await request(app).post("/auth/login").send(user3); //user3 didn't login
            expect(response2.statusCode).toEqual(400);
            expect(response2.text).toEqual("missing email or password");
            user3.email = "test@test.com";
          });
          test("test login for incorrect password", async () => {
            user3.password = "123456789";
            const response = await request(app).post("/auth/login").send(user3);
            expect(response.statusCode).toEqual(401);
            expect(response.text).toEqual("email or password incorrect");
            user3.password = "1234567890";
            
          });
          test("test login for incorrect email", async () => {
            user3.email = "kuku123@gmail.com";
            const response = await request(app).post("/auth/login").send(user3);
            expect(response.statusCode).toEqual(401);
            expect(response.text).toEqual("email or password incorrect");
            user3.email = "test@test.com";
            
          });
          test("test for logout with no token", async () => {
            const response = await request(app).get("/auth/logout");
            expect(response.statusCode).toEqual(401);
          
          });
        
          test("test login for correct email and password", async () => {
            const response = await request(app).post("/auth/login").send(user);  //user logged in
            expect(response.statusCode).toEqual(200);
              accessToken = response.body.accessToken;
          });
          test("test logout", async () => {
            const response = await request(app).get("/auth/logout").set('Authorization',`JWT ${accessToken}`);
            console.log("logout response:");
            console.log(response.text);
            expect(response.statusCode).toEqual(200);
          });
          
        
          test("Test refresh token", async () => {
            const response = await request(app)
              .get("/auth/refresh")
              .set("Authorization", "JWT " + refreshToken)
              .send();
            expect(response.statusCode).toBe(200);
            expect(response.body.accessToken).toBeDefined();
            expect(response.body.refreshToken).toBeDefined();
        
            const newAccessToken = response.body.accessToken;
            newRefreshToken = response.body.refreshToken;
        
            const response2 = await request(app)
              .get("/student")
              .set("Authorization", "JWT " + newAccessToken);
            expect(response2.statusCode).toBe(200);
          });
        
            test("Test double use of refresh token", async () => {
              const response = await request(app)
                .get("/auth/refresh")
                .set("Authorization", "JWT " + refreshToken)
                .send();
              expect(response.statusCode).not.toBe(200);
        
              //verify that the new token is not valid as well
              const response1 = await request(app)
                .get("/auth/refresh")
                .set("Authorization", "JWT " + newRefreshToken)
                .send();
              expect(response1.statusCode).not.toBe(200);
            });
      })
  
}
