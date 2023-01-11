import express, { Request, Response } from "express";


const app = express();
const port = process.env.PORT || 3000
const parserMiddleWare = express.json()

app.use(parserMiddleWare)

const dateNow = new Date();


let DayPlusOne = (date:any)=>{
  date.setDate(date.getDate() + 1)
  return date.toISOString();
} 

//фун-ция проверяет указано хотя бы одно разрешение из массива resolutions
let Isresolution = (res:string) =>{
  let resolutions = [ 'P144','P240', "P360", "P480", "P720", "P1080", "P1440", "P2160"  ];
 if(resolutions.includes(res)){
 return true;
 }
 else{
  return false
 }
}




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
    createdAt: dateNow.toISOString(),
    publicationDate: DayPlusOne(dateNow),
    availableResolutions: ["P720", "P1080", "P1440", "P2160"],
  },
  {
    id: 2,
    title: "подкаст ",
    author: "мы обречены",
    canBeDownloaded: true,
    minAgeRestriction: null,
    createdAt: dateNow.toISOString(),
    publicationDate: DayPlusOne(dateNow),
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

  // const dateNowPlusOneDay = +dateNow + 1000 * 60 * 60 * 24;

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
      Isresolution(availableResolutions)==false ||
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
        publicationDate: DayPlusOne(dateNow) ,
        availableResolutions: req.body.availableResolutions,
      };
      videosDB.push(newVideo);
      res.status(201).send(newVideo);
    }
  }
});

app.put("/videos/Videoid", (req: Request, res: Response) => {
  let author = req.body.author;
  let title = req.body.title;
  let availableResolutions = req.body.availableResolutions;
  if (!title || typeof title !== "string" || title.trim() ||  title.length > 40) {
    res.status(400).send({
      errorsMessages: [
        {
          message: "invalid string",
          field: "string",
        },
      ],
    });
    return;
  }
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
      Isresolution(availableResolutions)==false ||
      typeof availableResolutions !== "string"
    ) {
      res.status(400).send({
        errorsMessages: [
          {
            message: "availableResolutions is incorrect",
            field: "availableResolutions",
          },
        ],
      })};
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

app.delete("/videos/:Videoid", (req: Request, res: Response) => {
  for (let i = 0; i < videosDB.length; i++) {
    if (videosDB[i].id === +req.params.Videoid) {
      videosDB.splice(i, 1);
      res.send(204);
      return;
    }
  }
  res.send(404);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
