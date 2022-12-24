import { OpenAIApi, Configuration } from "openai";
import { NextApiRequest, NextApiResponse } from "next";

const openai = async (req: NextApiRequest, res: NextApiResponse) => {
  const { productname, productcharacteristics } = req.body;
  const configuration = new Configuration({
    organization: "org-irggoJlk0XzpTp72XHXOrFjM",
    apiKey: process.env.OPENAI_API_KEY,
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
