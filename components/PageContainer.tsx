type Props = {
  children: React.ReactNode
  className?: string
}

export function PageContainer({ children, className = "" }: Props) {
  return (
    <div className={`h-full overflow-y-auto overflow-x-hidden overscroll-none px-4 md:px-6 py-6 ${className}`}>
      {children}
    </div>
  )
}