"use client"

import * as React from "react"
import { AlertCircle, RefreshCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  name?: string
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(`ErrorBoundary [${this.props.name || "Global"}]:`, error, errorInfo)
  }

  resetError = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex min-h-[200px] w-full flex-col items-center justify-center rounded-3xl border-2 border-dashed border-red-200 bg-red-50/50 p-8 text-center animate-in fade-in zoom-in duration-300">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h3 className="font-display text-lg font-bold text-red-900">Algo deu errado</h3>
          <p className="mt-2 max-w-[280px] text-sm text-red-700/80">
            Não foi possível carregar este componente ({this.props.name || "Módulo"}).
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={this.resetError}
            className="mt-6 border-red-200 bg-white text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            Tentar novamente
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}
