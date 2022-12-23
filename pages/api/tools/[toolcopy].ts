export default async function handler(req: any, res: any) {
  const toolcopy = req.query.toolcopy;

  if (req.method === "GET" && toolcopy != "undefined") {
    res.status(200).json(toolcopy);
  } else {
    res.status(404).json({ message: "Toolcopy not found" });
  }
}
