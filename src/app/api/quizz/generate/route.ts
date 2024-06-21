//here we use JSON output function parser which enables us to define the schema for the JSON responses. We can do schema validation on responses and also format the JSON responses.
//currently quiz record in the database in quizzes table has an unique id  which we use to identify them 
//and that means when we are creating a page to display a quiz there is a segment name that is unknown ahead of the time because we do not want to create a file and hard code the ID of the quiz
//we want the part of the route to be dynamic that tells use which quiz it is and for this purpose we use Dynamic Routes and access that dynamic value on our page
import { NextRequest, NextResponse } from "next/server";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage } from "@langchain/core/messages";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { JsonOutputFunctionsParser } from "langchain/output_parsers";
import saveQuiz from "./saveToDb";

export async function POST(req: NextRequest) {
  const body = await req.formData();
  const document = body.get("pdf");

  try {
    const pdfLoader = new PDFLoader(document as Blob, {
      parsedItemSeparator: " ",
    });
    const docs = await pdfLoader.load();

    const selectedDocuments = docs.filter(
      (doc) => doc.pageContent !== undefined
    );

    const texts = selectedDocuments.map((doc) => doc.pageContent);

    const prompt =
      "given the text which is a summary of the document, generate a quiz based on the text. Return json only that contains a quiz object with fields: name, description and questions. The questions is an array of objects with fields: questionText, answers. The answers is an array of objects with fields: answerText, isCorrect.";

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key not provided" },
        { status: 500 }
      );
    }

    const model = new ChatOpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: "gpt-3.5-turbo-1106",
    });

    const parser = new JsonOutputFunctionsParser();
    const extractionFunctionSchema = {
      name: "extractor", //as given in documentation
      description: "Extracts fields from the output/response",
      parameters: {
        type: "object",
        properties: {
          quiz: {
            type: "object",
            properties: {
              name: { type: "string" },
              description: { type: "string" },
              questions: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    questionText: { type: "string" },
                    answers: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          answerText: { text: "string" },
                          isCorrect: { type: "boolean" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    };

    // Create a new runnable, bind the function to the model, and pipe the output through the parser
    const runnable = model
      .bind({
        functions: [extractionFunctionSchema],
        function_call: { name: "extractor" },
      })
      .pipe(parser);

    const message = new HumanMessage({
      content: [
        {
          type: "text",
          text: prompt + "\n" + texts.join("\n"),
        },
      ],
    });

    // Invoke the runnable with an input instead of model invoke
    const result = await runnable.invoke([message]);

    const {quizID} = await saveQuiz(result.quiz)

    return NextResponse.json(
      { quizID },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
