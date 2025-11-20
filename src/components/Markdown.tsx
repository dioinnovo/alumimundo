import ReactMarkdown from 'react-markdown'
import { cn } from '@/lib/design-tokens'

interface MarkdownProps {
  content: string
  className?: string
}

export default function Markdown({ content, className }: MarkdownProps) {
  return (
    <div className={cn('prose prose-sm dark:prose-invert max-w-none', className)}>
      <ReactMarkdown
        components={{
        // Headings
        h1: ({ node, ...props }) => <h1 className="text-xl font-bold mb-2 mt-4" {...props} />,
        h2: ({ node, ...props }) => <h2 className="text-lg font-bold mb-2 mt-3" {...props} />,
        h3: ({ node, ...props }) => <h3 className="text-base font-bold mb-1 mt-2" {...props} />,

        // Paragraphs
        p: ({ node, ...props }) => <p className="mb-2 leading-relaxed" {...props} />,

        // Lists
        ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-2 space-y-1" {...props} />,
        ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-2 space-y-1" {...props} />,
        li: ({ node, ...props }) => <li className="ml-2" {...props} />,

        // Strong/Bold
        strong: ({ node, ...props }) => <strong className="font-bold text-current" {...props} />,

        // Emphasis/Italic
        em: ({ node, ...props }) => <em className="italic" {...props} />,

        // Code
        code: ({ node, children, ...props }) => {
          // Check if this is a code block (has className) vs inline code
          const isCodeBlock = props.className && /language-(\w+)/.test(props.className as string)
          return isCodeBlock ? (
            <code className="block bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs overflow-x-auto">
              {children}
            </code>
          ) : (
            <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-xs">
              {children}
            </code>
          )
        },

        // Links
        a: ({ node, ...props }) => (
          <a className="text-alumimundo-teal underline hover:text-alumimundo-teal/80" target="_blank" rel="noopener noreferrer" {...props} />
        ),

        // Blockquotes
        blockquote: ({ node, ...props }) => (
          <blockquote className="border-l-4 border-alumimundo-teal pl-3 italic my-2" {...props} />
        ),
      }}
    >
      {content}
    </ReactMarkdown>
    </div>
  )
}
