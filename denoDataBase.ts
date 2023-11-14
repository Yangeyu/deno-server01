import {
  Database,
  DataTypes,
  Model,
  PostgresConnector,
} from "https://deno.land/x/denodb@v1.4.0/mod.ts";

const connector = new PostgresConnector({
  database: "postgres",
  host: "localhost",
  username: "postgres",
  password: "111",
  port: 5432, // optional
});

const db = new Database(connector);

class User extends Model {
  static table = "user";
  static timestamps = true;
  static fields = {
    id: {
      autoIncrement: true,
      primaryKey: true,
    },
    name: DataTypes.STRING,
    age: DataTypes.INTEGER,
  };
}

db.link([User]);
await db.sync({ drop: true });

await User.create([
  {
    name: "zs",
    age: 12,
  },
  {
    name: "ls",
    age: 32,
  },
]);

let res: unknown;
res = await User.all();
res = await User.select("name").all();
res = await User.where("name", "ls").all();
res = await User.where("name", "like", "%s%").all();
res = await User.where("age", ">", "31").all();
res = await User.where("age", ">", "21").delete();
res = await User.all()

console.log("...", res);
