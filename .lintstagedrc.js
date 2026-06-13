module.exports = {
  "*.{js,jsx,ts,tsx,md}": "pnpm format",

  "apps/backend/src/**/*.{ts}": (filenames) => {
    const filesToProcess = filenames.filter(
      (f) => !f.includes("src/generated/"),
    );
    if (filesToProcess.length === 0) {
      return [];
    }
    const fileArgs = filenames.join(" ");
    const lintCommand = `pnpm --filter backend run lint ${fileArgs}`;
    const checkTypesCommand = "pnpm --filter backend run check-ts";
    const testCommand = `pnpm --filter backend test -- --findRelatedTests ${fileArgs} --passWithNoTests`;

    return [lintCommand, checkTypesCommand, testCommand];
  },

  "apps/frontend/src/**/*.{ts,tsx}": (filenames) => {
    // const lintFileArgs = filenames.map((f) => `--file ${f}`).join(" ");
    // const lintCommand = `pnpm --filter frontend exec next lint --dir apps/frontend ${lintFileArgs}`;

    const checkTypesCommand =
      "pnpm --filter frontend exec tsc --noEmit -p tsconfig.json";

    const testFileArgs = filenames.join(" ");
    const testCommand = `pnpm --filter frontend exec jest --findRelatedTests ${testFileArgs} --passWithNoTests`;

    return [checkTypesCommand, testCommand];
  },
};
