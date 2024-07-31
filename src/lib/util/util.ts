import { exec as child_process_exec, type ExecException } from "child_process";
export function exec(command: string): Promise<{
  command: string;
  error: ExecException | null;
  out: string;
  err: string;
}> {
  return new Promise((resolve, reject) => {
    child_process_exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      }
      resolve({ error, command: command, out: stdout, err: stderr });
    });
  });
}
