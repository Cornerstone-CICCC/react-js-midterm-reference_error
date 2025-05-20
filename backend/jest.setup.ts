import * as fs from "node:fs";
import { resolve } from "node:path";

try {
  const envPath = resolve(process.cwd(), ".env.test");

  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf8");
    const envLines = envContent.split("\n");

    // Set environment variables
    for (const line of envLines) {
      const trimmedLine = line.trim();
      // skip empty lines and comments
      if (!trimmedLine || trimmedLine.startsWith("#")) {
        continue;
      }

      // divide key and value
      const separatorIndex = trimmedLine.indexOf("=");
      if (separatorIndex > 0) {
        const key = trimmedLine.substring(0, separatorIndex).trim();
        let value = trimmedLine.substring(separatorIndex + 1).trim();

        // remove quotes from value
        value = value.replace(/^['"]|['"]$/g, "");

        // set the environment variable
        if (key && value) {
          (process.env as NodeJS.ProcessEnv)[key] = value;
        }
      }
    }
  } else {
    console.error(".env.test file not found at path:", envPath);
  }
} catch (error) {
  console.error("Error loading environment variables:", error);
}
