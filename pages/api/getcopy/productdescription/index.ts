import { OpenAIApi, Configuration } from "openai";
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const openai = async (req: NextApiRequest, res: NextApiResponse) => {
  const { proid, toneofvoice, productname, productcharacteristics } = req.body;
  const configuration = new Configuration({
    apiKey: "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",
  });
  const api = new OpenAIApi(configuration);
  const prompt = `Generate a product description for a product with the following attributes: product name = '${productname}', product description = '${productcharacteristics}'. Make sure to include details about the product's features and benefits.use Tone of voice = '${toneofvoice}'. genrate 3 variations of the product description.`;
  // console.log(prompt);
  try {
    const response = await api.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      max_tokens: 270,
      temperature: 0,
    });

    if (response.status === 200) {
      let text = response.data.choices[0].text;
      console.log(text);
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
      let proidnew = "";
      if (proid === "blank") {
        const toolgen = await prisma.toolgen.create({
          data: {
            title: "Untitled",
            toolId: 1,
            spaceId: 1,
          },
        });
        if (toolgen.id && productname && productcharacteristics) {
          const addProductdescription = await prisma.productdescription.create({
            data: {
              productname: productname,
              productcharacteristics: productcharacteristics,
              toneofvoice: toneofvoice,
              toolgenId: toolgen.id,
            },
          });
        }

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
        proidnew = toolgen.id.toString();
      } else {
        const addProductdescription = await prisma.productdescription.update({
          where: {
            toolgenId: parseInt(proid),
          },
          data: {
            productname: productname,
            productcharacteristics: productcharacteristics,
            toneofvoice: toneofvoice,
          },
        });
        console.log(newVariationsArray);
        if (newVariationsArray.length > 0) {
          newVariationsArray.map(async (e: any) => {
            // console.log(proid);
            // console.log(e);
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
      res.status(200).json({ status, act, proid: proidnew });
    }
  } catch (error) {
    //@ts-ignore
    res.status(500).json({ error: error.message });
  }
};

export default openai;
