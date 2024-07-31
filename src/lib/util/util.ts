import { promisify } from "util";
import { exec as exec_ } from "child_process";
export const exec = promisify(exec_);
