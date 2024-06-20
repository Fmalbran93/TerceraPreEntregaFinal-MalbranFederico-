import { Command } from "commander";

const program = new Command();

program
  .option("--mode <mode>", "Enviroment", "build")
  .option("-p <port>", "Server port", 8080);
program.parse();

export default program;
