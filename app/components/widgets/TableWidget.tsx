type TableRow = {
  _key: string;
  cells: string[];
};

type TableValueProps = {
  table?: { rows?: TableRow[] };
  caption?: string;
};

export function TableWidget({ table, caption }: TableValueProps) {
  const rows = table?.rows || [];
  return (
    <div className="overflow-x-auto my-4">
      {caption && (
        <em className="not-italic text-sm font-semibold block mb-2">{caption}</em>
      )}
      <table className="w-full border-collapse text-sm">
        <tbody>
          {rows.map((row) => (
            <tr key={row._key} className="border-b dark:border-zinc-800 border-zinc-200">
              {row.cells.map((cell, i) => (
                <td key={i} className="px-4 py-2">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
