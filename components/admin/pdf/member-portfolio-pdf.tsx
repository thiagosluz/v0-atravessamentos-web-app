import React from "react"
import { Document, Page, Text, View, StyleSheet, Image as PdfImage, Font, Link as PdfLink } from "@react-pdf/renderer"
import { type Member, type Project } from "@/lib/mock-data"
import { stripHtml } from "@/lib/utils/html-strip"

// As fontes não padrão não funcionam no react-pdf sem registrar as URLs .ttf
// Vamos usar as fontes nativas seguras (Helvetica) para garantir performance e compatibilidade,
// mas simulando a hierarquia visual.
const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: "#F9F6F1", // Fundo do sistema
    fontFamily: "Helvetica",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 40,
    borderBottomWidth: 1,
    borderBottomColor: "#A65A3C", // Terracota
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    color: "#A65A3C",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  content: {
    flexDirection: "row",
    gap: 30,
  },
  leftCol: {
    width: "35%",
    flexShrink: 0,
  },
  rightCol: {
    width: "65%",
    flexGrow: 1,
  },
  avatar: {
    width: "100%",
    height: 180,
    objectFit: "cover",
    borderRadius: 8,
    marginBottom: 15,
  },
  name: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 5,
  },
  role: {
    fontSize: 16,
    color: "#666666",
    marginBottom: 15,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
    marginBottom: 20,
  },
  tag: {
    fontSize: 10,
    color: "#A65A3C",
    backgroundColor: "rgba(166, 90, 60, 0.1)",
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333333",
    marginTop: 20,
    marginBottom: 8,
    textTransform: "uppercase",
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
    paddingBottom: 4,
  },
  bio: {
    fontSize: 12,
    color: "#444444",
    lineHeight: 1.6,
  },
  contactItem: {
    fontSize: 10,
    color: "#666666",
    marginBottom: 5,
    textDecoration: "none",
  },
  projectItem: {
    marginBottom: 10,
  },
  projectTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333333",
  },
  projectMeta: {
    fontSize: 10,
    color: "#888888",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
    paddingTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: {
    fontSize: 8,
    color: "#888888",
  }
})

interface MemberPortfolioPDFProps {
  member: Member
  projects: Project[]
}

export const MemberPortfolioPDF = ({ member, projects }: MemberPortfolioPDFProps) => {
  const pureBio = stripHtml(member.bio)

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Coletivo Atravessamentos</Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Left Column (Avatar & Contact) */}
          <View style={styles.leftCol}>
            {member.avatar && !member.avatar.includes("placeholder.svg") && (
              <PdfImage src={member.avatar} style={styles.avatar} />
            )}
            
            <View style={styles.tagsContainer}>
              {member.tags.map((tag) => (
                <Text key={tag} style={styles.tag}>{tag}</Text>
              ))}
            </View>

            <Text style={styles.sectionTitle}>Contato</Text>
            {member.email && (
              <PdfLink src={`mailto:${member.email}`} style={styles.contactItem}>
                {member.email}
              </PdfLink>
            )}
            {member.phone && (
              <Text style={styles.contactItem}>{member.phone}</Text>
            )}
            {member.instagram && (
              <PdfLink src={`https://instagram.com/${member.instagram.replace('@', '')}`} style={styles.contactItem}>
                Instagram: {member.instagram}
              </PdfLink>
            )}
            {member.linkedin && (
              <PdfLink src={member.linkedin} style={styles.contactItem}>
                LinkedIn
              </PdfLink>
            )}
            {member.lattes_url && (
              <PdfLink src={member.lattes_url} style={styles.contactItem}>
                Currículo Lattes
              </PdfLink>
            )}
          </View>

          {/* Right Column (Info & Bio) */}
          <View style={styles.rightCol}>
            <Text style={styles.name}>{member.name}</Text>
            <Text style={styles.role}>{member.role}</Text>

            <Text style={styles.sectionTitle}>Sobre</Text>
            <Text style={styles.bio}>{pureBio}</Text>

            {projects && projects.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>Projetos Vinculados</Text>
                {projects.map((project) => (
                  <View key={project.id} style={styles.projectItem}>
                    <Text style={styles.projectTitle}>{project.title}</Text>
                    <Text style={styles.projectMeta}>{project.category} · {project.year}</Text>
                  </View>
                ))}
              </>
            )}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Gerado em: {new Date().toLocaleDateString("pt-BR")}</Text>
          <Text style={styles.footerText}>coletivoatravessamentos.com.br</Text>
        </View>
      </Page>
    </Document>
  )
}
