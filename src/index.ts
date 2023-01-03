import express, { Request, Response } from "express";


const app = express();
const port = process.env.PORT || 3000
const parserMiddleWare = express.json()

app.use(parserMiddleWare)

app.get('/', (req: Request, res: Response) => {
  res.send('this is video api')
})

let videosDB: any = [
  {
    id: 1,
    title: "backend 1 lesson",
    author: "IT-kamasutra",
    canBeDownloaded: true,
    minAgeRestriction: null,
    createdAt: new Date().toISOString(),
    publicationDate: new Date().toISOString(),
    availableResolutions: ["P720", "P1080", "P1440", "P2160"],
  },
  {
    id: 2,
    title: "подкаст ",
    author: "мы обречены",
    canBeDownloaded: true,
    minAgeRestriction: null,
    createdAt: new Date().toISOString(),
    publicationDate: new Date().toISOString(),
    availableResolutions: ["P720", "P1080", "P1440", "P2160"],
  },
];

app.get("/videos", (req: Request, res: Response) => {
  res.send(videosDB);
});
app.post("/videos", (req: Request, res: Response) => {
  let title = req.body.title;
  let author = req.body.author;
  let availableResolutions = req.body.availableResolutions;
  const dateNow = new Date();
  const dateNowPlusOneDay = +dateNow + 1000 * 60 * 60 * 24;

  if (
    !title ||
    typeof title !== "string" ||
    !title.trim() ||
    title.length > 40
  ) {
    res.status(400).send({
      errorsMessages: [
        {
          message: "title is incorrect",
          field: "title",
        },
      ],
    });
    if (
      !author ||
      typeof author !== "string" ||
      !title.trim() ||
      title.length > 20
    ) {
      res.status(400).send({
        errorsMessages: [
          {
            message: "author is incorrect",
            field: "author",
          },
        ],
      });
      return;
    }
    if (
      availableResolutions.length < 1 ||
      typeof availableResolutions !== "string"
    ) {
      res.status(400).send({
        errorsMessages: [
          {
            message: "availableResolutions is incorrect",
            field: "availableResolutions",
          },
        ],
      });
      const newVideo = {
        id: +new Date(),
        title: req.body.title,
        author: req.body.author,
        canBeDownloaded: req.body.canBeDownloaded || false,
        minAgeRestriction: req.body.minAgeRestriction || null,
        createdAt: dateNow.toISOString(),
        publicationDate: dateNow.toISOString(),
        availableResolutions: req.body.availableResolutions,
      };
      videosDB.push(newVideo);
      res.status(201).send(newVideo);
    }
  }
});

app.put("/videos/Videoid", (req: Request, res: Response) => {
  let title = req.body.title;
  if (!title || typeof title !== "string" || title.trim()) {
    res.status(400).send({
      errorsMessages: [
        {
          message: "string",
          field: "string",
        },
      ],
    });
    return;
  }
  let id = +req.params.Videoid;
  const video = videosDB.find((v: any) => v.id === id);

  if (video) {
    video.title = title;
    res.status(204).send(video);
  } else {
    res.send(404);
  }
});
app.get("/videos/:Videoid", (req: Request, res: Response) => {
  let id = +req.params.Videoid;
  const video = videosDB.find((v: any) => v.id === id);
  if (video) {
    res.status(200).send(video);
  } else {
    res.send(404);
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
