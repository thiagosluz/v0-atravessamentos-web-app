import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Button,
} from "@react-email/components"
import * as React from "react"

interface NewsEmailProps {
  title: string
  excerpt: string
  category: string
  slug: string
  imageUrl?: string
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || ""

export const NewsEmail = ({
  title = "Nova notícia no Coletivo",
  excerpt = "Confira as novidades do nosso coletivo.",
  category = "Notícia",
  slug = "",
  imageUrl,
}: NewsEmailProps) => (
  <Html>
    <Head />
    <Preview>{title}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
           <Text style={categoryText}>{category.toUpperCase()}</Text>
        </Section>
        
        {imageUrl && (
          <Img
            src={imageUrl}
            width="600"
            alt={title}
            style={image}
          />
        )}
        
        <Section style={content}>
          <Heading style={heading}>{title}</Heading>
          <Text style={paragraph}>{excerpt}</Text>
          
          <Section style={buttonContainer}>
            <Button
              style={button}
              href={`${baseUrl}/diario/${slug}`}
            >
              Ler notícia completa
            </Button>
          </Section>
        </Section>
        
        <Hr style={hr} />
        
        <Section style={footer}>
          <Text style={footerText}>
            Coletivo Atravessamentos — Educação, Arte e Justiça Social.
          </Text>
          <Text style={footerText}>
            Você recebeu este e-mail porque assinou nossa newsletter.
            <br />
            <Link href={`${baseUrl}/unsubscribe`} style={link}>
              Descadastrar
            </Link>
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export default NewsEmail

const main = {
  backgroundColor: "#f8f5f2",
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
}

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  maxWidth: "600px",
}

const header = {
  padding: "32px 0",
  textAlign: "center" as const,
}

const categoryText = {
  fontSize: "12px",
  fontWeight: "700",
  letterSpacing: "2px",
  color: "#9c4a24",
  margin: "0",
}

const content = {
  padding: "0 40px",
}

const heading = {
  fontSize: "32px",
  lineHeight: "1.2",
  fontWeight: "700",
  textAlign: "center" as const,
  color: "#1a1a1a",
}

const image = {
  borderRadius: "16px",
  width: "100%",
  marginBottom: "24px",
}

const paragraph = {
  fontSize: "18px",
  lineHeight: "1.6",
  color: "#4a4a4a",
}

const buttonContainer = {
  textAlign: "center" as const,
  margin: "32px 0",
}

const button = {
  backgroundColor: "#9c4a24",
  borderRadius: "100px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "16px 32px",
}

const hr = {
  borderColor: "#e6e6e6",
  margin: "40px 0",
}

const footer = {
  padding: "0 40px",
}

const footerText = {
  fontSize: "14px",
  lineHeight: "24px",
  color: "#999",
  textAlign: "center" as const,
}

const link = {
  color: "#9c4a24",
  textDecoration: "underline",
}
