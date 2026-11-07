export interface UpdateQuery {
  setClause: string;
  values: unknown[];
  nextIndex: number;
}

export function buildUpdate(
  fields: Record<string, unknown>,
  columnMap: Record<string, string>,
  startIndex = 1,
): UpdateQuery {
  const sets: string[] = [];
  const values: unknown[] = [];
  let index = startIndex;

  for (const [key, value] of Object.entries(fields)) {
    if (value === undefined) continue;

    const column = columnMap[key];
    if (!column) continue;

    sets.push(`${column} = $${index}`);
    values.push(value);
    index += 1;
  }

  return { setClause: sets.join(", "), values, nextIndex: index };
}
