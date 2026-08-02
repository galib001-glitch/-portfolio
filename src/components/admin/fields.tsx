"use client";

export type FieldType = "text" | "textarea" | "tags" | "list" | "select" | "checkbox";

export interface FieldSchema {
  key: string;
  label: string;
  type: FieldType;
  options?: string[];
  placeholder?: string;
}

const inputClass =
  "w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-neon-blue/40";

export function FieldInput({
  field,
  value,
  onChange,
}: {
  field: FieldSchema;
  value: unknown;
  onChange: (value: unknown) => void;
}) {
  switch (field.type) {
    case "textarea":
      return (
        <textarea
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          rows={3}
          className={`${inputClass} resize-y font-mono-term text-xs`}
        />
      );
    case "tags":
      return (
        <input
          value={Array.isArray(value) ? (value as string[]).join(", ") : ""}
          onChange={(e) =>
            onChange(
              e.target.value
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
            )
          }
          placeholder={field.placeholder ?? "comma, separated, values"}
          className={inputClass}
        />
      );
    case "list":
      return (
        <textarea
          value={Array.isArray(value) ? (value as string[]).join("\n") : ""}
          onChange={(e) => onChange(e.target.value.split("\n"))}
          placeholder={field.placeholder ?? "one item per line"}
          rows={4}
          className={`${inputClass} resize-y font-mono-term text-xs`}
        />
      );
    case "select":
      return (
        <select
          value={(value as string) ?? field.options?.[0] ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className={inputClass}
        >
          {field.options?.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      );
    case "checkbox":
      return (
        <label className="flex items-center gap-2 text-sm text-white/60">
          <input type="checkbox" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} />
          {field.label}
        </label>
      );
    case "text":
    default:
      return (
        <input
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className={inputClass}
        />
      );
  }
}

export function FieldRow({
  field,
  value,
  onChange,
}: {
  field: FieldSchema;
  value: unknown;
  onChange: (value: unknown) => void;
}) {
  if (field.type === "checkbox") {
    return <FieldInput field={field} value={value} onChange={onChange} />;
  }
  return (
    <div>
      <label className="mb-1 block text-xs text-white/40">{field.label}</label>
      <FieldInput field={field} value={value} onChange={onChange} />
    </div>
  );
}
