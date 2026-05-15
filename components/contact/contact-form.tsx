"use client"

import * as React from "react"
import { motion } from "motion/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { sendContactMessage } from "@/lib/actions/contact"

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.target as HTMLFormElement)
    
    try {
      const result = await sendContactMessage(formData)
      
      if (result.error) {
        toast({
          title: "Erro no envio",
          description: result.error,
          variant: "destructive",
        })
      } else if (result.success) {
        toast({
          title: "Mensagem enviada!",
          description: "Mensagem enviada com afeto! Retornaremos em breve.",
        })
        ;(e.target as HTMLFormElement).reset()
      }
    } catch (error) {
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro ao enviar a mensagem.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form id="contact-form" onSubmit={handleSubmit} className="space-y-5">
      {/* Honeypot Field - Invisível para humanos, irresistível para bots */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium opacity-70 ml-1">
            Seu nome
          </label>
          <Input
            id="name"
            name="name"
            placeholder="Como podemos te chamar?"
            required
            className="h-12 rounded-2xl border-foreground/10 bg-foreground/5 text-foreground placeholder:text-foreground focus:border-primary focus:ring-primary/20 transition-all"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium opacity-70 ml-1">
            Seu e-mail
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="onde te respondemos?"
            required
            className="h-12 rounded-2xl border-foreground/10 bg-foreground/5 text-foreground placeholder:text-foreground focus:border-primary focus:ring-primary/20 transition-all"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="category" className="text-sm font-medium opacity-70 ml-1">
          Assunto do contato
        </label>
        <Select name="category" required>
          <SelectTrigger id="category" className="h-12 rounded-2xl border-foreground/10 bg-foreground/5 text-foreground focus:border-primary focus:ring-primary/20 transition-all">
            <SelectValue placeholder="Selecione uma categoria" />
          </SelectTrigger>
          <SelectContent className="rounded-2xl">
            <SelectItem value="Parceria">Parceria Artística / Educativa</SelectItem>
            <SelectItem value="Edital">Informação sobre Edital</SelectItem>
            <SelectItem value="Colaboração">Quero Colaborar</SelectItem>
            <SelectItem value="Trabalho">Trabalhe Conosco</SelectItem>
            <SelectItem value="Outros">Outros Assuntos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label htmlFor="subject" className="text-sm font-medium opacity-70 ml-1">
          Título da mensagem
        </label>
        <Input
          id="subject"
          name="subject"
          placeholder="Um resumo breve"
          required
          className="h-12 rounded-2xl border-foreground/10 bg-foreground/5 text-foreground placeholder:text-foreground focus:border-primary focus:ring-primary/20 transition-all"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-medium opacity-70 ml-1">
          Mensagem
        </label>
        <Textarea
          id="message"
          name="message"
          placeholder="Escreva aqui seu pensamento, proposta ou dúvida..."
          required
          className="min-h-[160px] resize-none rounded-3xl border-foreground/10 bg-foreground/5 text-foreground placeholder:text-foreground focus:border-primary focus:ring-primary/20 transition-all"
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-14 rounded-full bg-primary text-primary-foreground text-lg font-bold hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-[0.98]"
      >
        {isSubmitting ? "Enviando..." : "Enviar Atravessamento"}
      </Button>
    </form>
  )
}
