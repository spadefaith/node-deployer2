import server from "~/server";

export async function handleRequest(reqOptions: {
  method: string;
  path: string;
  headers: any;
  query: any;
}) {
  return new Promise((resolve, reject) => {
    // Mock request and response objects
    const req = {
      method: reqOptions.method,
      url: reqOptions.path,
      headers: reqOptions.headers,
      // params: {}, // Example of route parameters
      query: reqOptions.query, // Example of query parameters
    };

    // console.log(19, req);

    const res = {
      status: function (code) {
        this.statusCode = code;
        return this; // Allow chaining
      },
      statusText: "OK",
      headers: {},
      body: "",
      getHeader: function (header) {
        return this.headers[header.toLowerCase()];
      },
      setHeader: function (header, value) {
        this.headers[header.toLowerCase()] = value;
      },
      write: function (chunk) {
        this.body += chunk.toString();
      },
      end: function (data) {
        if (data) {
          this.write(data);
        }
        console.log("Response:", this.status, this.statusText);
        console.log("Headers:", this.headers);
        console.log("Body:", this.body);
      },
      send: function (message) {
        console.log("Response:", this.statusCode, this.headers);
        console.log("Body:", message);
      },
      json: function (data) {
        console.log("Response:", this.statusCode, this.headers);
        console.log("Body:", data);

        resolve(data);
      },
    };

    // Use the app to handle the request
    server(req, res);
  });
}
