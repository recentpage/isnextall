import { OpenAIApi, Configuration } from "openai";
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const openai = async (req: NextApiRequest, res: NextApiResponse) => {
  const { proid, productname, productcharacteristics } = req.body;
  const configuration = new Configuration({
    apiKey: "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",
  });
  const api = new OpenAIApi(configuration);
  const prompt = `Generate a product description for a product with the following attributes: product name = '${productname}', product description = '${productcharacteristics}'. Make sure to include details about the product's features and benefits. genrate 3 variations of the product description.`;
  console.log(prompt);
  try {
    const response = await api.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      max_tokens: 270,
      temperature: 0,
    });

    if (response.status === 200) {
      let text = response.data.choices[0].text;
      // split the text into 3 variations by \n
      const variations = text?.split("\n");
      // console.log(variations);
      // use for and map to get the variations
      let variationsArray: any = [];
      let newVariationsArray: any = [];
      if (variations) {
        variationsArray = variations.map((element) => {
          if (element.split(" ").length > 3) {
            newVariationsArray.push(element);
          }
        });
      }
      let status = "";
      let act = "";
      if (proid === "blank") {
        const toolgen = await prisma.toolgen.create({
          data: {
            title: "Untitled",
            toolId: 1,
            spaceId: 1,
          },
        });
        if (toolgen.id) {
          if (newVariationsArray.length > 0) {
            newVariationsArray.map(async (e: any) => {
              const copys = await prisma.copygen.create({
                data: {
                  text: e,
                  toolgenId: toolgen.id,
                },
              });
            });
          }
        }
        status = "success";
        act = "create";
      } else {
        if (newVariationsArray.length > 0) {
          newVariationsArray.map(async (e: any) => {
            console.log(proid);
            const copys = await prisma.copygen.create({
              data: {
                text: e,
                toolgenId: parseInt(proid),
              },
            });
          });
        }
        status = "success";
        act = "update";
      }
      res.status(200).json({ status, act });
    }
  } catch (error) {
    //@ts-ignore
    res.status(500).json({ error: error.message });
  }
};

export default openai;
