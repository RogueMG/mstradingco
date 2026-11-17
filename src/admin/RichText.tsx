import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Heading3, Italic, List, Pilcrow } from "lucide-react";

interface RichTextProps {
  value: string;
  onChange: (html: string) => void;
}

/**
 * Description editor limited to what the site renders: paragraphs, h3
 * headings, bullet lists, bold and italic. The server sanitises the HTML too.
 */
function RichText({ value, onChange }: RichTextProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [3] },
        blockquote: false,
        code: false,
        codeBlock: false,
        horizontalRule: false,
        strike: false,
        orderedList: false,
        link: false,
        underline: false,
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: "rich-text min-h-40 px-4 py-3 outline-none",
        "aria-label": "Description",
      },
    },
    onUpdate: ({ editor: instance }) => onChange(instance.isEmpty ? "" : instance.getHTML()),
  });

  const state = useEditorState({
    editor,
    selector: ({ editor: instance }) => ({
      bold: instance?.isActive("bold") ?? false,
      italic: instance?.isActive("italic") ?? false,
      heading: instance?.isActive("heading", { level: 3 }) ?? false,
      bullet: instance?.isActive("bulletList") ?? false,
    }),
  });

  const tool = (label: string, active: boolean, onClick: () => void, Icon: typeof Bold) => (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      title={label}
      // Keep focus (and the cursor) in the editor when using the toolbar.
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-md transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b5fa5] ${
        active ? "bg-[#063b73] text-white" : "text-slate-600 hover:bg-slate-100"
      }`}
    >
      <Icon size={16} aria-hidden="true" />
    </button>
  );

  return (
    <div className="mt-1.5 overflow-hidden rounded-lg border border-slate-300 bg-white focus-within:border-[#0b5fa5] focus-within:ring-4 focus-within:ring-[#0b5fa5]/10">
      <div className="flex gap-1 border-b border-slate-200 bg-slate-50 p-1">
        {tool("Paragraph", false, () => editor?.chain().focus().setParagraph().run(), Pilcrow)}
        {tool("Heading", state?.heading ?? false, () => editor?.chain().focus().toggleHeading({ level: 3 }).run(), Heading3)}
        {tool("Bold", state?.bold ?? false, () => editor?.chain().focus().toggleBold().run(), Bold)}
        {tool("Italic", state?.italic ?? false, () => editor?.chain().focus().toggleItalic().run(), Italic)}
        {tool("Bullet list", state?.bullet ?? false, () => editor?.chain().focus().toggleBulletList().run(), List)}
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}

export default RichText;
