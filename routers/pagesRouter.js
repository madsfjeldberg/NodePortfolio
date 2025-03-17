import { Router } from "express";

const pagesRouter = Router();

pagesRouter.get("/", (req, res) => {
  res.render("pages/frontpage", {
    title: "Frontpage | NodePortfolio",
    tocEnabled: false,
  });
});

pagesRouter.get("/restapi", (req, res) => {
  res.render("pages/restapi", {
    title: "REST API | NodePortfolio",
    tocEnabled: true,
  });
}); 

pagesRouter.get("/javascript", (req, res) => {
  res.render("pages/javascript", {
    title: "JavaScript | NodePortfolio",
    tocEnabled: true,
  });
});

pagesRouter.get("/nodejs", (req, res) => {
  res.render("pages/nodejs", {
    title: "Node.js | NodePortfolio",
    tocEnabled: true,
  });
});

pagesRouter.get("/express", (req, res) => {
  res.render("pages/express", {
    title: "Express | NodePortfolio",
    tocEnabled: true,
  });
});

pagesRouter.get("/proxy", (req, res) => {
  let url = "https://www.google.com";
  fetch(url)
    .then((response) => response.text())
    .then((data) => {
      res.send(data);
    });
});

export default pagesRouter;
