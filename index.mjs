import { S3 } from "@aws-sdk/client-s3";

const s3 = new S3();

export const handler = async () => {
  const params = {
    Bucket: "portfolio-v2-resources",
    Key: "CV_Dibendu_Saha.pdf",
  };

  try {
    // Convert the S3 response body (stream) into a buffer
    const streamToBuffer = async (stream) => {
      const chunks = [];
      for await (const chunk of stream) {
        chunks.push(chunk);
      }
      return Buffer.concat(chunks);
    };

    const data = await s3.getObject(params);
    const fileBuffer = await streamToBuffer(data.Body);
    const pdfBaseEncoded = fileBuffer.toString("base64");

    // Return the file as base64-encoded string
    return {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="${params.Key}"`,
      },
      body: pdfBaseEncoded,
    };
  } catch (err) {
    console.log(err);
    return {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ error: err.message }),
    };
  }
};
