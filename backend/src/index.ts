import express, { Request, Response } from "express";

const app = express();

app.get("/", (req: Request, res: Response) => {
  res.send("init");
});

app.listen(3000, () => {
  console.log("starting server");
});
