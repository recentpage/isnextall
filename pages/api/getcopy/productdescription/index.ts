import { OpenAIApi, Configuration } from "openai";
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const openai = async (req: NextApiRequest, res: NextApiResponse) => {
  const { docid, productname, productcharacteristics } = req.body;
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

    let docsid = "";
    // use prisma and save the response to the database first toolgen table and then copys table
    if (docid == "") {
      const toolgen = await prisma.toolgens.create({
        data: {
          docname: "untitled",
          doctool: "productdescription",
          toolId: 1,
        },
      });
      console.log(toolgen);
      const docsid = toolgen.id;
    } else {
      const docsid = parseInt(docid);
    }

    const copys = await prisma.copys.create({
      data: {
        text: response.data.choices[0].text,
        toolgenId: docsid,
      },
    });

    res.status(200).json({
      text: response.data.choices[0].text,
      model: response.data.model,
      token: response.data,
    });
  } catch (error) {
    //@ts-ignore
    res.status(500).json({ error: error.message });
  }
};

export default openai;
