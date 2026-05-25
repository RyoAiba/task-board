type Props = {
  message: string
  visible: boolean
}

export function Toast({ message, visible }: Props) {
  if (!visible) return null
  return (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none">
      <div className="bg-gray-800 text-white text-sm px-6 py-3 rounded-lg shadow-lg whitespace-nowrap">
        {message}
      </div>
    </div>
  )
}