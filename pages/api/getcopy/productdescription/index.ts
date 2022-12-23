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
      let variations = text?.split("\n");
      // use for and map to get the variations
      if (variations) {
        for (let i = 0; i < variations.length; i++) {
          let words = variations[i].split(" ");
          if (words.length < 3) {
            variations.splice(i, 1);
            i++;
          }
        }
      }
      console.log(variations);
      // use prisma and save the response to the database first toolgen table and then copys table
      if (proid === "blank") {
        const toolgen = await prisma.toolgen.create({
          data: {
            title: "Untitled",
            toolId: 1,
            spaceId: 1,
          },
        });
        const copys = await prisma.copygen.create({
          data: {
            text: response.data.choices[0].text,
            toolgenId: toolgen.id,
          },
        });
      } else {
        const copys = await prisma.copygen.create({
          data: {
            text: response.data.choices[0].text,
            toolgenId: parseInt(proid),
          },
        });

        res.status(200).json({
          text: response.data.choices[0].text,
          model: response.data.model,
          token: response.data,
        });
      }
    }
  } catch (error) {
    //@ts-ignore
    res.status(500).json({ error: error.message });
  }
};

export default openai;
