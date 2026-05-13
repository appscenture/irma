import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion";
import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from "@/components/mode-toggle"
import { Timeline } from "@/components/ui/timeline"
import { CONFIG } from "@/config"
import { fetchSheetData, type SheetData, cleanLink } from "@/lib/sheets"
import { Link as LinkIcon, MapPin, Phone, Instagram, Globe, MessageCircle, Mail, Linkedin, X, Bold, Italic, Underline, Link2, Send } from "lucide-react"
import { FollowerPointerCard } from "@/components/ui/following-pointer";
import { AnimatedTooltip } from "@/components/ui/animated-tooltip";

// Fallback data in case sheet fetch fails or is not configured
const FALLBACK_DATA: SheetData[] = [
  {
    section: "Bio",
    title: "Welcome",
    description: "I am a developer building cool things. Configure your Google Sheet to update this text!",
    image: ["https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=3270&auto=format&fit=crop"]
  }
]

function App() {
  const [sheetData, setSheetData] = useState<SheetData[]>([])
  const [loading, setLoading] = useState(true)

  const [cursorText, setCursorText] = useState<string | React.ReactNode>("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // WhatsApp Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
    inquiry: ""
  });
  const [messageCode, setMessageCode] = useState("");



  useEffect(() => {
    async function loadData() {
      setLoading(true)

      // Load Sheets Data
      try {
        const data = await fetchSheetData(CONFIG.GOOGLE_SHEET_URL)
        if (data.length > 0) {
          setSheetData(data)
        } else {
          // Sheet is connected but empty
          setSheetData([{
            section: "Bio",
            title: "Setup Required",
            description: "Successfully connected to Google Sheets! But the sheet is empty. Please add rows with 'Bio', 'Timeline', or 'Social' in the Section column.",
          }])
        }
      } catch (e) {
        console.error("Failed to load sheet data", e)
        setSheetData(FALLBACK_DATA)
      }

      setLoading(false)
    }

    loadData()
  }, [])

  // Extract Header/Hero section if it exists
  const headerData = sheetData.find(item => item.section.toLowerCase() === "header" || item.section.toLowerCase() === "hero");

  // Group data by section to create timeline entries (excluding Header)
  const sections = sheetData
    .filter(item => item.section.toLowerCase() !== "header" && item.section.toLowerCase() !== "hero")
    .reduce((acc, item) => {
      if (!acc[item.section]) {
        acc[item.section] = [];
      }
      acc[item.section].push(item);
      return acc;
    }, {} as Record<string, SheetData[]>);

  // Preserve order of sections as they appear in the sheet
  const sectionOrder = Array.from(new Set(
    sheetData
      .filter(item => item.section.toLowerCase() !== "header" && item.section.toLowerCase() !== "hero")
      .map(item => item.section)
  ));

  // Prepare Tooltip Data
  const tooltipData = sheetData
    .filter(item => item.section.toLowerCase() === "tooltip" || item.section.toLowerCase() === "team")
    .map((item, idx) => ({
      id: idx,
      name: item.title,
      designation: item.description,
      image: item.image ? item.image[0] : "",
    }));

  // Fallback for Tooltip if empty
  if (tooltipData.length === 0) {
    const bio = sheetData.find(item => item.section === "Bio");
    if (bio && bio.image && bio.image.length > 0) {
      tooltipData.push({
        id: 1,
        name: bio.title,
        designation: "Developer",
        image: bio.image[0]
      });
    }
  }

  const handleContextMenu = async (e: React.MouseEvent) => {
    // Allow default context menu for links and images
    const target = e.target as HTMLElement;
    if (target.closest('a') || target.tagName === 'IMG') {
      return;
    }

    e.preventDefault();
    const selection = window.getSelection()?.toString();
    if (selection) {
      setCursorText("Searching...");
      try {
        const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(selection)}`);
        const data = await response.json();
        if (data.extract) {
          setCursorText(
            <div className="max-w-xs text-xs">
              <p className="line-clamp-3">{data.extract}</p>
            </div>
          );
        } else {
          setCursorText("No definition found");
        }
      } catch (error) {
        setCursorText("Error fetching definition");
      }
    }
  };

  // Reset cursor text when clicking elsewhere
  useEffect(() => {
    const handleClick = () => {
      if (typeof cursorText !== 'string' || (cursorText !== "" && !cursorText.includes("Nes"))) {
        setCursorText("");
      }
    }
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [cursorText]);


  const timelineEntries = [
    ...sectionOrder.map(sectionName => ({
      title: sectionName,
      content: (
        <div
          className="flex flex-col gap-8"
          onMouseEnter={() => setCursorText(sectionName)}
          onMouseLeave={() => setCursorText("")}
        >
          {sections[sectionName].map((item, idx) => (
            <div key={idx}>
              <h4 className="text-lg font-bold mb-2 text-neutral-900 dark:text-neutral-100">
                {item.title}
              </h4>
              {item.description && (
                <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-4">
                  {item.description}
                </p>
              )}
              {item.link && item.link.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {item.link.map((link, idx) => (
                    <a
                      key={idx}
                      href={cleanLink(link)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors text-sm font-medium text-neutral-900 dark:text-neutral-100"
                      onContextMenu={(e) => handleContextMenu(e)}
                      onMouseEnter={() => setCursorText(link)}
                      onMouseLeave={() => setCursorText("")}
                    >
                      <LinkIcon className="w-4 h-4" />
                      Visit Link {item.link && item.link.length > 1 ? idx + 1 : ""}
                    </a>
                  ))}
                </div>
              )}
              {item.image && item.image.length > 0 && (
                <div className={`grid gap-4 mt-4 ${item.image.length === 1 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-2 md:grid-cols-3'}`}>
                  {item.image.map((imgSrc, imgIdx) => (
                    <img
                      key={imgIdx}
                      src={imgSrc}
                      alt={`${item.title} ${imgIdx + 1}`}
                      className="rounded-lg w-full h-auto shadow-lg cursor-zoom-in"
                      referrerPolicy="no-referrer"
                      onClick={() => setSelectedImage(imgSrc)}
                      onMouseEnter={() => setCursorText("View Image")}
                      onMouseLeave={() => setCursorText("")}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )
    })),

    // WhatsApp Contact Form (Always at the end)
    {
      title: "Contact",
      content: (
        <div
          className="flex justify-center items-center w-full min-h-[500px] py-4"
          onMouseEnter={() => setCursorText("Contact")}
          onMouseLeave={() => setCursorText("")}
        >
          <div className="w-full max-w-md bg-neutral-50 dark:bg-neutral-950 rounded-2xl p-8 border border-neutral-200 dark:border-neutral-800 shadow-lg">
            <h3 className="text-2xl font-bold mb-6 text-neutral-900 dark:text-neutral-100 text-center">
              WhatsApp Inquiry Form
            </h3>

            {/* Name Field */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">👤 Name</label>
              <input
                type="text"
                placeholder="Your name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              />
            </div>

            {/* Email Field */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">✉️ Email</label>
              <input
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              />
            </div>

            {/* WhatsApp Field */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">💬 WhatsApp</label>
              <input
                type="tel"
                placeholder="+62 812345678"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              />
            </div>

            {/* Rich Text Editor for Inquiry */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">📝 Inquiry</label>
              <div className="rounded-lg border border-neutral-300 dark:border-neutral-700 overflow-hidden bg-white dark:bg-neutral-900">
                {/* Toolbar */}
                <div className="flex gap-1 p-2 border-b border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 flex-wrap">
                  <button
                    onClick={() => document.execCommand("bold")}
                    className="p-2 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors text-neutral-700 dark:text-neutral-300"
                    title="Bold"
                  >
                    <Bold className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => document.execCommand("italic")}
                    className="p-2 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors text-neutral-700 dark:text-neutral-300"
                    title="Italic"
                  >
                    <Italic className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => document.execCommand("underline")}
                    className="p-2 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors text-neutral-700 dark:text-neutral-300"
                    title="Underline"
                  >
                    <Underline className="w-4 h-4" />
                  </button>
                  <div className="w-px bg-neutral-300 dark:bg-neutral-700"></div>
                  <button
                    onClick={() => {
                      const url = prompt("Enter URL:");
                      if (url) document.execCommand("createLink", false, url);
                    }}
                    className="p-2 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors text-neutral-700 dark:text-neutral-300"
                    title="Add Link"
                  >
                    <Link2 className="w-4 h-4" />
                  </button>
                </div>
                {/* Editor */}
                <div
                  contentEditable
                  suppressContentEditableWarning
                  onInput={(e) => setFormData({ ...formData, inquiry: e.currentTarget.innerHTML })}
                  className="w-full p-3 min-h-32 max-h-48 overflow-y-auto focus:outline-none text-neutral-900 dark:text-white"
                  style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={() => {
                if (!formData.name || !formData.whatsapp || !formData.inquiry) {
                  alert("Please fill in all fields");
                  return;
                }

                // Generate simple message code: DD/MM/YYYY-FirstName (max 5 chars)
                const now = new Date();
                const day = String(now.getDate()).padStart(2, '0');
                const month = String(now.getMonth() + 1).padStart(2, '0');
                const year = now.getFullYear();
                const firstName = formData.name.split(' ')[0].slice(0, 5);
                const code = `${day}${month}${year}-${firstName}`;
                setMessageCode(code);

                // Format the message for WhatsApp
                const cleanInquiry = formData.inquiry.replace(/<[^>]*>/g, ""); // Remove HTML tags
                const message = `${code}

*Name:* ${formData.name}
*Email:* ${formData.email}

*Inquiry:*
${cleanInquiry}`;

                // Generate WhatsApp link
                const phoneNumber = formData.whatsapp.replace(/[^\d+]/g, "");
                const encodedMessage = encodeURIComponent(message);
                const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

                // Open WhatsApp
                window.open(whatsappLink, "_blank");

                // Reset form
                setFormData({ name: "", email: "", whatsapp: "", inquiry: "" });
              }}
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              <Send className="w-4 h-4" />
              Send via WhatsApp
            </button>

            {messageCode && (
              <div className="mt-4 p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-sm text-purple-800 dark:text-purple-300 text-center font-mono font-bold">
                {messageCode}
              </div>
            )}
          </div>
        </div>
      )
    }
  ]

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <div
        className="min-h-screen"
        onContextMenu={handleContextMenu}
      >
        <div className="glow-border fixed top-4 right-4 z-50 rounded-full">
          <ModeToggle />
        </div>
        {loading ? (
          <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 dark:border-white"></div>
          </div>
        ) : (
          <FollowerPointerCard
            title={
              cursorText ? (
                typeof cursorText === 'string' ? (
                  <span className="font-bold text-sm">{cursorText}</span>
                ) : cursorText
              ) : (
                <span className="font-bold text-sm">{headerData?.title || "Nes"}</span>
              )
            }
            className="w-full"
          >
            <Timeline
              data={timelineEntries}
              header={headerData ? {
                title: headerData.title,
                description: headerData.description,
                image: headerData.image ? headerData.image[0] : undefined
              } : undefined}
              socialLinks={[
                { icon: MapPin, text: "Jakarta, ID", href: "https://share.google/Zm0w9TKUvV5ImyE4l" },
                { icon: Mail, text: "nes@gmail.com", href: "mailto:Nes@gmail.com" },
                { icon: Phone, text: "+62 812345678", href: "tel:+62812345678" },
                { icon: Instagram, text: "nezvita", href: "https://instagram.com/nezvita" },
                { icon: Linkedin, text: "in/nezvita", href: "https://linkedin.com/in/nezvita" },
                { icon: Globe, text: "Nes", href: "https://nezvita.vercel.app" },
                { icon: MessageCircle, text: "Discord", href: "https://discord.gg/nezvita" },
              ]}
              onLinkHover={(text) => setCursorText(text || "")}
            />

            {tooltipData.length > 0 && (
              <div className="flex flex-row items-center justify-center py-10 w-full">
                <AnimatedTooltip items={tooltipData} />
              </div>
            )}
          </FollowerPointerCard>
        )}

        {/* Floating Contact Bar */}
        <div className="glow-border fixed bottom-4 left-1/2 -translate-x-1/2 z-40 flex gap-2 bg-white dark:bg-neutral-900 rounded-full px-2 py-2 shadow-lg border border-neutral-200 dark:border-neutral-800">
          <a
            href="mailto:nes@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-8 h-8 rounded-full bg-neutral-50 dark:bg-neutral-800 hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors text-neutral-700 dark:text-neutral-300 hover:text-purple-600 dark:hover:text-purple-400"
            title="Email"
          >
            <Mail className="w-4 h-4" />
          </a>
          <a
            href="tel:+62812345678"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-8 h-8 rounded-full bg-neutral-50 dark:bg-neutral-800 hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors text-neutral-700 dark:text-neutral-300 hover:text-purple-600 dark:hover:text-purple-400"
            title="Phone"
          >
            <Phone className="w-4 h-4" />
          </a>
          <a
            href="https://instagram.com/nezvita"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-8 h-8 rounded-full bg-neutral-50 dark:bg-neutral-800 hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors text-neutral-700 dark:text-neutral-300 hover:text-purple-600 dark:hover:text-purple-400"
            title="Instagram"
          >
            <Instagram className="w-4 h-4" />
          </a>
          <a
            href="https://wa.me/62812345678"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-8 h-8 rounded-full bg-neutral-50 dark:bg-neutral-800 hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors text-neutral-700 dark:text-neutral-300 hover:text-purple-600 dark:hover:text-purple-400"
            title="WhatsApp"
          >
            <MessageCircle className="w-4 h-4" />
          </a>
        </div>

        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImage(null)}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 cursor-zoom-out"
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 left-1/2 -translate-x-1/2 p-3 bg-white text-black hover:bg-neutral-200 rounded-full shadow-lg transition-colors z-50"
              >
                <X className="w-6 h-6" />
              </button>
              <motion.img
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                src={selectedImage}
                alt="Full screen preview"
                className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ThemeProvider>
  )
}

// Helper to map string types to Lucide icons


export default App
