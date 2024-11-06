import { Loader2 } from "lucide-react"

export const LoadingState = () => {
  return (
    <div className="flex items-center justify-center w-full h-48">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  )
}
