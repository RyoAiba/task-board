export function CheckboxGroup<T extends string>({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string
  options: { label: string; value: T }[]
  selected: T[]
  onToggle: (value: T) => void
}) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <span className="text-xs font-medium text-gray-400 whitespace-nowrap">{label}</span>
      {options.map(opt => {
        const checked = selected.includes(opt.value)
        return (
          <label key={opt.value} className="flex items-center gap-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={checked}
              onChange={() => onToggle(opt.value)}
              className="w-4 h-4 accent-[#FA6218] cursor-pointer"
            />
            <span className={`text-sm ${checked ? "text-gray-800 font-medium" : "text-gray-500"}`}>
              {opt.label}
            </span>
          </label>
        )
      })}
    </div>
  )
}