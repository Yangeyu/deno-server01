// @deno-types="npm:@types/express@^4.17"
import express from "npm:express@^4.17";
// @deno-types="npm:@types/body-parser"
import bodyParser from "npm:body-parser";
// @deno-types="npm:@types/multer"
import multer from "npm:multer";
const app = express();

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, './upload/')
  },
  filename: function (req, file, cb) {
    const { name = 'default' } = req.body 
    console.log('ss', file)
    cb(null, name + '_' + file.originalname)
  }
})

const upload = multer({ 
  storage,
  limits: {
    
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'image/png') {
      const err: any = {}
      err.message = '不允许上传png'
      err.code = '-111'
      return (cb(err as Error))
      // return cb(Error('不允许上传png'))
      // return cb(null, false)
    }
    cb(null, true)
  }
})
// const upload = multer()
app.use(bodyParser.json())

app.get("/", (req, res) => {
  // console.log(req);
  req.accepts("application/json")
  res.send('Hello World');
});


app.listen(3000);
console.log("listening on http://localhost:3000/");

export function add(a: number, b: number): number {
  return a + b;
}

// Learn more at https://deno.land/manual/examples/module_metadata#concepts
if (import.meta.main) {
  // console.log("Add 2 + 3 =", add(2, 3));
}
