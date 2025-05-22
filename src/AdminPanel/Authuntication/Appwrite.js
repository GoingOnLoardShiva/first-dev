import { Client, Account } from "appwrite";

const client = new Client();
client
  .setEndpoint("https://fra.cloud.appwrite.io/v1")
  .setProject("682f6b32002e9e6c1dcd");

const account = new Account(client);

export { account };
