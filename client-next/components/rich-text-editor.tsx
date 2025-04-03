"use client"

import { useState } from "react"
import { Bold, Italic, List, ListOrdered, Code, Heading1, Heading2, Link, Eye, Edit } from "lucide-react"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ReactMarkdown from "react-markdown"

export function RichTextEditor({ value, onChange }: { 
  value: string; 
  onChange: (value: string) => void 
}) {
  const [activeTab, setActiveTab] = useState("edit")

  // Insert formatting at cursor position
  const insertFormatting = (format: string) => {
    const textarea = document.querySelector("textarea") as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)

    let formattedText = ""
    let cursorOffset = 0

    switch (format) {
      case "bold":
        formattedText = `**${selectedText}**`
        cursorOffset = selectedText.length ? 0 : 2
        break
      case "italic":
        formattedText = `*${selectedText}*`
        cursorOffset = selectedText.length ? 0 : 1
        break
      case "h1":
        formattedText = `# ${selectedText}`
        cursorOffset = selectedText.length ? 0 : 2
        break
      case "h2":
        formattedText = `## ${selectedText}`
        cursorOffset = selectedText.length ? 0 : 3
        break
      case "list":
        formattedText = selectedText
          .split("\n")
          .map((line) => `- ${line}`)
          .join("\n")
        cursorOffset = 2
        break
      case "ordered-list":
        formattedText = selectedText
          .split("\n")
          .map((line, i) => `${i + 1}. ${line}`)
          .join("\n")
        cursorOffset = 3
        break
      case "code":
        if (selectedText.includes("\n")) {
          formattedText = `\`\`\`\n${selectedText}\n\`\`\``
          cursorOffset = 0
        } else {
          formattedText = `\`${selectedText}\``
          cursorOffset = selectedText.length ? 0 : 1
        }
        break
      case "link":
        formattedText = `[${selectedText || "Link text"}](url)`
        cursorOffset = selectedText.length ? 3 : 1
        break
      default:
        formattedText = selectedText
    }

    const newContent = value.substring(0, start) + formattedText + value.substring(end)
    onChange(newContent)

    // Set focus back to textarea and position cursor appropriately
    setTimeout(() => {
      textarea.focus()
      const newPosition = selectedText.length
        ? start + formattedText.length
        : start + formattedText.length - cursorOffset
      textarea.setSelectionRange(newPosition, newPosition)
    }, 0)
  }

  return (
    <div className="border rounded-md">
      <div className="border-b p-2 bg-muted/30">
        <ToggleGroup type="multiple" className="justify-start">
          <ToggleGroupItem value="h1" aria-label="Heading 1" onClick={() => insertFormatting("h1")}>
            <Heading1 className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="h2" aria-label="Heading 2" onClick={() => insertFormatting("h2")}>
            <Heading2 className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="bold" aria-label="Bold" onClick={() => insertFormatting("bold")}>
            <Bold className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="italic" aria-label="Italic" onClick={() => insertFormatting("italic")}>
            <Italic className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="list" aria-label="Bullet list" onClick={() => insertFormatting("list")}>
            <List className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="ordered-list"
            aria-label="Numbered list"
            onClick={() => insertFormatting("ordered-list")}
          >
            <ListOrdered className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="code" aria-label="Code" onClick={() => insertFormatting("code")}>
            <Code className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="link" aria-label="Link" onClick={() => insertFormatting("link")}>
            <Link className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mx-2 mt-2">
          <TabsTrigger value="edit" className="flex items-center gap-2">
            <Edit className="h-4 w-4" /> Edit
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-2">
            <Eye className="h-4 w-4" /> Preview
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="edit" className="mt-0">
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Write your exercise instructions here..."
            className="min-h-[400px] resize-y rounded-none border-0 p-4 focus-visible:ring-0 focus-visible:ring-offset-0 font-mono text-sm"
          />
        </TabsContent>
        
        <TabsContent value="preview" className="mt-0">
          <div className="min-h-[400px] p-4 prose prose-sm max-w-none">
            <ReactMarkdown>{value}</ReactMarkdown>
          </div>
        </TabsContent>
      </Tabs>

      <div className="p-2 border-t text-xs text-muted-foreground">
        <p>
          Use Markdown to format your text. You can use # for headings, ** for bold, * for italic, - for lists, etc.
        </p>
      </div>
    </div>
  )
}

