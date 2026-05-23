import Clipboard from "./Clipoboard";

type codeTypes = {
  value: {
    code: string;
    language: string;
    filename?: string | null;
  };
};

export default function CodeBlock({ value }: codeTypes) {
  return (
    <div className="my-6">
      {value.filename && (
        <div className="flex items-center justify-between bg-zinc-50 dark:bg-[#141414] border dark:border-zinc-800 border-zinc-200 rounded-t-lg px-4 py-3 translate-y-2">
          <p className="text-sm">{value.filename}</p>
          <Clipboard content={value.code} />
        </div>
      )}
      <pre className="text-sm border dark:border-zinc-800 border-zinc-200 rounded-lg p-4 overflow-x-auto dark:bg-zinc-950 bg-zinc-50 tracking-normal">
        <code>{value.code}</code>
      </pre>
    </div>
  );
}
