import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface ErrorStateProps {
  error: string | null
}

export const ErrorState = ({ error }: ErrorStateProps) => {
  return (
    <Alert variant="destructive" className="max-w-3xl mx-auto mt-8">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        {error || "An unexpected error occurred"}
      </AlertDescription>
    </Alert>
  )
}
